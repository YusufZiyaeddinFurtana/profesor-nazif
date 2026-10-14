import { defineConfig, loadEnv } from "vite";
import { readSupabaseConfig } from "./src/features/auth/authConfig";
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  // Fail before bundling if a privileged key is accidentally placed in frontend configuration.
  readSupabaseConfig(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY);
  return {
    build: {
      rollupOptions: {
        output: { manualChunks: { supabase: ["@supabase/supabase-js"] } },
      },
    },
  };
});
