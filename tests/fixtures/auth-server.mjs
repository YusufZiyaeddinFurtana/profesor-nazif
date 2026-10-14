// Local browser fixture only. Never deploy this server or import it from src/.
import { createServer } from "node:http";
if (process.env.NODE_ENV === "production")
  throw new Error("Test fixture cannot run in production");
const userId = "11111111-1111-4111-8111-111111111111";
let metadata = { full_name: "Test Student" };
let profile = { interest_programs: [], focus_areas: [] };
let saveFails = false;
let lastSignup;
const user = () => ({
  id: userId,
  aud: "authenticated",
  role: "authenticated",
  email: "student@example.invalid",
  email_confirmed_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  app_metadata: { provider: "email", providers: ["email"] },
  user_metadata: metadata,
});
const session = () => {
  const encode = (value) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  return {
    access_token: `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ sub: userId, aud: "authenticated", role: "authenticated", exp: Math.floor(Date.now() / 1000) + 3600 })}.test-only`,
    token_type: "bearer",
    refresh_token: "local-fixture-only",
    expires_in: 3600,
    user: user(),
  };
};
const server = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:4176");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "authorization, apikey, content-type, x-client-info, x-supabase-api-version, prefer, accept, range, accept-profile, content-profile",
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  res.setHeader("Access-Control-Expose-Headers", "X-Supabase-Api-Version");
  res.setHeader("X-Supabase-Api-Version", "2024-01-01");
  res.setHeader("Content-Type", "application/json");
  const reply = (status, body) => {
    res.writeHead(status);
    res.end(JSON.stringify(body));
  };
  if (req.method === "OPTIONS") return reply(200, {});
  let text = "";
  for await (const part of req) text += part;
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    return reply(400, {});
  }
  const url = new URL(req.url, "http://127.0.0.1");
  if (url.pathname === "/__state") return reply(200, { profile, lastSignup });
  if (url.pathname === "/__save_failure" && req.method === "POST") {
    saveFails = !!body.enabled;
    return reply(200, {});
  }
  if (url.pathname === "/auth/v1/signup") {
    metadata = body.data;
    profile = {
      interest_programs: metadata.interest_programs ?? [],
      focus_areas: metadata.focus_areas ?? [],
    };
    lastSignup = { email: body.email, data: body.data }; // Never retain the password.
    return reply(200, session());
  }
  if (url.pathname === "/auth/v1/token") return reply(200, session());
  if (url.pathname === "/auth/v1/user") return reply(200, user());
  if (url.pathname === "/auth/v1/logout") return reply(200, {});
  if (url.pathname === "/rest/v1/profiles") {
    if (req.method === "PATCH") {
      if (saveFails)
        return reply(503, {
          code: "test_unavailable",
          message: "Fixture save failure",
        });
      profile = { ...profile, ...body };
    }
    return reply(200, profile);
  }
  return reply(404, {});
});
server.listen(54329, "127.0.0.1", () =>
  console.log(
    "Local auth fixture: http://127.0.0.1:54329 (no real accounts or email)",
  ),
);
