import { createClient } from "@supabase/supabase-js";
import { readSupabaseConfig } from "../features/auth/authConfig";
const config = readSupabaseConfig(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
/** A single SDK instance owns persistence, refresh, PKCE and cross-tab session updates. */
export const supabase = config
  ? createClient(config.url, config.key, {
      auth: {
        flowType: "pkce",
        detectSessionInUrl: false,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : undefined;
