-- Revert only the unrequested example; no student progress exists for it.
do $$
begin
  perform 1 from public.lesson_materials where lesson_id='fll-stop-comment-blocks' for update;
  if exists(select 1 from public.lesson_progress where lesson_id='fll-stop-comment-blocks') then
    raise exception 'Student progress exists; stop instead of deleting it';
  end if;
  delete from public.course_lessons where course_id='fll/programlama' and lesson_id='fll-stop-comment-blocks';
  delete from public.lesson_materials where lesson_id='fll-stop-comment-blocks' and youtube_video_id='EhA8PaoGqfE';
  update public.course_lessons set sort_order=0 where course_id='fll/programlama' and lesson_id='fll-mindstorms' and sort_order=1;
end $$;
alter table public.lesson_materials drop constraint lesson_materials_published_video_check;
alter table public.lesson_materials add constraint lesson_materials_check
  check(not is_published or (youtube_video_id is not null and video_duration_seconds is not null and exercise_path is not null));
