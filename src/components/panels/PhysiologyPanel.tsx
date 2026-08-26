"use client";

import { Activity, Gauge, Pause, Play, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { BilingualMedicalText } from "@/src/components/medical/BilingualMedicalText";
import { physiologyAnimations } from "@/src/data/anatomy/humanBodyCatalog";
import { getSystemLearningProfile, supplementalPhysiologyAnimations } from "@/src/data/anatomy/comprehensiveSystems";
import { sexSpecificPhysiologyAnimations } from "@/src/data/anatomy/sexSpecificAtlas";
import { getSexSpecificLearningProfile } from "@/src/data/anatomy/sexSpecificLearningProfiles";
import { wholeBodyPhysiologyAnimations } from "@/src/data/physiology/wholeBodyProcesses";
import { bloodFlowSteps } from "@/src/data/physiology/bloodFlow";
import { useLocale } from "@/src/hooks/useLocale";
import { useContentStore } from "@/src/store/contentStore";
import { useViewerStore } from "@/src/store/viewerStore";
import type { AnatomicalStructure, LocalizedText, PhysiologyAnimation } from "@/src/types/medical";

const allPhysiologyAnimations = [
  ...physiologyAnimations,
  ...supplementalPhysiologyAnimations,
  ...sexSpecificPhysiologyAnimations,
  ...wholeBodyPhysiologyAnimations,
];

type DisplayPathwayStep = {
  id: string;
  structureId: string;
  name: LocalizedText;
  description?: LocalizedText;
  oxygenation: "oxygenated" | "deoxygenated";
};

export function PhysiologyPanel({ structure }: { structure: AnatomicalStructure }) {
  const { t, locale } = useLocale();
  const structures = useContentStore((state) => state.structures);
  const bloodFlowEnabled = useViewerStore((state) => state.bloodFlowEnabled);
  const setBloodFlowEnabled = useViewerStore((state) => state.setBloodFlowEnabled);
  const selectStructure = useViewerStore((state) => state.setSelectedStructure);
  const selectedStructureId = useViewerStore((state) => state.selectedStructureId);
  const animations = useMemo(
    () => allPhysiologyAnimations.filter((item) => item.systemId === structure.systemId),
    [structure.systemId],
  );
  const [animationId, setAnimationId] = useState<string>("");
  const activeAnimationId = animations.some((item) => item.id === animationId)
    ? animationId
    : (animations[0]?.id ?? "");
  const animation: PhysiologyAnimation | undefined = animations.find((item) => item.id === activeAnimationId);
  const profile = getSystemLearningProfile(structure.systemId) ?? getSexSpecificLearningProfile(structure.systemId);
  const label = (en: string, ar: string) => (locale === "ar" ? ar : en);
  const sameSystemIds = new Set(structures.filter((item) => item.systemId === structure.systemId).map((item) => item.id));
  const pathway: DisplayPathwayStep[] = structure.systemId === "SYS_CARDIOVASCULAR"
    ? bloodFlowSteps.map((step, index) => ({
        ...step,
        id: `${step.structureId}-${index}`,
      }))
    : (animation?.steps ?? [])
        .filter((step) => sameSystemIds.has(step.structureId))
        .map((step) => ({
          id: step.id,
          structureId: step.structureId,
          name: step.name,
          description: step.description,
          oxygenation: "oxygenated" as const,
        }));

  return (
    <div className="medical-content physiology-panel-rich">
      <section className="content-section physiology-function-card">
        <div className="content-section-title-row"><Activity size={16} /><h3>{t("medical.function")}</h3></div>
        <BilingualMedicalText value={structure.physiology} />
      </section>

      {profile && (
        <section className="content-section physiology-overview-section">
          <p className="panel-kicker">{label("System physiology", "فسيولوجيا الجهاز")}</p>
          <h3>{label("What this system is doing", "ماذا يفعل هذا الجهاز؟")}</h3>
          <BilingualMedicalText value={profile.overview} />
          <ul className="physiology-focus-list">{profile.physiologyFocus.map((item) => <li key={item.en}><BilingualMedicalText value={item} compact /></li>)}</ul>
        </section>
      )}

      <section className="content-section physiology-pathway-section">
        <h3>{animation ? <BilingualMedicalText value={animation.name} compact /> : t("medical.bloodFlow")}</h3>
        {animations.length > 1 && (
          <div className="physiology-process-picker" role="tablist" aria-label="Physiological processes">
            {animations.map((item) => (
              <button key={item.id} type="button" className={item.id === activeAnimationId ? "is-active" : ""} onClick={() => setAnimationId(item.id)}>
                <BilingualMedicalText value={item.name} compact />
              </button>
            ))}
          </div>
        )}
        <p>{structure.systemId === "SYS_CARDIOVASCULAR" ? t("medical.bloodFlowDescription") : t("medical.systemPathwayDescription")}</p>
        <button type="button" className={bloodFlowEnabled ? "flow-toggle flow-toggle--active" : "flow-toggle"} onClick={() => setBloodFlowEnabled(!bloodFlowEnabled)}>
          {bloodFlowEnabled ? <Pause size={14} /> : <Play size={14} />}
          {t(bloodFlowEnabled ? "medical.disableFlow" : "medical.enablePathway")}
        </button>
        {structure.systemId === "SYS_CARDIOVASCULAR" && (
          <div className="flow-legend"><span><i className="flow-dot flow-dot--venous" />{t("medical.deoxygenated")}</span><span><i className="flow-dot flow-dot--arterial" />{t("medical.oxygenated")}</span></div>
        )}
        <ol className="flow-steps physiology-flow-steps">
          {pathway.map((step, index) => (
            <li key={step.id}>
              <button type="button" className={selectedStructureId === step.structureId ? "flow-step--active" : ""} onClick={() => selectStructure(step.structureId)}>
                <span className="flow-step-index">{index + 1}</span>
                <i className={`flow-dot flow-dot--${step.oxygenation === "oxygenated" ? "arterial" : "venous"}`} />
                <span className="flow-step-copy">
                  <BilingualMedicalText value={step.name} compact />
                  {step.description && <BilingualMedicalText value={step.description} compact />}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      {profile && (
        <>
          <section className="content-section">
            <div className="content-section-title-row"><SlidersHorizontal size={16} /><h3>{label("Mechanisms", "الآليات")}</h3></div>
            <div className="physiology-mechanism-stack">{profile.mechanisms.map((mechanism, index) => <article key={mechanism.title.en} className="physiology-mechanism-card"><span>{String(index + 1).padStart(2, "0")}</span><div><h4><BilingualMedicalText value={mechanism.title} compact /></h4><BilingualMedicalText value={mechanism.description} /></div></article>)}</div>
          </section>
          <section className="content-section">
            <div className="content-section-title-row"><Gauge size={16} /><h3>{label("Regulation & normal values", "التنظيم والقيم الطبيعية")}</h3></div>
            <ul className="physiology-regulation-list">{profile.regulation.map((item) => <li key={item.en}><BilingualMedicalText value={item} compact /></li>)}</ul>
            <div className="physiology-values-grid">{profile.keyValues.map((item) => <div className="physiology-value" key={item.label.en}><BilingualMedicalText value={item.label} compact /><strong dir="ltr">{item.value}</strong><BilingualMedicalText value={item.note} compact /></div>)}</div>
          </section>
          <section className="content-section physiology-clinical-note"><h3>{label("Clinical integration", "الربط السريري")}</h3><ul className="physiology-regulation-list">{profile.clinicalLinks.map((item) => <li key={item.en}><BilingualMedicalText value={item} compact /></li>)}</ul></section>
        </>
      )}

      {structure.systemId === "SYS_CARDIOVASCULAR" && <section className="content-section"><h3>{t("medical.cardiacCycle")}</h3><p>{t("medical.cardiacCycleDescription")}</p></section>}
    </div>
  );
}
