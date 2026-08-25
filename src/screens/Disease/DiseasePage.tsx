"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AppHeader } from "@/src/components/navigation/AppHeader";
import { MedicalContentBootstrap } from "@/src/features/anatomy/MedicalContentBootstrap";
import { useLocale } from "@/src/hooks/useLocale";
import { useContentStore } from "@/src/store/contentStore";
import { usePathologyStore } from "@/src/store/pathologyStore";
import { useUIStore } from "@/src/store/uiStore";
import { useViewerStore } from "@/src/store/viewerStore";
import { getImagingStudiesForDisease } from "@/src/data/imaging/imagingStudies";

export function DiseasePage({ diseaseId, initialSystemId }: { diseaseId: string; initialSystemId?: string }) {
  const { t, localize, isRTL } = useLocale();
  const disease = useContentStore((state) => state.diseases.find((item) => item.id === diseaseId));
  const structures = useContentStore((state) => state.structures);
  const references = useContentStore((state) =>
    state.references.filter((reference) =>
      state.diseases.find((item) => item.id === diseaseId)?.referenceIds.includes(reference.id),
    ),
  );
  const selectDisease = usePathologyStore((state) => state.selectDisease);
  const selectStructure = useViewerStore((state) => state.setSelectedStructure);
  const selectSystem = useViewerStore((state) => state.setSelectedSystem);
  const setMedicalTab = useUIStore((state) => state.setActiveMedicalTab);
  const imaging = getImagingStudiesForDisease(diseaseId);

  useEffect(() => {
    if (initialSystemId) selectSystem(initialSystemId);
  }, [initialSystemId, selectSystem]);

  if (!disease)
    return (
      <div className="editorial-page">
        <MedicalContentBootstrap />
        <AppHeader />
        <main className="editorial-main">
          <p>{t("common.noResults")}</p>
          <Link href="/atlas">{t("nav.openAtlas")}</Link>
        </main>
      </div>
    );

  const details = [
    { label: t("medical.etiology"), value: disease.etiology },
    { label: t("medical.pathogenesis"), value: disease.pathogenesis },
    { label: t("medical.morphology"), value: disease.morphology },
    { label: t("medical.effects"), value: disease.functionalEffects },
  ];

  return (
    <div className="editorial-page">
      <MedicalContentBootstrap />
      <AppHeader />
      <main className="editorial-main">
        <section className="editorial-hero disease-hero">
          <p className="eyebrow">{t("diseasePage.eyebrow")}</p>
          <h1>{localize(disease.name)}</h1>
          <p className="editorial-intro">{localize(disease.summary)}</p>
          <Link
            href={`/atlas/structure/${disease.affectedStructureIds[0]}`}
            className="primary-link"
            onClick={() => {
              selectStructure(disease.affectedStructureIds[0]);
              selectDisease(disease.id);
              setMedicalTab("pathology");
            }}
          >
            {t("diseasePage.openAtlas")}
            <ArrowRight size={16} className={isRTL ? "rtl-flip" : ""} />
          </Link>
        </section>
        <div className="disease-detail-grid">
          {details.map((detail) => (
            <section key={detail.label} className="disease-detail">
              <h2>{detail.label}</h2>
              <p>{localize(detail.value)}</p>
            </section>
          ))}
        </div>
        <section className="progression-section">
          <div className="editorial-section-heading">
            <h2>{t("diseasePage.progression")}</h2>
          </div>
          <div className="stage-grid">
            {disease.stages.map((stage) => (
              <article key={stage.id} className="disease-stage-card">
                <span>0{stage.order + 1}</span>
                <i className={stage.order === 0 ? "stage-dot stage-dot--healthy" : "stage-dot"} />
                <h3>{localize(stage.name)}</h3>
                <p>{localize(stage.description)}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="affected-section">
          <div className="editorial-section-heading">
            <h2>{t("medical.affectedStructures")}</h2>
          </div>
          <div className="affected-links">
            {disease.affectedStructureIds.map((id) => {
              const structure = structures.find((item) => item.id === id);
              return structure ? (
                <Link key={id} href={`/atlas/structure/${id}`}>
                  {localize(structure.name)}
                  <ArrowUpRight size={15} />
                </Link>
              ) : null;
            })}
          </div>
        </section>
        {imaging.length > 0 && (
          <section className="affected-section">
            <div className="editorial-section-heading">
              <h2>{t("medical.imaging")}</h2>
            </div>
            <div className="affected-links">
              {imaging.map((study) => (
                <Link key={study.id} href={`/imaging/${study.id}`}>
                  {localize(study.title)}
                  <ArrowUpRight size={15} />
                </Link>
              ))}
            </div>
          </section>
        )}
        <section className="disease-references">
          <div className="editorial-section-heading">
            <h2>{t("diseasePage.citations")}</h2>
          </div>
          {references.map((reference) => (
            <p key={reference.id}>
              {reference.title} · {reference.authors.join(", ")} · {reference.year}
            </p>
          ))}
        </section>
      </main>
      <footer className="site-footer">
        <span>{t("brand.full")}</span>
        <span>{t("common.educationOnly")}</span>
      </footer>
    </div>
  );
}
