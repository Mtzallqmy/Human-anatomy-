"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bone,
  BookOpen,
  Brain,
  Circle,
  CircleDot,
  Droplets,
  GitBranch,
  Heart,
  Layers3,
  Network,
  ScanLine,
  Sparkles,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { gsap } from "gsap";
import { AppHeader } from "@/src/components/navigation/AppHeader";
import { allHumanStructures } from "@/src/data/anatomy/humanBodyCatalog";
import { supplementalStructures, systemLearningProfiles } from "@/src/data/anatomy/comprehensiveSystems";
import { sexSpecificStructures, sexSpecificSystems } from "@/src/data/anatomy/sexSpecificAtlas";
import { sexSpecificLearningProfiles } from "@/src/data/anatomy/sexSpecificLearningProfiles";
import { bodySystems } from "@/src/data/systems/systems";
import { useLocale } from "@/src/hooks/useLocale";

const icons: Record<string, LucideIcon> = {
  heart: Heart,
  bone: Bone,
  activity: Activity,
  brain: Brain,
  wind: Wind,
  "circle-dot": CircleDot,
  droplets: Droplets,
  sparkles: Sparkles,
  "git-branch": GitBranch,
  circle: Circle,
  scan: ScanLine,
};

const totalStructures = allHumanStructures.length + supplementalStructures.length + sexSpecificStructures.length;
const learningSystems = [
  ...bodySystems.filter((system) => !["SYS_FULL_BODY", "SYS_REPRODUCTIVE"].includes(system.id)),
  ...sexSpecificSystems,
];
const allLearningProfiles = [...systemLearningProfiles, ...sexSpecificLearningProfiles];

export function HomePage() {
  const { t, isRTL, localize, locale } = useLocale();
  const pageRef = useRef<HTMLDivElement>(null);
  const label = (en: string, ar: string) => (locale === "ar" ? ar : en);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-reveal]",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, stagger: 0.09, duration: 0.78, ease: "power2.out", delay: 0.06 },
      );
      gsap.fromTo(
        "[data-system-card]",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: 0.035, duration: 0.55, ease: "power2.out", delay: 0.22 },
      );
    }, pageRef);
    return () => context.revert();
  }, []);

  const principles = [
    { icon: Layers3, index: "01", title: t("home.anatomyTitle"), description: t("home.anatomyDescription") },
    {
      icon: Waves,
      index: "02",
      title: t("home.physiologyTitle"),
      description: t("home.physiologyDescription"),
    },
    {
      icon: ScanLine,
      index: "03",
      title: t("home.pathologyTitle"),
      description: t("home.pathologyDescription"),
    },
    {
      icon: BookOpen,
      index: "04",
      title: t("home.evidenceTitle"),
      description: t("home.evidenceDescription"),
    },
  ];

  return (
    <div className="marketing-page experience-home" ref={pageRef}>
      <AppHeader />
      <main>
        <section className="hero-section experience-hero">
          <div className="hero-copy">
            <p className="eyebrow" data-hero-reveal>
              <span className="status-dot" />
              {label("Interactive anatomy · physiology · pathology", "تشريح · فسيولوجيا · أمراض تفاعلية")}
            </p>
            <h1 className="hero-title" data-hero-reveal>
              <span>{t("home.lineOne")}</span>
              <span>{t("home.lineTwo")}</span>
              <span className="hero-title-accent">{t("home.lineThree")}</span>
            </h1>
            <p className="hero-intro" data-hero-reveal>
              {label(
                "Move from the whole male or female body to a system, from a system to a structure, then connect its anatomy to the mechanism that makes it work. Built for active exploration rather than passive reading.",
                "انتقل من جسم الرجل أو المرأة كاملًا إلى الجهاز، ومن الجهاز إلى التركيب، ثم اربط تشريحه بالآلية التي تجعله يعمل. صُمم للاستكشاف النشط لا للقراءة السلبية فقط.",
              )}
            </p>
            <div className="experience-hero-actions" data-hero-reveal>
              <Link href="/atlas/male-body" className="primary-link">
                {label("Male body 3D", "جسم الرجل ثلاثي الأبعاد")}
                <ArrowRight size={17} className={isRTL ? "rtl-flip" : ""} />
              </Link>
              <Link href="/atlas/female-body" className="secondary-link">
                {label("Female body 3D", "جسم المرأة ثلاثي الأبعاد")}
              </Link>
              <a href="#systems" className="secondary-link">
                {label("Browse all systems", "استعرض كل الأجهزة")}
              </a>
            </div>
            <div className="experience-stat-row" data-hero-reveal>
              <div>
                <strong>{learningSystems.length}</strong>
                <span>{label("learning paths", "مسار تعلم")}</span>
              </div>
              <div>
                <strong>{totalStructures}+</strong>
                <span>{label("mapped structures", "تركيبًا مشروحًا")}</span>
              </div>
              <div>
                <strong>{allLearningProfiles.length}</strong>
                <span>{label("deep physiology chapters", "فصل فسيولوجيا معمق")}</span>
              </div>
            </div>
          </div>

          <div className="experience-hero-explorer" data-hero-reveal>
            <div className="explorer-orbit explorer-orbit--outer" />
            <div className="explorer-orbit explorer-orbit--inner" />
            <div className="explorer-core">
              <span
                style={{
                  position: "absolute",
                  top: 12,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: "0.54rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#8fd3dc",
                  background: "rgba(143,211,220,0.12)",
                  border: "1px solid rgba(143,211,220,0.22)",
                  padding: "4px 8px",
                  borderRadius: 999,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#8fd3dc",
                    boxShadow: "0 0 10px rgba(143,211,220,0.7)",
                  }}
                />
                LIVE 3D
              </span>
              <ScanLine size={104} strokeWidth={0.75} aria-hidden="true" />
              <span>{label("Whole-body anatomy", "تشريح الجسم الكامل")}</span>
              <small style={{ color: "var(--subtle)", fontSize: "0.58rem", marginTop: 2 }}>
                {label("Rotate · Isolate · Explore", "دوّر · اعزل · استكشف")}
              </small>
            </div>
            <Link href="/atlas/male-body" className="explorer-node explorer-node--one">
              <ScanLine size={16} />
              <span>{label("Male body", "جسم الرجل")}</span>
            </Link>
            <Link href="/atlas/female-body" className="explorer-node explorer-node--two">
              <ScanLine size={16} />
              <span>{label("Female body", "جسم المرأة")}</span>
            </Link>
            <Link href="/atlas/male-reproductive" className="explorer-node explorer-node--three">
              <Circle size={16} />
              <span>{label("Male reproductive", "التناسلي الذكري")}</span>
            </Link>
            <Link href="/atlas/female-reproductive" className="explorer-node explorer-node--four">
              <Circle size={16} />
              <span>{label("Female reproductive", "التناسلي الأنثوي")}</span>
            </Link>
            <div className="explorer-caption">
              <Network size={15} />
              <span>{label("Everything connects", "كل شيء مترابط")}</span>
            </div>
          </div>

          <div className="hero-scroll" data-hero-reveal>
            <ArrowDown size={14} />
            {t("home.scroll")}
          </div>
        </section>

        <section className="systems-showcase" id="systems">
          <div className="section-heading systems-showcase-heading">
            <div>
              <p className="eyebrow">{label("Complete body-system atlas", "أطلس متكامل لأجهزة الجسم")}</p>
              <h2>{label("Choose a body, then a system. Learn it as one connected story.", "اختر الجسم ثم الجهاز وتعلمه كقصة واحدة مترابطة.")}</h2>
            </div>
            <p>{label("Each chapter combines structures, relationships, physiology, normal values and direct 3D exploration.", "يجمع كل فصل التراكيب والعلاقات والفسيولوجيا والقيم الطبيعية والاستكشاف ثلاثي الأبعاد مباشرة.")}</p>
          </div>
          <div className="systems-showcase-grid">
            {learningSystems.map((system, index) => {
              const Icon = icons[system.icon] ?? Network;
              const profile = allLearningProfiles.find((item) => item.systemId === system.id);
              return (
                <article
                  className="system-showcase-card"
                  key={system.id}
                  data-system-card
                  style={{ "--system-accent": system.accentColor } as CSSProperties}
                >
                  <div className="system-showcase-top">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <Icon size={22} strokeWidth={1.35} />
                  </div>
                  <div>
                    <h3>{localize(system.name)}</h3>
                    <p>{localize(system.description)}</p>
                  </div>
                  <div className="system-showcase-meta">
                    <span>◈ {profile?.anatomyFocus.length ?? 0} {label("anatomy tracks", "محاور تشريح")}</span>
                    <span>⬢ {profile?.physiologyFocus.length ?? 0} {label("physiology tracks", "محاور فسيولوجيا")}</span>
                    <span style={{ background: "var(--accent-soft)", color: "var(--accent)", borderColor: "rgba(206,119,112,0.22)" }}>
                      3D • HD
                    </span>
                  </div>
                  <div className="system-showcase-actions">
                    <Link href={`/systems/${system.slug}`}>
                      {label("Study chapter", "ادرس الفصل")}
                      <ArrowUpRight size={15} />
                    </Link>
                    <Link href={`/atlas/${system.slug}`} aria-label={`${localize(system.name)} 3D`}>
                      3D
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="principles-section experience-principles">
          <div className="section-heading">
            <p className="eyebrow">{t("home.chapter")}</p>
            <h2>{label("One learning loop, four medical lenses", "حلقة تعلم واحدة، أربع زوايا طبية")}</h2>
          </div>
          <div className="principles-grid">
            {principles.map(({ icon: Icon, index, title, description }) => (
              <article className="principle-item" key={index}>
                <div className="principle-top">
                  <Icon size={20} strokeWidth={1.5} />
                  <span>{index}</span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="learning-flow-section">
          <div className="section-heading">
            <p className="eyebrow">{label("Designed for flow", "مصمم للانسيابية")}</p>
            <h2>{label("Do not lose context while you learn", "لا تفقد السياق أثناء التعلم")}</h2>
          </div>
          <div className="learning-flow-grid">
            <article>
              <span>01</span>
              <Layers3 size={21} />
              <h3>{label("Orient", "تعرّف على المكان")}</h3>
              <p>{label("Start with the male or female whole-body map and regional relationships before memorizing isolated names.", "ابدأ بخريطة جسم الرجل أو المرأة والعلاقات الموضعية قبل حفظ الأسماء منفردة.")}</p>
            </article>
            <article>
              <span>02</span>
              <ScanLine size={21} />
              <h3>{label("Explore", "استكشف")}</h3>
              <p>{label("Select, rotate, isolate and follow structures directly in the interactive viewer.", "حدد التراكيب ودوّرها واعزلها وتتبعها مباشرة داخل المستعرض التفاعلي.")}</p>
            </article>
            <article>
              <span>03</span>
              <Waves size={21} />
              <h3>{label("Understand function", "افهم الوظيفة")}</h3>
              <p>{label("Move from structure to mechanism, regulation and useful normal values.", "انتقل من التركيب إلى الآلية والتنظيم والقيم الطبيعية المفيدة.")}</p>
            </article>
            <article>
              <span>04</span>
              <BookOpen size={21} />
              <h3>{label("Connect clinically", "اربط سريريًا")}</h3>
              <p>{label("See how altered anatomy or physiology produces recognizable disease patterns.", "شاهد كيف ينتج تغير التشريح أو الفسيولوجيا أنماطًا مرضية مفهومة.")}</p>
            </article>
          </div>
        </section>

        <section className="final-cta experience-final-cta">
          <div>
            <p className="eyebrow">
              <span className="status-dot" />
              {label("Ready to explore", "جاهز للاستكشاف")}
            </p>
            <h2>{label("Start with the male or female whole body, then go as deep as you need.", "ابدأ بجسم الرجل أو المرأة كاملًا، ثم تعمق بالقدر الذي تحتاجه.")}</h2>
            <p>{label("The atlas keeps anatomy, physiology, pathology, imaging and references within the same learning context.", "يحافظ الأطلس على التشريح والفسيولوجيا والأمراض والتصوير والمراجع ضمن سياق تعلم واحد.")}</p>
          </div>
          <div className="experience-hero-actions">
            <Link href="/atlas/male-body" className="primary-link">
              {label("Male 3D", "الرجل 3D")}
              <ArrowRight size={17} className={isRTL ? "rtl-flip" : ""} />
            </Link>
            <Link href="/atlas/female-body" className="secondary-link">
              {label("Female 3D", "المرأة 3D")}
            </Link>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <span>{t("brand.full")}</span>
        <span>{t("common.educationOnly")}</span>
      </footer>
    </div>
  );
}
