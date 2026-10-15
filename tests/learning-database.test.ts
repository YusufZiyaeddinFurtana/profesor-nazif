import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
test("learning RLS, unique watch coverage, exercises and certificate outbox work together", async () => {
  const db = new PGlite();
  const first = "11111111-1111-1111-1111-111111111111",
    second = "22222222-2222-2222-2222-222222222222";
  try {
    await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create schema storage;
      create table auth.users(id uuid primary key,raw_user_meta_data jsonb);
      create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
      create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
      create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);
      alter table storage.objects enable row level security;
      grant usage on schema public,auth,storage to authenticated,anon,service_role;
      grant execute on function auth.uid() to authenticated;
      grant select on storage.objects to authenticated,anon;`);
    const directory = new URL("../supabase/migrations/", import.meta.url);
    for (const file of (await readdir(directory))
      .filter((f) => f.endsWith(".sql"))
      .sort())
      await db.exec(await readFile(new URL(file, directory), "utf8"));
    await db.exec(`insert into auth.users values('${first}','{"full_name":"First"}'),('${second}','{}');
      insert into storage.objects(bucket_id,name) values('lesson-exercises','wpilib-java.pdf'),('lesson-exercises','draft.pdf');
      set role authenticated;select set_config('request.jwt.claim.sub','${first}',false);`);
    await assert.rejects(
      db.query("select public.record_lesson_watch('wpilib-java',0,10)"),
    );
    assert.equal(
      (await db.query("select lesson_id from public.lesson_materials")).rows
        .length,
      0,
    );
    assert.equal(
      (await db.query("select * from storage.objects")).rows.length,
      0,
    );
    await db.exec(`reset role;
      update public.lesson_materials set youtube_video_id='abcdefghijk',video_duration_seconds=100,exercise_path=lesson_id||'.pdf',is_published=true where lesson_id in ('wpilib-java','pid-otonom');
      update public.learning_courses set is_published=true where id='frc/programming';
      set role authenticated;`);
    assert.equal(
      (await db.query("select * from storage.objects")).rows.length,
      1,
    );
    assert.equal(
      (await db.query("select * from public.course_lessons")).rows.length,
      2,
    );
    await db.exec(
      "select public.record_lesson_watch('wpilib-java',0,10);select public.record_lesson_watch('wpilib-java',0,10);",
    );
    assert.equal(
      (
        await db.query<{ watched_seconds: number }>(
          "select watched_seconds from public.lesson_progress",
        )
      ).rows[0].watched_seconds,
      10,
    );
    await assert.rejects(
      db.exec("select public.record_lesson_watch('wpilib-java',10,90)"),
    );
    await assert.rejects(
      db.exec("select public.record_lesson_watch('wpilib-java',99,101)"),
    );
    await assert.rejects(
      db.exec("update public.lesson_progress set video_completed_at=now()"),
    );
    await assert.rejects(
      db.exec(
        "insert into public.course_completions(user_id,course_id) values(auth.uid(),'frc/programming')",
      ),
    );
    await assert.rejects(
      db.exec("select public.claim_certificate_notifications()"),
    );
    await assert.rejects(
      db.exec("select public.complete_lesson_exercise('frc-mechanics')"),
    );
    for (const lesson of ["wpilib-java", "pid-otonom"]) {
      for (let from = 0; from < 95; from += 10)
        await db.query("select public.record_lesson_watch($1,$2,$3)", [
          lesson,
          from,
          Math.min(from + 10, 95),
        ]);
      if (lesson === "wpilib-java")
        await db.exec("select public.complete_lesson_exercise('wpilib-java')");
    }
    assert.equal(
      (await db.query("select course_id from public.course_completions")).rows
        .length,
      0,
    );
    await db.exec(
      "select public.complete_lesson_exercise('pid-otonom');select public.complete_lesson_exercise('pid-otonom')",
    );
    assert.equal(
      (await db.query("select course_id from public.course_completions")).rows
        .length,
      1,
    );
    const state = await db.query<{
      watched_seconds: number;
      video_completed_at: string;
    }>("select watched_seconds,video_completed_at from public.lesson_progress");
    assert.ok(
      state.rows.every((p) => p.watched_seconds === 95 && p.video_completed_at),
    );
    await db.exec(
      `select set_config('request.jwt.claim.sub','${second}',false)`,
    );
    assert.equal(
      (await db.query("select lesson_id from public.lesson_progress")).rows
        .length,
      0,
    );
    assert.equal(
      (await db.query("select course_id from public.course_completions")).rows
        .length,
      0,
    );
    await db.exec("reset role;set role anon;");
    await assert.rejects(
      db.query("select lesson_id from public.lesson_materials"),
    );
    await assert.rejects(
      db.query("select lesson_id from public.lesson_progress"),
    );
    await assert.rejects(
      db.query("select public.record_lesson_watch('wpilib-java',0,10)"),
    );
    assert.equal(
      (await db.query("select * from storage.objects")).rows.length,
      0,
    );
    await db.exec("reset role;set role service_role;");
    assert.equal(
      (await db.query("select * from public.claim_certificate_notifications()"))
        .rows.length,
      1,
    );
    assert.equal(
      (await db.query("select * from public.claim_certificate_notifications()"))
        .rows.length,
      0,
    );
    await db.exec(
      "update public.course_completions set notification_sent_at=now(),notification_claimed_until=null",
    );
    assert.equal(
      (await db.query("select * from public.claim_certificate_notifications()"))
        .rows.length,
      0,
    );
  } finally {
    await db.close();
  }
});
