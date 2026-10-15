-- Only server-managed, published materials can accrue student progress.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create table public.learning_courses (
  id text primary key,
  program text not null check (program in ('FRC','FTC','FLL')),
  category_slug text not null,
  title text not null,
  is_published boolean not null default false,
  unique(program, category_slug)
);
create table public.lesson_materials (
  lesson_id text primary key,
  title text not null,
  youtube_video_id text check (youtube_video_id ~ '^[A-Za-z0-9_-]{11}$'),
  video_duration_seconds integer check (video_duration_seconds between 1 and 86400),
  exercise_path text check (exercise_path ~ '^[A-Za-z0-9/_-]+\.pdf$' and exercise_path !~ '(^|/)\.\.(/|$)'),
  is_published boolean not null default false,
  check (not is_published or (youtube_video_id is not null and video_duration_seconds is not null and exercise_path is not null))
);
create table public.course_lessons (
  course_id text not null references public.learning_courses(id) on delete cascade,
  lesson_id text not null references public.lesson_materials(lesson_id) on delete cascade,
  sort_order integer not null check(sort_order >= 0),
  primary key(course_id, lesson_id)
);
create index course_lessons_lesson_idx on public.course_lessons(lesson_id);
create table public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null references public.lesson_materials(lesson_id) on delete cascade,
  watched_ranges int4multirange not null default '{}',
  watched_seconds integer not null default 0 check (watched_seconds >= 0),
  video_completed_at timestamptz,
  exercise_completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key(user_id,lesson_id)
);
create index lesson_progress_lesson_idx on public.lesson_progress(lesson_id);
create table public.course_completions (
  id uuid not null unique default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null references public.learning_courses(id) on delete cascade,
  completed_at timestamptz not null default now(),
  notification_sent_at timestamptz,
  notification_claimed_until timestamptz,
  notification_claim_token uuid,
  notification_attempts integer not null default 0,
  primary key(user_id,course_id)
);
create index course_completions_course_idx on public.course_completions(course_id);
create index course_completions_pending_idx on public.course_completions(completed_at) where notification_sent_at is null;

alter table public.learning_courses enable row level security;
alter table public.lesson_materials enable row level security;
alter table public.course_lessons enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.course_completions enable row level security;
revoke all on public.learning_courses, public.lesson_materials, public.course_lessons, public.lesson_progress, public.course_completions from public, anon, authenticated;
grant select on public.learning_courses, public.lesson_materials, public.course_lessons to authenticated;
grant select(user_id,lesson_id,watched_seconds,video_completed_at,exercise_completed_at,updated_at) on public.lesson_progress to authenticated;
grant select(id,user_id,course_id,completed_at,notification_sent_at) on public.course_completions to authenticated;
grant all on public.learning_courses, public.lesson_materials, public.course_lessons, public.lesson_progress, public.course_completions to service_role;
create policy "published courses" on public.learning_courses for select to authenticated using(is_published);
create policy "published lesson materials" on public.lesson_materials for select to authenticated using(is_published);
create policy "published course membership" on public.course_lessons for select to authenticated using(exists(select 1 from public.learning_courses c where c.id=course_id));
create policy "own lesson progress" on public.lesson_progress for select to authenticated using((select auth.uid())=user_id);
create policy "own course completions" on public.course_completions for select to authenticated using((select auth.uid())=user_id);

-- Never callable by a client. Queue once only when the entire published course is complete.
create function private.check_course_completions(p_lesson_id text) returns void
language plpgsql security definer set search_path='' as $$
declare v_user uuid := auth.uid(); v_course text;
begin
  if v_user is null then raise exception 'Sign in required' using errcode='42501'; end if;
  for v_course in select cl.course_id from public.course_lessons cl join public.learning_courses c on c.id=cl.course_id where cl.lesson_id=p_lesson_id and c.is_published loop
    perform pg_advisory_xact_lock(hashtextextended(v_user::text || '/' || v_course,0));
    if not exists (
      select 1 from public.course_lessons cl join public.lesson_materials m on m.lesson_id=cl.lesson_id
      left join public.lesson_progress p on p.lesson_id=m.lesson_id and p.user_id=v_user
      where cl.course_id=v_course and (not m.is_published or p.video_completed_at is null or p.exercise_completed_at is null)
    ) then
      insert into public.course_completions(user_id,course_id) values(v_user,v_course) on conflict do nothing;
    end if;
  end loop;
end $$;
revoke all on function private.check_course_completions(text) from public,anon,authenticated;

create function private.record_lesson_watch(p_lesson_id text,p_from integer,p_to integer)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_user uuid := auth.uid(); v_duration integer; v_progress public.lesson_progress; v_ranges int4multirange; v_seconds integer;
begin
  if v_user is null then raise exception 'Sign in required' using errcode='42501'; end if;
  select video_duration_seconds into v_duration from public.lesson_materials where lesson_id=p_lesson_id and is_published;
  if v_duration is null then raise exception 'Lesson is not published' using errcode='22023'; end if;
  if p_from is null or p_to is null or p_from<0 or p_to<=p_from or p_to-p_from>15 or p_to>v_duration then
    raise exception 'Invalid watch interval' using errcode='22023';
  end if;
  insert into public.lesson_progress(user_id,lesson_id) values(v_user,p_lesson_id) on conflict do nothing;
  select * into v_progress from public.lesson_progress where user_id=v_user and lesson_id=p_lesson_id for update;
  v_ranges := v_progress.watched_ranges + int4multirange(int4range(p_from,p_to,'[)'));
  select coalesce(sum(upper(r)-lower(r)),0)::integer into v_seconds from unnest(v_ranges) r;
  update public.lesson_progress set watched_ranges=v_ranges,watched_seconds=v_seconds,
    video_completed_at=case when v_seconds>=ceil(v_duration*0.95) then coalesce(video_completed_at,now()) else video_completed_at end,
    updated_at=now() where user_id=v_user and lesson_id=p_lesson_id returning * into v_progress;
  perform private.check_course_completions(p_lesson_id);
  return to_jsonb(v_progress)-'watched_ranges';
end $$;
create function private.complete_lesson_exercise(p_lesson_id text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_user uuid := auth.uid(); v_progress public.lesson_progress;
begin
  if v_user is null then raise exception 'Sign in required' using errcode='42501'; end if;
  if not exists(select 1 from public.lesson_materials where lesson_id=p_lesson_id and is_published and exercise_path is not null) then
    raise exception 'Exercise is not published' using errcode='22023';
  end if;
  insert into public.lesson_progress(user_id,lesson_id,exercise_completed_at) values(v_user,p_lesson_id,now())
    on conflict(user_id,lesson_id) do update set exercise_completed_at=coalesce(public.lesson_progress.exercise_completed_at,now()),updated_at=now()
    returning * into v_progress;
  perform private.check_course_completions(p_lesson_id);
  return to_jsonb(v_progress)-'watched_ranges';
end $$;
revoke all on function private.record_lesson_watch(text,integer,integer),private.complete_lesson_exercise(text) from public,anon;
grant execute on function private.record_lesson_watch(text,integer,integer),private.complete_lesson_exercise(text) to authenticated;
create function public.record_lesson_watch(p_lesson_id text,p_from integer,p_to integer)
returns jsonb language sql security invoker set search_path='' as $$select private.record_lesson_watch(p_lesson_id,p_from,p_to)$$;
create function public.complete_lesson_exercise(p_lesson_id text)
returns jsonb language sql security invoker set search_path='' as $$select private.complete_lesson_exercise(p_lesson_id)$$;
revoke all on function public.record_lesson_watch(text,integer,integer),public.complete_lesson_exercise(text) from public,anon;
grant execute on function public.record_lesson_watch(text,integer,integer),public.complete_lesson_exercise(text) to authenticated;

-- Server-only outbox claim, with a lease and stable idempotency identity.
create function public.claim_certificate_notifications()
returns table(id uuid,user_id uuid,course_id text,course_title text,claim_token uuid)
language sql security invoker set search_path='' as $$
  with candidates as (
    select c.id from public.course_completions c where c.notification_sent_at is null
      and (c.notification_claimed_until is null or c.notification_claimed_until<now())
    order by c.completed_at limit 20 for update skip locked
  ), claimed as (
    update public.course_completions c set notification_claimed_until=now()+interval '5 minutes',
      notification_claim_token=gen_random_uuid(),notification_attempts=notification_attempts+1
    from candidates q where c.id=q.id returning c.id,c.user_id,c.course_id,c.notification_claim_token
  ) select c.id,c.user_id,c.course_id,l.title,c.notification_claim_token from claimed c join public.learning_courses l on l.id=c.course_id;
$$;
revoke all on function public.claim_certificate_notifications() from public,anon,authenticated;
grant execute on function public.claim_certificate_notifications() to service_role;

-- PDFs are private; students can download only a published lesson's actual file.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('lesson-exercises','lesson-exercises',false,10485760,array['application/pdf']) on conflict(id) do nothing;
create policy "students read published exercises" on storage.objects for select to authenticated using(
  bucket_id='lesson-exercises' and exists(select 1 from public.lesson_materials m where m.is_published and m.exercise_path=name)
);

-- Existing catalog identities only; all content stays draft until real materials arrive.
insert into public.learning_courses(id,program,category_slug,title) values
('frc/scouting','FRC','scouting','Scouting'),
('frc/mechanics','FRC','mechanics','Mechanics'),
('frc/programming','FRC','programming','Programming'),
('frc/electronics','FRC','electronics','Electronics'),
('frc/fundraising','FRC','fundraising','Fundraising'),
('frc/sustainability','FRC','sustainability','Sustainability'),
('frc/leadership','FRC','leadership','Leadership'),
('frc/first','FRC','first','FIRST'),
('frc/media','FRC','media','Media'),
('frc/business-management','FRC','business-management','Business Management'),
('fll/robot-yapimi','FLL','robot-yapimi','Robot Yapımı'),
('fll/programlama','FLL','programlama','Programlama'),
('fll/ozdegerler','FLL','ozdegerler','Özdeğerler'),
('fll/proje','FLL','proje','Proje'),
('ftc/mechanics','FTC','mechanics','Mekanik'),
('ftc/electronics','FTC','electronics','Elektronik'),
('ftc/programming','FTC','programming','Yazılım'),
('ftc/business-management','FTC','business-management','Business Management');
insert into public.lesson_materials(lesson_id,title) values
('wpilib-java','WPILib Java ile ilk robot kodu'),
('frc-mechanics','FRC mekanik: hareket sistemi'),
('gyro-sensor','Gyro ve sensörlerle yön takibi'),
('pid-otonom','Otonom sürüş ve PID mantığı'),
('takim-surekliligi','Takımın bilgisini geleceğe taşı'),
('fll-mindstorms','Mindstorms: kırmızı bloklar'),
('fll-robot-yapimi','FLL robotunu göreve hazırla'),
('fll-ozdegerler','Özdeğerlerle takım olmak'),
('fll-proje','Bir fikirden proje sunumuna');
insert into public.course_lessons(course_id,lesson_id,sort_order) values
('frc/mechanics','frc-mechanics',0),
('frc/programming','wpilib-java',0),
('frc/programming','pid-otonom',1),
('frc/electronics','gyro-sensor',0),
('frc/sustainability','takim-surekliligi',0),
('frc/business-management','takim-surekliligi',0),
('fll/robot-yapimi','fll-robot-yapimi',0),
('fll/programlama','fll-mindstorms',0),
('fll/ozdegerler','fll-ozdegerler',0),
('fll/proje','fll-proje',0);
