"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { adminRepository } from "@/src/data-access/admin/adminRepository";

const cards = [
  ["anatomical_structures", "Structures", "/admin/structures"],
  ["diseases", "Diseases", "/admin/diseases"],
  ["physiology_topics", "Physiology topics", "/admin/physiology"],
  ["references", "References", "/admin/references"],
  ["three_d_assets", "3D assets", "/admin/assets"],
  ["waiting", "Waiting for review", "/admin/review"],
] as const;

export function AdminDashboard() {
  const query = useQuery({ queryKey: ["admin-dashboard"], queryFn: () => adminRepository.dashboard() });
  return (
    <>
      <header className="admin-page-header">
        <div>
          <p>Medical content operations</p>
          <h1>CMS overview</h1>
        </div>
        <Link href="/atlas" className="admin-secondary-button">
          Open public atlas
        </Link>
      </header>
      {query.isPending && <div className="admin-state">Loading content metrics…</div>}
      {query.error && <div className="admin-alert">{query.error.message}</div>}
      <section className="admin-metric-grid" aria-label="Content summary">
        {cards.map(([key, label, href]) => (
          <Link href={href} className="admin-metric" key={key}>
            <span>{label}</span>
            <strong>{query.data?.[key] ?? "—"}</strong>
          </Link>
        ))}
      </section>
      <section className="admin-workflow-card">
        <span>Controlled publishing</span>
        <h2>Draft → In review → Approved → Published</h2>
        <p>
          Database policies enforce role boundaries. Every core entity change creates a version snapshot and
          audit event.
        </p>
      </section>
    </>
  );
}
