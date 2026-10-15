import test from "node:test";
import assert from "node:assert/strict";
import {
  watchedInterval,
  lessonState,
  watchPercent,
} from "../src/features/learning/types.ts";
import { notificationHandler } from "../supabase/functions/certificate-notifications/handler.ts";
test("watch tracking rejects seeks, long clock gaps and duplicate time", () => {
  assert.deepEqual(watchedInterval(3.2, 4.3, 1, 1), [3, 4]);
  assert.deepEqual(watchedInterval(3, 5, 1, 2), [3, 5]);
  for (const args of [
    [3, 100, 1, 1],
    [3, 3, 1, 1],
    [3, 1, 1, 1],
    [0, 8, 8, 1],
    [0, 3, 1, 3],
    [NaN, 3, 1, 1],
  ])
    assert.equal(
      watchedInterval(...(args as [number, number, number, number])),
      undefined,
    );
});
test("a lesson requires both video and exercise completion", () => {
  const progress = {
    lesson_id: "lesson",
    watched_seconds: 95,
    video_completed_at: "now",
    exercise_completed_at: null,
  };
  assert.equal(lessonState(), "not-started");
  assert.equal(lessonState(progress), "in-progress");
  assert.equal(
    lessonState({ ...progress, exercise_completed_at: "now" }),
    "completed",
  );
  assert.equal(watchPercent(progress, 100), 100);
  assert.equal(
    watchPercent({ ...progress, video_completed_at: null }, 100),
    95,
  );
});
test("certificate worker requires server auth/config and never accepts a client recipient", async () => {
  let claims = 0,
    sendCount = 0,
    finished = false;
  const deps = {
    serviceKey: "server-secret",
    claim: async () => {
      claims++;
      return [
        {
          id: "job",
          user_id: "student",
          course_id: "frc/programming",
          course_title: "Programming",
          claim_token: "claim",
        },
      ];
    },
    student: async () => ({ name: "Student", email: "student@example.test" }),
    finish: async (_: unknown, sent: boolean) => {
      finished = sent;
    },
    send: async (_url: unknown, init?: RequestInit) => {
      sendCount++;
      const payload = JSON.parse(init!.body as string);
      assert.deepEqual(payload.to, ["team@example.test"]);
      assert.equal(
        (init!.headers as Record<string, string>)["Idempotency-Key"],
        "certificate-job",
      );
      return new Response("{}", { status: 200 });
    },
  };
  const request = (auth = "server-secret") =>
    new Request("https://worker.test", {
      method: "POST",
      headers: { Authorization: `Bearer ${auth}` },
      body: JSON.stringify({ to: "attacker@example.test" }),
    });
  assert.equal(
    (await notificationHandler(deps)(request("student-jwt"))).status,
    401,
  );
  assert.equal((await notificationHandler(deps)(request())).status, 503);
  assert.equal(claims, 0);
  assert.equal(sendCount, 0);
  const configured = {
    ...deps,
    resendKey: "test",
    from: "nazif@example.test",
    to: "team@example.test",
  };
  assert.equal((await notificationHandler(configured)(request())).status, 200);
  assert.equal(sendCount, 1);
  assert.equal(finished, true);
  const failed = {
    ...configured,
    send: async () => new Response("no", { status: 429 }),
  };
  assert.equal((await notificationHandler(failed)(request())).status, 502);
  assert.equal(finished, false);
});
