begin;

alter table public.drive_provisioning_jobs
add column if not exists result jsonb
not null default '{}'::jsonb;


-- =========================================================
-- CLAIM THE NEXT AVAILABLE JOB
-- =========================================================

create or replace function public.drive_worker_claim_job(
  worker_name text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $function$
declare
  claimed_job public.drive_provisioning_jobs;
  drive_account public.drive_accounts;
begin
  if worker_name is null
     or char_length(btrim(worker_name)) < 3
     or char_length(worker_name) > 100 then
    raise exception 'A valid worker name is required.';
  end if;

  select *
  into claimed_job
  from public.drive_provisioning_jobs
  where status = 'pending'
    and available_at <= now()
  order by created_at, id
  for update skip locked
  limit 1;

  if not found then
    return null;
  end if;

  update public.drive_provisioning_jobs
  set
    status = 'processing',
    attempts = attempts + 1,
    locked_at = now(),
    locked_by = btrim(worker_name),
    last_error = null
  where id = claimed_job.id
  returning *
  into claimed_job;

  select *
  into drive_account
  from public.drive_accounts
  where user_id = claimed_job.user_id;

  return jsonb_build_object(
    'job',
    to_jsonb(claimed_job),
    'account',
    to_jsonb(drive_account)
  );
end;
$function$;


-- =========================================================
-- MARK A JOB AS COMPLETED
-- =========================================================

create or replace function public.drive_worker_complete_job(
  target_job_id bigint,
  worker_name text,
  job_result jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $function$
declare
  completed_job public.drive_provisioning_jobs;
begin
  update public.drive_provisioning_jobs
  set
    status = 'completed',
    completed_at = now(),
    result = coalesce(job_result, '{}'::jsonb),
    last_error = null
  where id = target_job_id
    and status = 'processing'
    and locked_by = btrim(worker_name)
  returning *
  into completed_job;

  if not found then
    raise exception
      'The job is not processing or belongs to another worker.';
  end if;

  if completed_job.action in ('provision', 'restore') then
    update public.drive_accounts
    set
      lifecycle_status = 'active',
      provisioned_at = coalesce(provisioned_at, now()),
      suspended_at = null,
      deletion_scheduled_at = null,
      last_error = null
    where user_id = completed_job.user_id;

  elsif completed_job.action = 'suspend' then
    update public.drive_accounts
    set
      lifecycle_status = 'suspended',
      suspended_at = now(),
      last_error = null
    where user_id = completed_job.user_id;

  elsif completed_job.action = 'approve_deletion' then
    update public.drive_accounts
    set
      lifecycle_status = 'deleted',
      deleted_at = now(),
      last_error = null
    where user_id = completed_job.user_id;

  elsif completed_job.action = 'cancel_deletion' then
    update public.drive_accounts
    set
      lifecycle_status = 'suspended',
      deletion_scheduled_at = null,
      last_error = null
    where user_id = completed_job.user_id;
  end if;
end;
$function$;


-- =========================================================
-- FAIL OR RETRY A JOB
-- =========================================================

create or replace function public.drive_worker_fail_job(
  target_job_id bigint,
  worker_name text,
  failure_message text,
  retry_after_seconds integer default 300
)
returns void
language plpgsql
security definer
set search_path = public
as $function$
declare
  failed_job public.drive_provisioning_jobs;
  next_status text;
begin
  if failure_message is null
     or btrim(failure_message) = '' then
    raise exception 'A failure message is required.';
  end if;

  select *
  into failed_job
  from public.drive_provisioning_jobs
  where id = target_job_id
    and status = 'processing'
    and locked_by = btrim(worker_name)
  for update;

  if not found then
    raise exception
      'The job is not processing or belongs to another worker.';
  end if;

  if failed_job.attempts >= 5 then
    next_status := 'failed';
  else
    next_status := 'pending';
  end if;

  update public.drive_provisioning_jobs
  set
    status = next_status,
    available_at =
      case
        when next_status = 'pending'
          then now() + make_interval(
            secs => greatest(
              30,
              least(
                coalesce(retry_after_seconds, 300),
                86400
              )
            )
          )
        else available_at
      end,
    locked_at = null,
    locked_by = null,
    last_error = left(btrim(failure_message), 2000)
  where id = target_job_id;

  update public.drive_accounts
  set
    lifecycle_status =
      case
        when next_status = 'failed'
          then 'error'
        else lifecycle_status
      end,
    last_error = left(btrim(failure_message), 2000)
  where user_id = failed_job.user_id;
end;
$function$;


-- =========================================================
-- FUNCTION SECURITY
-- =========================================================

revoke all
on function public.drive_worker_claim_job(text)
from public, anon, authenticated;

revoke all
on function public.drive_worker_complete_job(
  bigint,
  text,
  jsonb
)
from public, anon, authenticated;

revoke all
on function public.drive_worker_fail_job(
  bigint,
  text,
  text,
  integer
)
from public, anon, authenticated;

grant execute
on function public.drive_worker_claim_job(text)
to service_role;

grant execute
on function public.drive_worker_complete_job(
  bigint,
  text,
  jsonb
)
to service_role;

grant execute
on function public.drive_worker_fail_job(
  bigint,
  text,
  text,
  integer
)
to service_role;

commit;