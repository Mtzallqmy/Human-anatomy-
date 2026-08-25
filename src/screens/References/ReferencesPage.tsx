"use client";

import { ArrowUpRight, BookOpen } from "lucide-react";
import { AppHeader } from "@/src/components/navigation/AppHeader";
import { useLocale } from "@/src/hooks/useLocale";
import { medicalRepository } from "@/src/services/medicalRepository";

export function ReferencesPage() {
  const { t } = useLocale();
  const references = medicalRepository.getReferences();
  return (
    <div className="editorial-page">
      <AppHeader />
      <main className="editorial-main">
        <section className="editorial-hero">
          <p className="eyebrow">{t("referencesPage.eyebrow")}</p>
          <h1>{t("referencesPage.title")}</h1>
          <p className="editorial-intro">{t("referencesPage.description")}</p>
        </section>
        <div className="bibliography-list">
          {references.map((reference, index) => (
            <article className="bibliography-item" key={reference.id}>
              <div className="bibliography-number">
                <BookOpen size={17} />
                <span>0{index + 1}</span>
              </div>
              <div className="bibliography-content">
                <span className="bibliography-category">{t(`referencesPage.${reference.category}`)}</span>
                <h2>{reference.title}</h2>
                <p>{reference.authors.join(", ")}</p>
                <div className="bibliography-meta">
                  <span>
                    {t("referencesPage.published")}: {reference.year}
                  </span>
                  {reference.edition && <span>{reference.edition}</span>}
                  {reference.publisher && <span>{reference.publisher}</span>}
                </div>
              </div>
              {reference.url && (
                <a
                  className="bibliography-link"
                  href={reference.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("referencesPage.visitSource")}
                >
                  <ArrowUpRight size={18} />
                </a>
              )}
            </article>
          ))}
        </div>
      </main>
      <footer className="site-footer">
        <span>{t("brand.full")}</span>
        <span>{t("common.educationOnly")}</span>
      </footer>
    </div>
  );
}
