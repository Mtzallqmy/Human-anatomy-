"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  Boxes,
  Database,
  FileHeart,
  HeartPulse,
  LogOut,
  Network,
  Shield,
  Users,
} from "lucide-react";
import { AdminGuard } from "@/src/features/auth/AdminGuard";
import { useAuth } from "@/src/features/auth/AuthProvider";
import type { ReactNode } from "react";

const links = [
  ["/admin", "Overview", Activity],
  ["/admin/systems", "Systems", Network],
  ["/admin/structures", "Structures", HeartPulse],
  ["/admin/diseases", "Diseases", FileHeart],
  ["/admin/physiology", "Physiology", Activity],
  ["/admin/references", "References", BookOpen],
  ["/admin/assets", "3D Assets", Boxes],
  ["/admin/review", "Review queue", Shield],
  ["/admin/users", "Users", Users],
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  if (pathname === "/admin/login") return children;
  return (
    <AdminGuard>
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <Link href="/admin" className="admin-brand">
            <Database size={18} /> Anatomica CMS
          </Link>
          <nav aria-label="CMS navigation">
            {links.map(([href, label, Icon]) => (
              <Link
                key={href}
                href={href}
                className={pathname === href ? "admin-nav-link admin-nav-link--active" : "admin-nav-link"}
              >
                <Icon size={16} aria-hidden="true" /> {label}
              </Link>
            ))}
          </nav>
          <div className="admin-account">
            <span>{profile?.full_name || "Medical staff"}</span>
            <small>{profile?.role}</small>
            <button type="button" onClick={() => void signOut()}>
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </aside>
        <main className="admin-main">{children}</main>
      </div>
    </AdminGuard>
  );
}
