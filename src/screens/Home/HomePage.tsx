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

const totalStructures = allHumanStructures.length + supplementalStructures.length;
const learningSystems = bodySystems.filter((system) => system.id !== "SYS_FULL_BODY");

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
                "Move from the whole body to a system, from a system to a structure, then connect its anatomy to the mechanism that makes it work. Built for active exploration rather than passive reading.",
                "انتقل من الجسم كاملًا إلى الجهاز، ومن الجهاز إلى التركيب، ثم اربط تشريحه بالآلية التي تجعله يعمل. صُمم للاستكشاف النشط لا للقراءة السلبية فقط.",
              )}
            </p>
            <div className="experience-hero-actions" data-hero-reveal>
              <Link href="/atlas" className="primary-link">
                {t("home.enter")}
                <ArrowRight size={17} className={isRTL ? "rtl-flip" : ""} />
              </Link>
              <a href="#systems" className="secondary-link">
                {label("Browse all systems", "استعرض كل الأجهزة")}
              </a>
            </div>
            <div className="experience-stat-row" data-hero-reveal>
              <div>
                <strong>{learningSystems.length}</strong>
                <span>{label("body systems", "جهازًا")}</span>
              </div>
              <div>
                <strong>{totalStructures}+</strong>
                <span>{label("mapped structures", "تركيبًا مشروحًا")}</span>
              </div>
              <div>
                <strong>{systemLearningProfiles.length}</strong>
                <span>{label("deep physiology chapters", "فصل فسيولوجيا معمق")}</span>
              </div>
            </div>
          </div>

          <div className="experience-hero-explorer" data-hero-reveal>
            <div className="explorer-orbit explorer-orbit--outer" />
            <div className="explorer-orbit explorer-orbit--inner" />
            <div className="explorer-core">
              <ScanLine size={104} strokeWidth={0.75} aria-hidden="true" />
              <span>{label("Human body", "جسم الإنسان")}</span>
            </div>
            <Link href="/atlas/cardiovascular" className="explorer-node explorer-node--one">
              <Heart size={16} />
              <span>{label("Circulation", "الدوران")}</span>
            </Link>
            <Link href="/atlas/nervous" className="explorer-node explorer-node--two">
              <Brain size={16} />
              <span>{label("Neural", "العصبي")}</span>
            </Link>
            <Link href="/atlas/respiratory" className="explorer-node explorer-node--three">
              <Wind size={16} />
              <span>{label("Gas exchange", "تبادل الغازات")}</span>
            </Link>
            <Link href="/atlas/endocrine" className="explorer-node explorer-node--four">
              <Sparkles size={16} />
              <span>{label("Hormones", "الهرمونات")}</span>
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
              <h2>{label("Choose a system. Learn it as one connected story.", "اختر جهازًا وتعلمه كقصة واحدة مترابطة.")}</h2>
            </div>
            <p>{label("Each chapter combines structures, relationships, physiology, normal values and direct 3D exploration.", "يجمع كل فصل التراكيب والعلاقات والفسيولوجيا والقيم الطبيعية والاستكشاف ثلاثي الأبعاد مباشرة.")}</p>
          </div>
          <div className="systems-showcase-grid">
            {learningSystems.map((system, index) => {
              const Icon = icons[system.icon] ?? Network;
              const profile = systemLearningProfiles.find((item) => item.systemId === system.id);
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
                    <span>{profile?.anatomyFocus.length ?? 0} {label("anatomy tracks", "محاور تشريح")}</span>
                    <span>{profile?.physiologyFocus.length ?? 0} {label("physiology tracks", "محاور فسيولوجيا")}</span>
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
              <p>{label("Start with the system map and regional relationships before memorizing isolated names.", "ابدأ بخريطة الجهاز والعلاقات الموضعية قبل حفظ الأسماء منفردة.")}</p>
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
            <h2>{label("Start with the whole body, then go as deep as you need.", "ابدأ بالجسم كاملًا، ثم تعمق بالقدر الذي تحتاجه.")}</h2>
            <p>{label("The atlas keeps anatomy, physiology, pathology, imaging and references within the same learning context.", "يحافظ الأطلس على التشريح والفسيولوجيا والأمراض والتصوير والمراجع ضمن سياق تعلم واحد.")}</p>
          </div>
          <Link href="/atlas/human-body" className="primary-link">
            {t("nav.explore")}
            <ArrowRight size={17} className={isRTL ? "rtl-flip" : ""} />
          </Link>
        </section>
      </main>
      <footer className="site-footer">
        <span>{t("brand.full")}</span>
        <span>{t("common.educationOnly")}</span>
      </footer>
    </div>
  );
}
