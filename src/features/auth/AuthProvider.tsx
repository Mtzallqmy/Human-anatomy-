"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/src/lib/supabase/client";
import type { Database } from "@/src/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string, fullName: string): Promise<void>;
  signOut(): Promise<void>;
  refreshProfile(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = getSupabaseClient();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(Boolean(client));
  const [error, setError] = useState<string | null>(
    client ? null : "Supabase authentication is not configured.",
  );

  const loadProfile = useCallback(
    async (userId?: string) => {
      if (!client || !userId) {
        setProfile(null);
        return;
      }
      const { data, error: profileError } = await client
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (profileError) throw profileError;
      setProfile(data);
    },
    [client],
  );

  useEffect(() => {
    if (!client) {
      return;
    }
    void client.auth.getSession().then(async ({ data, error: sessionError }) => {
      if (sessionError) setError(sessionError.message);
      setSession(data.session);
      try {
        await loadProfile(data.session?.user.id);
      } catch (profileError) {
        setError(profileError instanceof Error ? profileError.message : "Could not load the staff profile.");
      } finally {
        setLoading(false);
      }
    });
    const { data: subscription } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      void loadProfile(nextSession?.user.id).catch((profileError: unknown) => {
        setError(profileError instanceof Error ? profileError.message : "Could not load the staff profile.");
      });
    });
    return () => subscription.subscription.unsubscribe();
  }, [client, loadProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      profile,
      loading,
      error,
      async signIn(email, password) {
        if (!client) throw new Error("Supabase authentication is not configured.");
        setError(null);
        const { error: signInError } = await client.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      },
      async signUp(email, password, fullName) {
        if (!client) throw new Error("Supabase authentication is not configured.");
        const { error: signUpError } = await client.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (signUpError) throw signUpError;
      },
      async signOut() {
        if (client) await client.auth.signOut();
        setProfile(null);
      },
      async refreshProfile() {
        await loadProfile(session?.user.id);
      },
    }),
    [client, error, loadProfile, loading, profile, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider.");
  return value;
}
