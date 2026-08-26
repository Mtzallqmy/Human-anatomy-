"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en" dir="ltr">
      <body style={{ margin: 0, fontFamily: "Inter, Segoe UI, Tahoma, Arial, sans-serif", background: "#0b1015", color: "#edf2f4" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
          <section role="alert" style={{ width: "min(560px, 100%)", border: "1px solid #2a343d", borderRadius: 20, padding: 28, background: "#111820" }}>
            <p style={{ margin: 0, opacity: .7 }}>Application recovery / استعادة التطبيق</p>
            <h1 style={{ margin: "10px 0 8px" }}>Anatomica needs to restart this view</h1>
            <h2 dir="rtl" style={{ margin: "0 0 16px", fontSize: "1.2rem" }}>يحتاج الأطلس إلى إعادة تشغيل هذه الشاشة</h2>
            <p style={{ lineHeight: 1.7, opacity: .82 }}>This can happen when the browser loses graphics memory or a page module fails. Your browser is not required to close.</p>
            <p dir="rtl" style={{ lineHeight: 1.8, opacity: .82 }}>قد يحدث ذلك عند فقدان ذاكرة الرسوميات أو تعذر تحميل جزء من الصفحة. لا يلزم إغلاق المتصفح.</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
              <button type="button" onClick={reset}>Retry / إعادة المحاولة</button>
              <button type="button" onClick={() => window.location.reload()}>Reload / إعادة تحميل</button>
              <button type="button" onClick={() => { window.location.href = "/"; }}>Home / الرئيسية</button>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
