import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--background, #0b1015)", color: "var(--foreground, #edf2f4)" }}>
      <section style={{ width: "min(560px, 100%)", border: "1px solid var(--border-strong, #2a343d)", borderRadius: 20, padding: 28, background: "var(--surface, #111820)" }}>
        <p style={{ margin: 0, opacity: .7 }}>404 / المسار غير موجود</p>
        <h1 style={{ margin: "10px 0 8px" }}>This atlas page does not exist</h1>
        <h2 dir="rtl" style={{ margin: "0 0 16px", fontSize: "1.2rem" }}>هذه الصفحة غير موجودة في الأطلس</h2>
        <p style={{ lineHeight: 1.7, opacity: .82 }}>The link may be old or incomplete. Use one of the supported destinations below.</p>
        <p dir="rtl" style={{ lineHeight: 1.8, opacity: .82 }}>قد يكون الرابط قديمًا أو غير مكتمل. استخدم أحد المسارات المدعومة أدناه.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
          <Link href="/">Home / الرئيسية</Link>
          <Link href="/atlas">3D Atlas / الأطلس ثلاثي الأبعاد</Link>
          <Link href="/systems/reproductive">Reproductive anatomy / التشريح التناسلي</Link>
        </div>
      </section>
    </main>
  );
}
