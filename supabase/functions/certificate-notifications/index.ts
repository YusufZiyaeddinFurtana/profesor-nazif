import { createClient } from "npm:@supabase/supabase-js@2.117.3";
import { notificationHandler } from "./handler.ts";
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const client = createClient(Deno.env.get("SUPABASE_URL")!, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
Deno.serve(
  notificationHandler({
    serviceKey,
    resendKey: Deno.env.get("RESEND_API_KEY"),
    from: Deno.env.get("CERTIFICATE_FROM_EMAIL"),
    to: Deno.env.get("CERTIFICATE_NOTIFY_TO"),
    send: fetch,
    claim: async () => {
      const { data, error } = await client.rpc(
        "claim_certificate_notifications",
      );
      if (error) throw error;
      return data;
    },
    student: async (id) => {
      const { data, error } = await client.auth.admin.getUserById(id);
      if (error || !data.user?.email)
        throw error ?? new Error("Student unavailable");
      const { data: profile, error: profileError } = await client
        .from("profiles")
        .select("full_name")
        .eq("id", id)
        .single();
      if (profileError) throw profileError;
      return { name: profile.full_name || "Öğrenci", email: data.user.email };
    },
    finish: async (job, sent) => {
      const { error } = await client
        .from("course_completions")
        .update({
          notification_sent_at: sent ? new Date().toISOString() : null,
          notification_claimed_until: null,
          notification_claim_token: null,
        })
        .eq("id", job.id)
        .eq("notification_claim_token", job.claim_token);
      if (error) throw error;
    },
  }),
);
