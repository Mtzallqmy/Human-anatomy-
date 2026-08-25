"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  HeartPulse,
  Layers3,
  ScanLine,
  Waves,
} from "lucide-react";
import { gsap } from "gsap";
import { AppHeader } from "@/src/components/navigation/AppHeader";
import { useLocale } from "@/src/hooks/useLocale";

export function HomePage() {
  const { t, isRTL } = useLocale();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-reveal]",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, stagger: 0.11, duration: 0.85, ease: "power2.out", delay: 0.08 },
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
    <div className="marketing-page" ref={pageRef}>
      <AppHeader />
      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow" data-hero-reveal>
              <span className="status-dot" />
              {t("home.eyebrow")}
            </p>
            <h1 className="hero-title" data-hero-reveal>
              <span>{t("home.lineOne")}</span>
              <span>{t("home.lineTwo")}</span>
              <span className="hero-title-accent">{t("home.lineThree")}</span>
            </h1>
            <p className="hero-intro" data-hero-reveal>
              {t("home.intro")}
            </p>
            <Link href="/atlas" className="primary-link" data-hero-reveal>
              {t("home.enter")}
              <ArrowRight size={17} className={isRTL ? "rtl-flip" : ""} />
            </Link>
          </div>
          <Link
            href="/systems/cardiovascular"
            className="featured-module"
            data-hero-reveal
            aria-label={t("home.heart")}
          >
            <div className="featured-module-top">
              <span>{t("home.featured")}</span>
              <ArrowUpRight size={18} />
            </div>
            <div className="featured-heart-symbol">
              <HeartPulse size={112} strokeWidth={0.8} aria-hidden="true" />
            </div>
            <div className="featured-module-bottom">
              <span className="module-kicker">{t("home.cardiovascular")}</span>
              <strong>{t("home.heart")}</strong>
              <p>{t("home.moduleDescription")}</p>
            </div>
          </Link>
          <div className="hero-scroll" data-hero-reveal>
            <ArrowDown size={14} />
            {t("home.scroll")}
          </div>
        </section>
        <section className="principles-section">
          <div className="section-heading">
            <p className="eyebrow">{t("home.chapter")}</p>
            <h2>{t("home.frameworkTitle")}</h2>
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
        <section className="final-cta">
          <div>
            <p className="eyebrow">
              <span className="status-dot" />
              {t("home.status")}
            </p>
            <h2>{t("home.ctaTitle")}</h2>
            <p>{t("home.ctaDescription")}</p>
          </div>
          <Link href="/atlas" className="primary-link">
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
