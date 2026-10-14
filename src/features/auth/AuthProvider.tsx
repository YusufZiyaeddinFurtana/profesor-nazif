import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
export type AuthStatus = "unconfigured" | "loading" | "ready" | "error";
const AuthContext = createContext<{
  session: Session | null;
  status: AuthStatus;
  retry: () => void;
} | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>(
    supabase ? "loading" : "unconfigured",
  );
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const client = supabase;
    if (!client) return;
    let active = true,
      revision = 0;
    setStatus("loading");
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, nextSession) => {
      if (!active || event === "INITIAL_SESSION") return;
      revision++;
      setSession(nextSession);
      setStatus("ready");
    });
    const initialRevision = revision;
    void (async () => {
      try {
        const { data, error } = await client.auth.getSession();
        if (error) throw error;
        if (data.session) {
          const { error: userError } = await client.auth.getUser();
          if (userError) throw userError;
        }
        if (active && revision === initialRevision) {
          setSession(data.session);
          setStatus("ready");
        }
      } catch (error) {
        if (active && revision === initialRevision) {
          const authError = error as { status?: number; name?: string };
          if (
            authError.status === 401 ||
            authError.status === 403 ||
            authError.name === "AuthSessionMissingError"
          ) {
            const { error: signOutError } = await client.auth.signOut({
              scope: "local",
            });
            if (!signOutError) {
              if (active) {
                setSession(null);
                setStatus("ready");
              }
              return;
            }
          }
          setSession(null);
          setStatus("error");
        }
      }
    })();
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [attempt]);
  return (
    <AuthContext.Provider
      value={{ session, status, retry: () => setAttempt((v) => v + 1) }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider missing");
  return context;
}
