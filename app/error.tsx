"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--background, #0b1015)", color: "var(--foreground, #edf2f4)" }}>
      <section role="alert" style={{ width: "min(560px, 100%)", border: "1px solid var(--border-strong, #2a343d)", borderRadius: 20, padding: 28, background: "var(--surface, #111820)", boxShadow: "0 18px 70px rgba(0,0,0,.18)" }}>
        <p style={{ margin: 0, opacity: .7 }}>Page error / خطأ في الصفحة</p>
        <h1 style={{ margin: "10px 0 8px" }}>This page could not be completed</h1>
        <h2 dir="rtl" style={{ margin: "0 0 16px", fontSize: "1.2rem" }}>تعذر إكمال تحميل هذه الصفحة</h2>
        <p style={{ lineHeight: 1.7, opacity: .82 }}>The page is still available. Retry the failed operation, reload the page, or return home.</p>
        <p dir="rtl" style={{ lineHeight: 1.8, opacity: .82 }}>الموقع ما زال يعمل. أعد محاولة العملية، أو أعد تحميل الصفحة، أو ارجع إلى الرئيسية.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
          <button type="button" onClick={reset}>Retry / إعادة المحاولة</button>
          <button type="button" onClick={() => window.location.reload()}>Reload / إعادة تحميل</button>
          <button type="button" onClick={() => { window.location.href = "/"; }}>Home / الرئيسية</button>
        </div>
      </section>
    </main>
  );
}
