import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
test("profile migration creates profiles and enforces user isolation and column grants", async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
   create table auth.users(id uuid primary key,raw_user_meta_data jsonb);
   create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
   grant usage on schema public,auth to authenticated,anon;
   grant execute on function auth.uid() to authenticated;`);
    const first = "11111111-1111-1111-1111-111111111111",
      second = "22222222-2222-2222-2222-222222222222";
    await db.exec(
      `insert into auth.users values('${first}','{"full_name":"First Student"}');`,
    );
    await db.exec(
      await readFile(
        new URL(
          "../supabase/migrations/202610140001_profiles.sql",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    await db.exec(
      `insert into auth.users values('${second}','{"full_name":"Second Student"}');`,
    );
    assert.equal(
      (await db.query("select * from public.profiles")).rows.length,
      2,
    );
    await db.exec(
      `set role authenticated; select set_config('request.jwt.claim.sub','${first}',false);`,
    );
    const own = await db.query<{ id: string; full_name: string }>(
      "select id,full_name from public.profiles",
    );
    assert.equal(own.rows.length, 1);
    assert.equal(own.rows[0].id, first);
    await db.exec("update public.profiles set full_name='Updated Name'");
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
