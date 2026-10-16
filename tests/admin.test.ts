import test from "node:test";
import assert from "node:assert/strict";
import {
  youtubeId,
  durationSeconds,
  durationText,
  isPdf,
} from "../src/features/admin/inputs.ts";
import { adminMessages } from "../src/features/admin/messages.ts";
import { resolveRoute } from "../src/app/routes.ts";
test("admin inputs accept YouTube embeds without executing arbitrary HTML or trusting similar hosts", () => {
  for (const input of [
    "EhA8PaoGqfE",
    "https://youtu.be/EhA8PaoGqfE?si=abc",
    "https://www.youtube.com/watch?v=EhA8PaoGqfE",
    '<iframe width="560" src="https://www.youtube.com/embed/EhA8PaoGqfE?si=abc" onload="evil()"></iframe>',
    "https://www.youtube-nocookie.com/embed/EhA8PaoGqfE",
  ])
    assert.equal(youtubeId(input), "EhA8PaoGqfE");
  for (const input of [
    "javascript:alert(1)",
    "https://youtube.com.evil.test/embed/EhA8PaoGqfE",
    "https://youtube.com@evil.test/watch?v=EhA8PaoGqfE",
    "https://evil.test/embed/EhA8PaoGqfE",
    '<script src="https://youtube.com/embed/EhA8PaoGqfE"></script>',
    '<iframe src="https://youtube.com/embed/EhA8PaoGqfE" src="javascript:evil()"></iframe>',
    "http://youtube.com/watch?v=EhA8PaoGqfE",
  ])
    assert.equal(youtubeId(input), undefined);
  assert.deepEqual(resolveRoute("/admin"), { kind: "admin" });
});
test("durations and PDFs validate actual content and bounds", async () => {
  assert.equal(durationSeconds("1:54"), 114);
  assert.equal(durationSeconds("1:02:03"), 3723);
  assert.equal(durationSeconds("24:00:00"), 86400);
  for (const seconds of [1, 114, 3600, 86400])
    assert.equal(durationSeconds(durationText(seconds)), seconds);
  for (const input of ["0", "1:70", "-5", "86401", "2:3", "24:00:01", "NaN"])
    assert.equal(durationSeconds(input), undefined);
  assert.equal(
    await isPdf(
      new File(["%PDF-1.4\nexample"], "lesson.pdf", {
        type: "application/pdf",
      }),
    ),
    true,
  );
  assert.equal(
    await isPdf(
      new File(["<script>fake</script>"], "lesson.pdf", {
        type: "application/pdf",
      }),
    ),
    false,
  );
  assert.equal(await isPdf(new File(["%PDF-1.4"], "lesson.html")), false);
  assert.equal(
    await isPdf(new File([new Uint8Array(10485761)], "large.pdf")),
    false,
  );
});
test("admin interface has complete messages in every supported language", () => {
  for (const copy of Object.values(adminMessages)) {
    assert.deepEqual(
      Object.keys(copy).sort(),
      Object.keys(adminMessages.tr).sort(),
    );
    assert.ok(Object.values(copy).every((value) => value.trim().length > 0));
  }
});
