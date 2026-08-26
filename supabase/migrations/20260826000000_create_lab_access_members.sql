-- Meet Shawon Cybersecurity Lab access entitlement.
-- Admin accounts receive implicit access in the application.
-- Other approved users require one active row in this table.

create table if not exists public.lab_access_members (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  access_level text not null default 'member'
    check (access_level in ('member', 'operator')),
  status text not null default 'active'
    check (status in ('active', 'suspended', 'revoked')),
  granted_by uuid references public.profiles(id) on delete set null,
  granted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  notes text
);

alter table public.lab_access_members enable row level security;

create policy "Lab members can read their own entitlement"
on public.lab_access_members
for select
to authenticated
using (auth.uid() = user_id);

create policy "Admins can read all lab entitlements"
on public.lab_access_members
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy "Admins can create lab entitlements"
on public.lab_access_members
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy "Admins can update lab entitlements"
on public.lab_access_members
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy "Admins can delete lab entitlements"
on public.lab_access_members
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create index if not exists lab_access_members_status_idx
  on public.lab_access_members(status);

comment on table public.lab_access_members is
  'Explicit access grants for the private Meet Shawon Cybersecurity Lab.';
