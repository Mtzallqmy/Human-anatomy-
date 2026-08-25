"use client";

import { Activity, Gauge, Pause, Play, SlidersHorizontal } from "lucide-react";
import { physiologyAnimations } from "@/src/data/anatomy/humanBodyCatalog";
import {
  getSystemLearningProfile,
  supplementalPhysiologyAnimations,
} from "@/src/data/anatomy/comprehensiveSystems";
import { bloodFlowSteps } from "@/src/data/physiology/bloodFlow";
import { useLocale } from "@/src/hooks/useLocale";
import { useContentStore } from "@/src/store/contentStore";
import { useViewerStore } from "@/src/store/viewerStore";
import type { AnatomicalStructure } from "@/src/types/medical";

const allPhysiologyAnimations = [...physiologyAnimations, ...supplementalPhysiologyAnimations];

export function PhysiologyPanel({ structure }: { structure: AnatomicalStructure }) {
  const { t, localize, locale } = useLocale();
  const structures = useContentStore((state) => state.structures);
  const bloodFlowEnabled = useViewerStore((state) => state.bloodFlowEnabled);
  const setBloodFlowEnabled = useViewerStore((state) => state.setBloodFlowEnabled);
  const selectStructure = useViewerStore((state) => state.setSelectedStructure);
  const selectedStructureId = useViewerStore((state) => state.selectedStructureId);
  const animation = allPhysiologyAnimations.find((item) => item.systemId === structure.systemId);
  const profile = getSystemLearningProfile(structure.systemId);
  const label = (en: string, ar: string) => (locale === "ar" ? ar : en);
  const sameSystemIds = new Set(
    structures.filter((item) => item.systemId === structure.systemId).map((item) => item.id),
  );
  const pathway =
    structure.systemId === "SYS_CARDIOVASCULAR"
      ? bloodFlowSteps.map((step, index) => ({ ...step, id: `${step.structureId}-${index}` }))
      : (animation?.steps ?? [])
          .filter((step) => sameSystemIds.has(step.structureId))
          .map((step) => ({
            id: step.id,
            structureId: step.structureId,
            name: step.name,
            oxygenation: "oxygenated" as const,
          }));

  return (
    <div className="medical-content physiology-panel-rich">
      <section className="content-section physiology-function-card">
        <div className="content-section-title-row">
          <Activity size={16} />
          <h3>{t("medical.function")}</h3>
        </div>
        <p>{localize(structure.physiology)}</p>
      </section>

      {profile && (
        <section className="content-section physiology-overview-section">
          <p className="panel-kicker">{label("System physiology", "فسيولوجيا الجهاز")}</p>
          <h3>{label("What this system is doing", "ماذا يفعل هذا الجهاز؟")}</h3>
          <p>{localize(profile.overview)}</p>
          <ul className="physiology-focus-list">
            {profile.physiologyFocus.map((item) => (
              <li key={item.en}>{localize(item)}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="content-section physiology-pathway-section">
        <h3>{animation ? localize(animation.name) : t("medical.bloodFlow")}</h3>
        <p>
          {structure.systemId === "SYS_CARDIOVASCULAR"
            ? t("medical.bloodFlowDescription")
            : t("medical.systemPathwayDescription")}
        </p>
        <button
          type="button"
          className={bloodFlowEnabled ? "flow-toggle flow-toggle--active" : "flow-toggle"}
          onClick={() => setBloodFlowEnabled(!bloodFlowEnabled)}
        >
          {bloodFlowEnabled ? <Pause size={14} /> : <Play size={14} />}
          {t(bloodFlowEnabled ? "medical.disableFlow" : "medical.enablePathway")}
        </button>
        {structure.systemId === "SYS_CARDIOVASCULAR" && (
          <div className="flow-legend">
            <span>
              <i className="flow-dot flow-dot--venous" />
              {t("medical.deoxygenated")}
            </span>
            <span>
              <i className="flow-dot flow-dot--arterial" />
              {t("medical.oxygenated")}
            </span>
          </div>
        )}
        <ol className="flow-steps physiology-flow-steps">
          {pathway.map((step, index) => (
            <li key={step.id}>
              <button
                type="button"
                className={selectedStructureId === step.structureId ? "flow-step--active" : ""}
                onClick={() => selectStructure(step.structureId)}
              >
                <span className="flow-step-index">{index + 1}</span>
                <i
                  className={`flow-dot flow-dot--${step.oxygenation === "oxygenated" ? "arterial" : "venous"}`}
                />
                {localize(step.name)}
              </button>
            </li>
          ))}
        </ol>
      </section>

      {profile && (
        <>
          <section className="content-section">
            <div className="content-section-title-row">
              <SlidersHorizontal size={16} />
              <h3>{label("Mechanisms", "الآليات")}</h3>
            </div>
            <div className="physiology-mechanism-stack">
              {profile.mechanisms.map((mechanism, index) => (
                <article key={mechanism.title.en} className="physiology-mechanism-card">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h4>{localize(mechanism.title)}</h4>
                    <p>{localize(mechanism.description)}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="content-section">
            <div className="content-section-title-row">
              <Gauge size={16} />
              <h3>{label("Regulation & normal values", "التنظيم والقيم الطبيعية")}</h3>
            </div>
            <ul className="physiology-regulation-list">
              {profile.regulation.map((item) => (
                <li key={item.en}>{localize(item)}</li>
              ))}
            </ul>
            <div className="physiology-values-grid">
              {profile.keyValues.map((item) => (
                <div className="physiology-value" key={item.label.en}>
                  <span>{localize(item.label)}</span>
                  <strong dir="ltr">{item.value}</strong>
                  <small>{localize(item.note)}</small>
                </div>
              ))}
            </div>
          </section>

          <section className="content-section physiology-clinical-note">
            <h3>{label("Clinical integration", "الربط السريري")}</h3>
            <ul className="physiology-regulation-list">
              {profile.clinicalLinks.map((item) => (
                <li key={item.en}>{localize(item)}</li>
              ))}
            </ul>
          </section>
        </>
      )}

      {structure.systemId === "SYS_CARDIOVASCULAR" && (
        <section className="content-section">
          <h3>{t("medical.cardiacCycle")}</h3>
          <p>{t("medical.cardiacCycleDescription")}</p>
        </section>
      )}
    </div>
  );
}
