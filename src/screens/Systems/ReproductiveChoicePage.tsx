"use client";

import Link from "next/link";
import { ArrowRight, Scan } from "lucide-react";
import { AppHeader } from "@/src/components/navigation/AppHeader";

const cards = [
  {
    title: "Male reproductive system",
    titleAr: "الجهاز التناسلي الذكري",
    description: "Testes, epididymides, ductus deferentes, seminal vesicles, prostate, urethra and penis, with sperm production, endocrine control and ejaculation physiology.",
    descriptionAr: "الخصيتان والبربخان والأسهران والحويصلات المنوية والبروستاتا والإحليل والقضيب، مع إنتاج النطاف والتحكم الهرموني وفسيولوجيا القذف.",
    systemHref: "/systems/male-reproductive",
    atlasHref: "/atlas/male-reproductive",
  },
  {
    title: "Female reproductive system",
    titleAr: "الجهاز التناسلي الأنثوي",
    description: "Ovaries, uterine tubes, uterus, cervix, vagina and external genitalia, with ovarian cycling, menstruation, fertilization, implantation and pregnancy physiology.",
    descriptionAr: "المبيضان والأنبوبان الرحميان والرحم وعنق الرحم والمهبل والأعضاء الخارجية، مع الدورة المبيضية والطمث والإخصاب والانغراس وفسيولوجيا الحمل.",
    systemHref: "/systems/female-reproductive",
    atlasHref: "/atlas/female-reproductive",
  },
];

export function ReproductiveChoicePage() {
  return (
    <div className="reproductive-choice-page">
      <AppHeader />
      <main className="reproductive-choice-main">
        <header>
          <p>Sex-specific anatomy / التشريح بحسب الجنس</p>
          <h1>Reproductive anatomy, separated clearly</h1>
          <h2 dir="rtl">التشريح التناسلي مفصول بوضوح</h2>
          <p className="reproductive-choice-lead">Choose the male or female system. Each path has its own anatomy tree, physiology pathways and three-dimensional view.</p>
          <p className="reproductive-choice-lead" dir="rtl">اختر الجهاز الذكري أو الأنثوي؛ لكل مسار شجرة تشريحية وعمليات فسيولوجية وعرض ثلاثي الأبعاد مستقل.</p>
        </header>
        <section className="reproductive-choice-grid">
          {cards.map((card) => (
            <article key={card.systemHref}>
              <div className="choice-icon"><Scan size={22} /></div>
              <h3>{card.title}</h3>
              <h4 dir="rtl">{card.titleAr}</h4>
              <p>{card.description}</p>
              <p dir="rtl">{card.descriptionAr}</p>
              <div className="choice-actions">
                <Link href={card.systemHref}>Study chapter <ArrowRight size={15} /></Link>
                <Link href={card.atlasHref}>Open 3D <Scan size={15} /></Link>
              </div>
            </article>
          ))}
        </section>
        <section className="whole-body-choice">
          <h3>Whole-body context / موضع الأجهزة داخل الجسم الكامل</h3>
          <div>
            <Link href="/atlas/male-body">Male full-body 3D / جسم الرجل</Link>
            <Link href="/atlas/female-body">Female full-body 3D / جسم المرأة</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
