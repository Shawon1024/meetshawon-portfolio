begin;

-- =========================================================
-- DRIVE ACCOUNT LIFECYCLE
-- =========================================================

create table if not exists public.drive_accounts (
  user_id uuid primary key,
  website_username text not null unique,
  dataset_name text not null unique,
  nextcloud_username text not null unique,

  quota_bytes bigint not null default 108447924224,

  lifecycle_status text not null default 'provisioning'
    check (
      lifecycle_status in (
        'provisioning',
        'active',
        'suspension_pending',
        'suspended',
        'deletion_due',
        'deleted',
        'error'
      )
    ),

  deletion_scheduled_at timestamptz,
  provisioned_at timestamptz,
  suspended_at timestamptz,
  deleted_at timestamptz,
  last_error text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint drive_accounts_username_format
    check (
      website_username ~ '^[a-z0-9][a-z0-9._]{2,29}$'
    ),

  constraint drive_accounts_dataset_format
    check (
      dataset_name ~ '^meetshawon_[a-z0-9][a-z0-9._]{2,29}$'
    ),

  constraint drive_accounts_quota_positive
    check (quota_bytes > 0)
);

comment on column public.drive_accounts.quota_bytes is
  'Hard ZFS quota requested for the user dataset. Default is 101 GiB.';


-- =========================================================
-- PROVISIONING JOB QUEUE
-- =========================================================

create table if not exists public.drive_provisioning_jobs (
  id bigint generated always as identity primary key,

  user_id uuid not null
    references public.drive_accounts(user_id)
    on delete restrict,

  action text not null
    check (
      action in (
        'provision',
        'suspend',
        'restore',
        'approve_deletion',
        'cancel_deletion'
      )
    ),

  status text not null default 'pending'
    check (
      status in (
        'pending',
        'processing',
        'completed',
        'failed',
        'cancelled'
      )
    ),

  attempts integer not null default 0
    check (attempts >= 0),

  available_at timestamptz not null default now(),
  locked_at timestamptz,
  locked_by text,
  completed_at timestamptz,

  payload jsonb not null default '{}'::jsonb,
  last_error text,

  requested_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists
  drive_provisioning_jobs_pending_index
on public.drive_provisioning_jobs (
  status,
  available_at,
  created_at
);

create unique index if not exists
  drive_provisioning_jobs_active_action_unique
on public.drive_provisioning_jobs (
  user_id,
  action
)
where status in ('pending', 'processing');


-- =========================================================
-- AUTOMATIC UPDATED_AT
-- =========================================================

create or replace function public.set_drive_updated_at()
returns trigger
language plpgsql
set search_path = public
as $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

drop trigger if exists
  drive_accounts_set_updated_at
on public.drive_accounts;

create trigger drive_accounts_set_updated_at
before update on public.drive_accounts
for each row
execute function public.set_drive_updated_at();

drop trigger if exists
  drive_jobs_set_updated_at
on public.drive_provisioning_jobs;

create trigger drive_jobs_set_updated_at
before update on public.drive_provisioning_jobs
for each row
execute function public.set_drive_updated_at();


-- =========================================================
-- SECURITY
-- No browser user may read or modify the worker queue.
-- =========================================================

alter table public.drive_accounts
  enable row level security;

alter table public.drive_provisioning_jobs
  enable row level security;

revoke all
on public.drive_accounts
from anon, authenticated;

revoke all
on public.drive_provisioning_jobs
from anon, authenticated;

grant all
on public.drive_accounts
to service_role;

grant all
on public.drive_provisioning_jobs
to service_role;

grant usage, select
on sequence public.drive_provisioning_jobs_id_seq
to service_role;


-- =========================================================
-- EXTEND ADMIN ROLE MANAGEMENT
-- =========================================================

create or replace function public.admin_set_user_role(
  target_user_id uuid,
  new_role public.user_role
)
returns void
language plpgsql
security definer
set search_path = public
as $function$
declare
  current_user_role public.user_role;
  previous_role public.user_role;
  target_username text;
begin
  -- Require authentication.
  if auth.uid() is null then
    raise exception 'You must be signed in.';
  end if;

  -- Only administrators may change roles.
  select role
  into current_user_role
  from public.profiles
  where id = auth.uid();

  if current_user_role is distinct from 'admin'::public.user_role then
    raise exception
      'Only administrators can change user roles.';
  end if;

  -- Prevent administrators changing their own role.
  if target_user_id = auth.uid() then
    raise exception
      'You cannot change your own administrator role here.';
  end if;

  -- Lock and load the target profile.
  select
    role,
    username
  into
    previous_role,
    target_username
  from public.profiles
  where id = target_user_id
  for update;

  if not found then
    raise exception 'User profile not found.';
  end if;

  -- No work is required when the role is unchanged.
  if previous_role = new_role then
    return;
  end if;

  -- Partner provisioning requires a safe permanent username.
  if new_role = 'partner'::public.user_role then
    if target_username is null
       or target_username !~ '^[a-z0-9][a-z0-9._]{2,29}$' then
      raise exception
        'A valid username is required before granting Partner access.';
    end if;
  end if;

  -- Update the website role.
  update public.profiles
  set role = new_role
  where id = target_user_id;

  -- -------------------------------------------------------
  -- PARTNER GRANTED
  -- -------------------------------------------------------

  if new_role = 'partner'::public.user_role then
    insert into public.drive_accounts (
      user_id,
      website_username,
      dataset_name,
      nextcloud_username,
      quota_bytes,
      lifecycle_status,
      deletion_scheduled_at,
      suspended_at,
      deleted_at,
      last_error
    )
    values (
      target_user_id,
      target_username,
      'meetshawon_' || target_username,
      target_username,
      108447924224,
      'provisioning',
      null,
      null,
      null,
      null
    )
    on conflict (user_id)
    do update set
      website_username = excluded.website_username,
      dataset_name = excluded.dataset_name,
      nextcloud_username = excluded.nextcloud_username,
      quota_bytes = excluded.quota_bytes,
      lifecycle_status = 'provisioning',
      deletion_scheduled_at = null,
      suspended_at = null,
      deleted_at = null,
      last_error = null;

    -- Cancel pending suspension/deletion operations.
    update public.drive_provisioning_jobs
    set
      status = 'cancelled',
      completed_at = now(),
      last_error = null
    where user_id = target_user_id
      and action in (
        'suspend',
        'approve_deletion'
      )
      and status = 'pending';

    -- Queue an idempotent provisioning job.
    if not exists (
      select 1
      from public.drive_provisioning_jobs
      where user_id = target_user_id
        and action = 'provision'
        and status in ('pending', 'processing')
    ) then
      insert into public.drive_provisioning_jobs (
        user_id,
        action,
        requested_by,
        payload
      )
      values (
        target_user_id,
        'provision',
        auth.uid(),
        jsonb_build_object(
          'quota_bytes',
          108447924224,
          'require_password_change',
          true,
          'public_read_only_sharing',
          true
        )
      );
    end if;
  end if;

  -- -------------------------------------------------------
  -- PARTNER REMOVED
  -- -------------------------------------------------------

  if previous_role = 'partner'::public.user_role
     and new_role <> 'partner'::public.user_role then

    update public.drive_accounts
    set
      lifecycle_status = 'suspension_pending',
      deletion_scheduled_at = now() + interval '30 days',
      last_error = null
    where user_id = target_user_id;

    -- Provisioning that has not started is no longer needed.
    update public.drive_provisioning_jobs
    set
      status = 'cancelled',
      completed_at = now()
    where user_id = target_user_id
      and action in ('provision', 'restore')
      and status = 'pending';

    -- Queue immediate access suspension.
    if not exists (
      select 1
      from public.drive_provisioning_jobs
      where user_id = target_user_id
        and action = 'suspend'
        and status in ('pending', 'processing')
    ) then
      insert into public.drive_provisioning_jobs (
        user_id,
        action,
        requested_by,
        payload
      )
      values (
        target_user_id,
        'suspend',
        auth.uid(),
        jsonb_build_object(
          'retention_days',
          30,
          'delete_automatically',
          false,
          'send_email',
          true
        )
      );
    end if;
  end if;
end;
$function$;


-- =========================================================
-- BACKFILL EXISTING PARTNERS
-- This includes the one Partner currently in your database.
-- =========================================================

insert into public.drive_accounts (
  user_id,
  website_username,
  dataset_name,
  nextcloud_username,
  quota_bytes,
  lifecycle_status
)
select
  id,
  username,
  'meetshawon_' || username,
  username,
  108447924224,
  'provisioning'
from public.profiles
where role = 'partner'::public.user_role
  and username is not null
on conflict (user_id)
do nothing;

insert into public.drive_provisioning_jobs (
  user_id,
  action,
  requested_by,
  payload
)
select
  account.user_id,
  'provision',
  null,
  jsonb_build_object(
    'quota_bytes',
    108447924224,
    'require_password_change',
    true,
    'public_read_only_sharing',
    true,
    'backfilled',
    true
  )
from public.drive_accounts account
where account.lifecycle_status = 'provisioning'
  and not exists (
    select 1
    from public.drive_provisioning_jobs job
    where job.user_id = account.user_id
      and job.action = 'provision'
      and job.status in ('pending', 'processing')
  );

commit;