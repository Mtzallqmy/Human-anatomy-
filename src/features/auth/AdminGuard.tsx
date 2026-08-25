"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/src/features/auth/AuthProvider";

export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
  }, [loading, pathname, router, user]);

  if (loading || !user) return <div className="admin-state">Verifying secure session…</div>;
  if (!profile || profile.status !== "active" || profile.role === "viewer") {
    return (
      <main className="admin-state admin-state--denied">
        <ShieldAlert aria-hidden="true" />
        <h1>Staff access pending</h1>
        <p>
          Your account exists, but an administrator must activate a staff role before CMS access is allowed.
        </p>
      </main>
    );
  }
  return children;
}
