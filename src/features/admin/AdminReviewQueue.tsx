import Link from "next/link";

const queues = [
  ["Structures", "/admin/structures"],
  ["Diseases", "/admin/diseases"],
  ["Physiology", "/admin/physiology"],
  ["References", "/admin/references"],
  ["3D assets", "/admin/assets"],
];
export function AdminReviewQueue() {
  return (
    <>
      <header className="admin-page-header">
        <div>
          <p>Medical governance</p>
          <h1>Review queue</h1>
          <span>
            Reviewers record an approval or rejection; only administrators publish approved content.
          </span>
        </div>
      </header>
      <section className="admin-review-grid">
        {queues.map(([label, href]) => (
          <Link href={href} key={href}>
            <strong>{label}</strong>
            <span>Open catalog and review submitted records →</span>
          </Link>
        ))}
      </section>
    </>
  );
}
