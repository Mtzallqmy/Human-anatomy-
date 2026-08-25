import type { ReactNode } from "react";
import { AdminShell } from "@/src/features/admin/AdminShell";

export const metadata = { title: "Medical CMS", robots: { index: false, follow: false } };
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
