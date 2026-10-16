-- Publishing a video does not require inventing an exercise PDF.
alter table public.lesson_materials drop constraint lesson_materials_check;
alter table public.lesson_materials add constraint lesson_materials_published_video_check
  check(not is_published or (youtube_video_id is not null and video_duration_seconds is not null));

-- The supplied video is public on YouTube. Keep the actual resource in the student-only table.
-- Its videoDetails.lengthSeconds was verified as 114 on 16 October 2026.
insert into public.lesson_materials(lesson_id,title,youtube_video_id,video_duration_seconds,exercise_path,is_published)
values('fll-stop-comment-blocks','5 Dakikada FLL | Yazılım Videoları 30 : Mindstorms Kırmızı Bloklar: Dur ve Yorum Blokları','EhA8PaoGqfE',114,null,true);
update public.course_lessons set sort_order=1 where course_id='fll/programlama' and lesson_id='fll-mindstorms';
insert into public.course_lessons(course_id,lesson_id,sort_order) values('fll/programlama','fll-stop-comment-blocks',0);

-- The course remains draft: the older lesson and exercises are still missing.
-- complete_lesson_exercise already rejects NULL exercise_path. Course completion still
-- requires every video AND exercise, so this demo can never create a false certificate.
