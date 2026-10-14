begin;

-- Credentials, password hashes and sessions belong to Supabase auth.users, never this table.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 120),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
revoke all on table public.profiles from public, anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (full_name) on table public.profiles to authenticated;

create policy "Students read their own profile"
on public.profiles for select to authenticated
using ((select auth.uid()) = id);

create policy "Students update their own name"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- No client insert/delete or role field. Account creation owns profile insertion.
create function public.handle_new_student()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 120));
  return new;
end;
$$;
revoke all on function public.handle_new_student() from public, anon, authenticated;

create trigger on_auth_student_created
after insert on auth.users
for each row execute procedure public.handle_new_student();

-- Populate profiles for accounts that existed before this migration.
insert into public.profiles (id, full_name)
select id, left(coalesce(raw_user_meta_data ->> 'full_name', ''), 120) from auth.users
on conflict (id) do nothing;

commit;
