"use client";

import { ArrowUpRight, BookOpen } from "lucide-react";
import { useLocale } from "@/src/hooks/useLocale";
import { useContentStore } from "@/src/store/contentStore";

export function ReferencesPanel({ referenceIds }: { referenceIds: string[] }) {
  const { t } = useLocale();
  const references = useContentStore((state) =>
    state.references.filter((reference) => referenceIds.includes(reference.id)),
  );
  return (
    <div className="medical-content">
      <section className="content-section">
        <h3>{t("medical.sources")}</h3>
        <p>{t("medical.sourceDescription")}</p>
      </section>
      <div className="reference-list">
        {references.map((reference, index) => (
          <article key={reference.id} className="reference-item">
            <div className="reference-index">
              <BookOpen size={13} />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h4>{reference.title}</h4>
            <p>{reference.authors.join(", ")}</p>
            <div className="reference-meta">
              <span>{reference.year}</span>
              {reference.edition && <span>{reference.edition}</span>}
            </div>
            {reference.url && (
              <a href={reference.url} target="_blank" rel="noreferrer">
                {t("referencesPage.visitSource")}
                <ArrowUpRight size={12} />
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
