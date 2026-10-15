type Job = {
  id: string;
  user_id: string;
  course_id: string;
  course_title: string;
  claim_token: string;
};
type Dependencies = {
  serviceKey: string;
  resendKey?: string;
  from?: string;
  to?: string;
  claim: () => Promise<Job[]>;
  student: (id: string) => Promise<{ name: string; email: string }>;
  finish: (job: Job, sent: boolean) => Promise<void>;
  send: typeof fetch;
};
/** Server-to-server only. Recipient and sender are server secrets, never request fields. */
export function notificationHandler(d: Dependencies) {
  return async (req: Request) => {
    const reply = (body: unknown, status = 200) =>
      Response.json(body, { status });
    if (req.method !== "POST") return reply({ error: "POST required" }, 405);
    if (
      !d.serviceKey ||
      req.headers.get("Authorization") !== `Bearer ${d.serviceKey}`
    )
      return reply({ error: "Unauthorized" }, 401);
    if (!d.resendKey || !d.from || !d.to)
      return reply(
        {
          error:
            "Certificate email sender is not configured. Requests remain queued.",
        },
        503,
      );
    let sent = 0,
      failed = 0;
    try {
      const jobs = await d.claim();
      for (const job of jobs) {
        try {
          const student = await d.student(job.user_id);
          const response = await d.send("https://api.resend.com/emails", {
            method: "POST",
            signal: AbortSignal.timeout(15000),
            headers: {
              Authorization: `Bearer ${d.resendKey}`,
              "Content-Type": "application/json",
              "Idempotency-Key": `certificate-${job.id}`,
            },
            body: JSON.stringify({
              from: d.from,
              to: [d.to],
              subject: `Profesör Nazif — Kurs tamamlandı: ${job.course_title}`,
              text: `Yeni sertifika talebi\n\nÖğrenci: ${student.name}\nE-posta: ${student.email}\nProgram / kurs: ${job.course_id}\nKurs: ${job.course_title}\nTalep kimliği: ${job.id}\n\nTüm ders videoları ve öğrenci beyanına dayalı alıştırmalar tamamlandı. Sertifikayı ekip manuel hazırlayıp öğrenciye göndermelidir.`,
            }),
          });
          if (!response.ok)
            throw new Error("Email provider rejected notification");
          await d.finish(job, true);
          sent++;
        } catch {
          failed++;
          await d.finish(job, false);
        }
      }
      return reply({ sent, failed }, failed ? 502 : 200);
    } catch {
      return reply({ error: "Notification queue unavailable" }, 500);
    }
  };
}
