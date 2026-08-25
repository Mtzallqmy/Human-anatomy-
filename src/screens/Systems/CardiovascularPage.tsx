"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, HeartPulse } from "lucide-react";
import { AppHeader } from "@/src/components/navigation/AppHeader";
import { MedicalContentBootstrap } from "@/src/features/anatomy/MedicalContentBootstrap";
import { useLocale } from "@/src/hooks/useLocale";
import { useContentStore } from "@/src/store/contentStore";

export function CardiovascularPage() {
  const { t, localize, isRTL } = useLocale();
  const structures = useContentStore((state) =>
    state.structures.filter((structure) => structure.systemId === "SYS_CARDIOVASCULAR"),
  );
  const diseases = useContentStore((state) => state.diseases);
  const references = useContentStore((state) => state.references);

  return (
    <div className="editorial-page">
      <MedicalContentBootstrap />
      <AppHeader />
      <main className="editorial-main">
        <section className="editorial-hero">
          <p className="eyebrow">
            <span className="status-dot" />
            {t("systemPage.label")}
          </p>
          <h1>{t("systemPage.title")}</h1>
          <p className="editorial-intro">{t("systemPage.intro")}</p>
          <Link href="/atlas" className="primary-link">
            {t("systemPage.explore")}
            <ArrowRight size={16} className={isRTL ? "rtl-flip" : ""} />
          </Link>
        </section>
        <div className="system-metrics">
          <div>
            <strong>{structures.length}</strong>
            <span>{t("systemPage.anatomyCount")}</span>
          </div>
          <div>
            <strong>{diseases.length}</strong>
            <span>{t("systemPage.diseaseCount")}</span>
          </div>
          <div>
            <strong>{references.length}</strong>
            <span>{t("systemPage.referenceCount")}</span>
          </div>
        </div>
        <section className="organ-feature">
          <div>
            <p className="eyebrow">{t("systemPage.organLabel")}</p>
            <HeartPulse size={71} strokeWidth={0.9} className="organ-feature-icon" />
            <h2>{t("systemPage.chamberTitle")}</h2>
            <p>{t("systemPage.chamberDescription")}</p>
          </div>
          <Link href="/atlas" className="organ-feature-link">
            {t("systemPage.explore")}
            <ArrowUpRight size={17} />
          </Link>
        </section>
        <section className="disease-module-section">
          <div className="editorial-section-heading">
            <h2>{t("systemPage.conditions")}</h2>
            <span>0{diseases.length}</span>
          </div>
          <div className="disease-module-grid">
            {diseases.map((disease, index) => (
              <Link key={disease.id} href={`/disease/${disease.id}`} className="disease-module-card">
                <span>0{index + 1}</span>
                <h3>{localize(disease.name)}</h3>
                <p>{localize(disease.summary)}</p>
                <ArrowUpRight size={16} />
              </Link>
            ))}
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
