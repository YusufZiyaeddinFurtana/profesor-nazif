import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

test("only owner-assigned admins publish atomic lessons and upload PDFs; public catalog stays safe", async () => {
  const db = new PGlite();
  const admin = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    student = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
  try {
    await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create schema storage;
   create table auth.users(id uuid primary key,raw_user_meta_data jsonb);
   create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
   create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
   create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);
   alter table storage.objects enable row level security;
   grant usage on schema public,auth,storage to authenticated,anon,service_role;
   grant execute on function auth.uid() to authenticated;
   grant select,insert,delete on storage.objects to authenticated;
   grant select on storage.objects to anon;`);
    const directory = new URL("../supabase/migrations/", import.meta.url);
    for (const file of (await readdir(directory))
      .filter((f) => f.endsWith(".sql"))
      .sort())
      await db.exec(await readFile(new URL(file, directory), "utf8"));
    await db.exec(`insert into auth.users values('${admin}','{}'),('${student}','{"role":"admin","is_admin":true}');
    insert into public.user_roles(user_id,role) values('${admin}','admin');
    set role authenticated;select set_config('request.jwt.claim.sub','${student}',false);`);
    assert.equal(
      (await db.query<{ is_admin: boolean }>("select public.is_admin()"))
        .rows[0].is_admin,
      false,
    );
    await assert.rejects(
      db.exec(
        `insert into public.user_roles(user_id,role) values('${student}','admin')`,
      ),
    );
    await assert.rejects(db.exec(`update public.profiles set role='admin'`));
    assert.equal(
      (await db.query("select user_id,role from public.user_roles")).rows
        .length,
      0,
    );
    await assert.rejects(db.exec("select public.admin_lessons()"));
    await assert.rejects(
      db.exec(`select public.admin_save_lesson('{"duration":"bad"}')`),
      { code: "42501" },
    );
    await assert.rejects(
      db.exec(
        `insert into storage.objects(bucket_id,name) values('lesson-exercises','admin/${student}/evil.pdf')`,
      ),
    );
    await assert.rejects(
      db.exec(`insert into public.lesson_catalog(id) values('spoof')`),
    );
    await db.exec(
      `select set_config('request.jwt.claim.sub','${admin}',false);`,
    );
    assert.equal(
      (await db.query<{ is_admin: boolean }>("select public.is_admin()"))
        .rows[0].is_admin,
      true,
    );
    const pdf = `admin/${admin}/test.pdf`;
    await db.query(
      "insert into storage.objects(bucket_id,name) values('lesson-exercises',$1)",
      [pdf],
    );
    await assert.rejects(
      db.exec(
        `insert into storage.objects(bucket_id,name) values('another-bucket','admin/${admin}/test.pdf')`,
      ),
    );
    await assert.rejects(
      db.exec(
        `insert into storage.objects(bucket_id,name) values('lesson-exercises','admin/${student}/test.pdf')`,
      ),
    );
    const input = {
      id: "admin-test-lesson",
      courseId: "fll/programlama",
      title: "Test lesson",
      summary: "Test summary",
      longDescription: "Test description",
      videoId: "EhA8PaoGqfE",
      duration: 114,
      exercisePath: pdf,
      sortOrder: 30,
      publish: false,
      expectedUpdatedAt: null as string | null,
    };
    const save = async (data: unknown) =>
      db.query("select public.admin_save_lesson($1::jsonb)", [
        JSON.stringify(data),
      ]);
    await save(input);
    const load = async () =>
      (
        await db.query<{ items: any[] }>(
          "select public.admin_lessons() as items",
        )
      ).rows[0].items;
    let row = (await load()).find((r) => r.id === input.id);
    assert.ok(row);
    input.expectedUpdatedAt = row.updated_at;
    // Even an admin cannot delete a PDF referenced by a draft.
    assert.equal(
      (
        await db.query(
          "delete from storage.objects where name=$1 returning name",
          [pdf],
        )
      ).rows.length,
      0,
    );
    await db.exec(
      `select set_config('request.jwt.claim.sub','${student}',false);`,
    );
    assert.equal(
      (
        await db.query("select id from public.lesson_catalog where id=$1", [
          input.id,
        ])
      ).rows.length,
      0,
    );
    assert.equal(
      (await db.query("select * from storage.objects where name=$1", [pdf]))
        .rows.length,
      0,
    );
    await db.exec(
      `select set_config('request.jwt.claim.sub','${admin}',false);`,
    );
    // All rows roll back on validation failure, preserving the prior draft.
    await assert.rejects(
      save({ ...input, publish: true, exercisePath: "missing.pdf" }),
    );
    assert.equal(
      (await load()).find((r) => r.id === input.id).is_published,
      false,
    );
    await assert.rejects(save({ ...input, courseId: "fll/not-real" }));
    await assert.rejects(save({ ...input, publish: true, videoId: null }));
    await assert.rejects(save({ ...input, expectedUpdatedAt: null }));
    await save({ ...input, publish: true });
    row = (await load()).find((r) => r.id === input.id);
    input.expectedUpdatedAt = row.updated_at;
    await assert.rejects(
      save({ ...input, publish: true, videoId: "abcdefghijk" }),
    );
    await assert.rejects(save({ ...input, publish: true, duration: 120 }));
    await assert.rejects(save({ ...input, courseId: "fll/proje" }));
    await db.exec(
      `select set_config('request.jwt.claim.sub','${student}',false);`,
    );
    assert.equal(
      (
        await db.query(
          "select id,video_available from public.lesson_catalog where id=$1",
          [input.id],
        )
      ).rows.length,
      1,
    );
    assert.equal(
      (await db.query("select * from storage.objects where name=$1", [pdf]))
        .rows.length,
      1,
    );
    assert.equal(
      (
        await db.query(
          "select * from public.course_lessons where course_id='fll/programlama'",
        )
      ).rows.length,
      1,
    );
    // Existing drafts do not block a released lesson's completion/certificate queue.
    for (let from = 0; from < 109; from += 10)
      await db.query("select public.record_lesson_watch($1,$2,$3)", [
        input.id,
        from,
        Math.min(from + 10, 109),
      ]);
    await db.query("select public.complete_lesson_exercise($1)", [input.id]);
    assert.equal(
      (
        await db.query(
          "select course_id from public.course_completions where course_id='fll/programlama'",
        )
      ).rows.length,
      1,
    );
    await db.exec("reset role;set role anon;");
    assert.equal(
      (await db.query("select id from public.lesson_catalog")).rows.length,
      10,
    );
    await assert.rejects(db.exec("select * from public.lesson_catalog"));
    await assert.rejects(
      db.exec("select youtube_video_id from public.lesson_materials"),
    );
    await assert.rejects(db.exec("select public.is_admin()"));
    await assert.rejects(db.exec("select public.admin_lessons()"));
    await assert.rejects(
      db.query("select public.admin_save_lesson($1::jsonb)", [
        JSON.stringify(input),
      ]),
    );
    // Revoking a role takes effect on the next write, even with an existing session.
    await db.exec(
      `reset role;delete from public.user_roles where user_id='${admin}';set role authenticated;select set_config('request.jwt.claim.sub','${admin}',false);`,
    );
    assert.equal(
      (await db.query<{ is_admin: boolean }>("select public.is_admin()"))
        .rows[0].is_admin,
      false,
    );
    await assert.rejects(save({ ...input, publish: false }), { code: "42501" });
    await assert.rejects(
      db.exec(
        `insert into storage.objects(bucket_id,name) values('lesson-exercises','admin/${admin}/another.pdf')`,
      ),
    );
  } finally {
    await db.close();
  }
});
