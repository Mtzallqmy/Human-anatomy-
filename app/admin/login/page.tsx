"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HeartPulse, LockKeyhole } from "lucide-react";
import { useAuth } from "@/src/features/auth/AuthProvider";

export default function AdminLoginPage() {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestAccess, setRequestAccess] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const data = new FormData(event.currentTarget);
    try {
      await signIn(String(data.get("email")), String(data.get("password")));
      router.replace(search.get("next") || "/admin");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  };
  const request = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const data = new FormData(event.currentTarget);
    try {
      await signUp(String(data.get("email")), String(data.get("password")), String(data.get("fullName")));
      setError("Request received. Confirm your email, then an administrator must activate your role.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="admin-login">
      <section>
        <div className="admin-login-brand">
          <HeartPulse /> <span>ANATOMICA</span>
        </div>
        <p>Secure medical content workspace</p>
        <h1>{requestAccess ? "Request staff access" : "Staff sign in"}</h1>
        <form onSubmit={requestAccess ? request : submit}>
          {requestAccess && (
            <label>
              <span>Full name</span>
              <input name="fullName" autoComplete="name" required />
            </label>
          )}
          <label>
            <span>Email</span>
            <input type="email" name="email" autoComplete="email" required />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              autoComplete={requestAccess ? "new-password" : "current-password"}
              minLength={10}
              required
            />
          </label>
          {error && (
            <div className="admin-alert" role="status">
              {error}
            </div>
          )}
          <button className="admin-primary-button" disabled={loading}>
            <LockKeyhole size={16} /> {loading ? "Working…" : requestAccess ? "Request access" : "Sign in"}
          </button>
        </form>
        <button
          type="button"
          className="admin-login-switch"
          onClick={() => {
            setRequestAccess((value) => !value);
            setError(null);
          }}
        >
          {requestAccess ? "Back to sign in" : "Request a staff account"}
        </button>
        <small>
          Public atlas visitors do not need an account. Staff access is assigned by an administrator.
        </small>
      </section>
    </main>
  );
}
