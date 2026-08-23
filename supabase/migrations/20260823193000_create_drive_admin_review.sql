begin;

-- =====================================================
-- ADMIN-ONLY DRIVE ACCOUNT REVIEW
-- =====================================================

create or replace function public.admin_list_drive_accounts()
returns table (
  user_id uuid,
  website_username text,
  dataset_name text,
  nextcloud_username text,
  quota_bytes bigint,
  lifecycle_status text,
  deletion_scheduled_at timestamptz,
  provisioned_at timestamptz,
  suspended_at timestamptz,
  deleted_at timestamptz,
  last_error text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_role user_role;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in.';
  end if;

  select role
  into current_user_role
  from public.profiles
  where id = auth.uid();

  if current_user_role is distinct from 'admin'::user_role then
    raise exception 'Only administrators can review Drive accounts.';
  end if;

  return query
  select
    account.user_id,
    account.website_username,
    account.dataset_name,
    account.nextcloud_username,
    account.quota_bytes,
    account.lifecycle_status,
    account.deletion_scheduled_at,
    account.provisioned_at,
    account.suspended_at,
    account.deleted_at,
    account.last_error,
    account.created_at,
    account.updated_at
  from public.drive_accounts as account
  order by
    case account.lifecycle_status
      when 'deletion_due' then 1
      when 'error' then 2
      when 'suspension_pending' then 3
      when 'suspended' then 4
      when 'active' then 5
      when 'provisioning' then 6
      when 'deleted' then 7
      else 8
    end,
    account.deletion_scheduled_at nulls last,
    account.updated_at desc;
end;
$$;

revoke all
on function public.admin_list_drive_accounts()
from public;

grant execute
on function public.admin_list_drive_accounts()
to authenticated;

-- =====================================================
-- MANUAL PERMANENT-DELETION APPROVAL
-- =====================================================

create or replace function public.admin_approve_drive_deletion(
  target_user_id uuid
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_role user_role;
  target_role user_role;
  target_account public.drive_accounts%rowtype;
  queued_job_id bigint;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in.';
  end if;

  select role
  into current_user_role
  from public.profiles
  where id = auth.uid();

  if current_user_role is distinct from 'admin'::user_role then
    raise exception 'Only administrators can approve Drive data deletion.';
  end if;

  if target_user_id = auth.uid() then
    raise exception 'You cannot approve deletion of your own Drive account.';
  end if;

  select role
  into target_role
  from public.profiles
  where id = target_user_id;

  if target_role is null then
    raise exception 'Target user profile was not found.';
  end if;

  if target_role = 'partner'::user_role then
    raise exception 'Restore or suspend the partner before approving deletion.';
  end if;

  select *
  into target_account
  from public.drive_accounts
  where user_id = target_user_id
  for update;

  if not found then
    raise exception 'Drive account was not found.';
  end if;

  if target_account.lifecycle_status not in ('suspended', 'deletion_due') then
    raise exception 'Drive account is not eligible for deletion approval.';
  end if;

  if target_account.deletion_scheduled_at is null then
    raise exception 'No Drive deletion deadline is scheduled.';
  end if;

  if target_account.deletion_scheduled_at > now() then
    raise exception 'The 30-day Drive data retention period has not ended.';
  end if;

  if exists (
    select 1
    from public.drive_provisioning_jobs
    where user_id = target_user_id
      and action = 'approve_deletion'
      and status in ('pending', 'processing')
  ) then
    raise exception 'A Drive deletion approval job is already pending.';
  end if;

  update public.drive_accounts
  set
    lifecycle_status = 'deletion_due',
    last_error = null
  where user_id = target_user_id;

  insert into public.drive_provisioning_jobs (
    user_id,
    action,
    status,
    attempts,
    available_at,
    payload,
    result,
    requested_by
  )
  values (
    target_user_id,
    'approve_deletion',
    'pending',
    0,
    now(),
    jsonb_build_object(
      'manual_approval', true,
      'approved_by', auth.uid(),
      'approved_at', now(),
      'dataset_name', target_account.dataset_name,
      'nextcloud_username', target_account.nextcloud_username
    ),
    '{}'::jsonb,
    auth.uid()
  )
  returning id into queued_job_id;

  return queued_job_id;
end;
$$;

revoke all
on function public.admin_approve_drive_deletion(uuid)
from public;

grant execute
on function public.admin_approve_drive_deletion(uuid)
to authenticated;

-- =====================================================
-- CANCEL A SCHEDULED OR PENDING DELETION
-- =====================================================

create or replace function public.admin_cancel_drive_deletion(
  target_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_role user_role;
  target_account public.drive_accounts%rowtype;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in.';
  end if;

  select role
  into current_user_role
  from public.profiles
  where id = auth.uid();

  if current_user_role is distinct from 'admin'::user_role then
    raise exception 'Only administrators can cancel Drive deletion.';
  end if;

  select *
  into target_account
  from public.drive_accounts
  where user_id = target_user_id
  for update;

  if not found then
    raise exception 'Drive account was not found.';
  end if;

  if target_account.lifecycle_status = 'deleted' then
    raise exception 'This Drive dataset has already been deleted.';
  end if;

  if exists (
    select 1
    from public.drive_provisioning_jobs
    where user_id = target_user_id
      and action = 'approve_deletion'
      and status = 'processing'
  ) then
    raise exception 'Deletion is already being processed and cannot be cancelled.';
  end if;

  update public.drive_provisioning_jobs
  set
    status = 'cancelled',
    last_error = 'Deletion cancelled by an administrator.'
  where user_id = target_user_id
    and action = 'approve_deletion'
    and status = 'pending';

  update public.drive_accounts
  set
    lifecycle_status = 'suspended',
    deletion_scheduled_at = null,
    last_error = null
  where user_id = target_user_id;
end;
$$;

revoke all
on function public.admin_cancel_drive_deletion(uuid)
from public;

grant execute
on function public.admin_cancel_drive_deletion(uuid)
to authenticated;

commit;