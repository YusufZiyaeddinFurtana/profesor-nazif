import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
test("profile migration creates profiles and enforces user isolation and column grants", async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls; create schema auth;
   create schema storage;
   create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
   create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);
   alter table storage.objects enable row level security;
   create table auth.users(id uuid primary key,raw_user_meta_data jsonb);
   create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
   grant usage on schema public,auth to authenticated,anon;
   grant execute on function auth.uid() to authenticated;`);
    const first = "11111111-1111-1111-1111-111111111111",
      second = "22222222-2222-2222-2222-222222222222";
    await db.exec(
      `insert into auth.users values('${first}','{"full_name":"First Student"}');`,
    );
    const migrations = new URL("../supabase/migrations/", import.meta.url);
    for (const name of (await readdir(migrations))
      .filter((name) => name.endsWith(".sql"))
      .sort()) {
      await db.exec(await readFile(new URL(name, migrations), "utf8"));
    }
    await db.exec(
      `insert into auth.users values('${second}','{"full_name":"Second Student","interest_programs":["FTC","FRC","FTC","admin",null,{}],"focus_areas":["engineering","business","admin"]}');`,
    );
    assert.equal(
      (await db.query("select * from public.profiles")).rows.length,
      2,
    );
    const saved = await db.query<{
      interest_programs: string[];
      focus_areas: string[];
    }>(
      `select interest_programs,focus_areas from public.profiles where id='${second}'`,
    );
    assert.deepEqual(saved.rows[0].interest_programs, ["FRC", "FTC"]);
    assert.deepEqual(saved.rows[0].focus_areas, ["business", "engineering"]);
    const existing = await db.query<{ interest_programs: string[] }>(
      `select interest_programs from public.profiles where id='${first}'`,
    );
    assert.deepEqual(existing.rows[0].interest_programs, []);
    await db.exec(
      `begin; insert into auth.users values('33333333-3333-3333-3333-333333333333','{"interest_programs":"FRC","focus_areas":null}');`,
    );
    assert.deepEqual(
      (
        await db.query<{ interest_programs: string[] }>(
          "select interest_programs from public.profiles where id='33333333-3333-3333-3333-333333333333'",
        )
      ).rows[0].interest_programs,
      [],
    );
    await db.exec("rollback;");
    await db.exec(
      `set role authenticated; select set_config('request.jwt.claim.sub','${first}',false);`,
    );
    const own = await db.query<{ id: string; full_name: string }>(
      "select id,full_name from public.profiles",
    );
    assert.equal(own.rows.length, 1);
    assert.equal(own.rows[0].id, first);
    await db.exec("update public.profiles set full_name='Updated Name'");
    await db.exec(
      "update public.profiles set interest_programs=array['FLL'],focus_areas=array['engineering']",
    );
    assert.deepEqual(
      (
        await db.query<{ interest_programs: string[] }>(
          "select interest_programs from public.profiles",
        )
      ).rows[0].interest_programs,
      ["FLL"],
    );
    await assert.rejects(
      db.exec("update public.profiles set interest_programs=array['ADMIN']"),
    );
    await assert.rejects(
      db.exec("update public.profiles set focus_areas=array['invalid']"),
    );
    await assert.rejects(
      db.exec(
        "update public.profiles set interest_programs=array[null]::text[]",
      ),
    );
    assert.equal(
      (
        await db.query(
          `update public.profiles set interest_programs=array['FLL'] where id='${second}' returning id`,
        )
      ).rows.length,
      0,
    );
    assert.equal(
      (
        await db.query<{ full_name: string }>(
          "select full_name from public.profiles",
        )
      ).rows[0].full_name,
      "Updated Name",
    );
    assert.equal(
      (
        await db.query(
          `update public.profiles set full_name='Forbidden' where id='${second}' returning id`,
        )
      ).rows.length,
      0,
    );
    await assert.rejects(db.exec(`update public.profiles set id='${second}'`));
    await assert.rejects(
      db.exec(`update public.profiles set created_at=now()`),
    );
    await assert.rejects(
      db.exec(`insert into public.profiles(id) values('${first}')`),
    );
    await assert.rejects(db.exec("delete from public.profiles"));
    await db.exec("reset role; set role anon;");
    await assert.rejects(db.query("select * from public.profiles"));
    await db.exec(`reset role; delete from auth.users where id='${first}'`);
    assert.equal(
      (await db.query("select * from public.profiles")).rows.length,
      1,
    );
  } finally {
    await db.close();
  }
});
