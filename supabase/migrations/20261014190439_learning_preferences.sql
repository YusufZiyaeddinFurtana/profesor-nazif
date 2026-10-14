begin;

alter table public.profiles
  add column interest_programs text[] not null default '{}',
  add column focus_areas text[] not null default '{}',
  add constraint profiles_interest_programs_valid check (
    interest_programs <@ array['FRC','FTC','FLL']::text[]
    and cardinality(interest_programs) <= 3
    and array_position(interest_programs, null) is null
  ),
  add constraint profiles_focus_areas_valid check (
    focus_areas <@ array['engineering','business']::text[]
    and cardinality(focus_areas) <= 2
    and array_position(focus_areas, null) is null
  );

grant update (interest_programs, focus_areas) on public.profiles to authenticated;

-- Keep the existing ownership policies. Metadata supplies preferences, never authorization.
create or replace function public.handle_new_student()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, interest_programs, focus_areas)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 120),
    array(select distinct value from jsonb_array_elements_text(
      case when jsonb_typeof(new.raw_user_meta_data -> 'interest_programs') = 'array'
        then new.raw_user_meta_data -> 'interest_programs' else '[]'::jsonb end
    ) as items(value) where value in ('FRC','FTC','FLL') order by value),
    array(select distinct value from jsonb_array_elements_text(
      case when jsonb_typeof(new.raw_user_meta_data -> 'focus_areas') = 'array'
        then new.raw_user_meta_data -> 'focus_areas' else '[]'::jsonb end
    ) as items(value) where value in ('engineering','business') order by value)
  );
  return new;
end;
$$;
revoke all on function public.handle_new_student() from public, anon, authenticated;

commit;
