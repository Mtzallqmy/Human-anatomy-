"use client";

import { Pause, Play } from "lucide-react";
import { bloodFlowSteps } from "@/src/data/physiology/bloodFlow";
import { useLocale } from "@/src/hooks/useLocale";
import { useViewerStore } from "@/src/store/viewerStore";
import type { AnatomicalStructure } from "@/src/types/medical";

export function PhysiologyPanel({ structure }: { structure: AnatomicalStructure }) {
  const { t, localize } = useLocale();
  const bloodFlowEnabled = useViewerStore((state) => state.bloodFlowEnabled);
  const setBloodFlowEnabled = useViewerStore((state) => state.setBloodFlowEnabled);
  const selectStructure = useViewerStore((state) => state.setSelectedStructure);

  return (
    <div className="medical-content">
      <section className="content-section">
        <h3>{t("medical.function")}</h3>
        <p>{localize(structure.physiology)}</p>
      </section>
      <section className="content-section">
        <h3>{t("medical.bloodFlow")}</h3>
        <p>{t("medical.bloodFlowDescription")}</p>
        <button
          type="button"
          className={bloodFlowEnabled ? "flow-toggle flow-toggle--active" : "flow-toggle"}
          onClick={() => setBloodFlowEnabled(!bloodFlowEnabled)}
        >
          {bloodFlowEnabled ? <Pause size={14} /> : <Play size={14} />}
          {t(bloodFlowEnabled ? "medical.disableFlow" : "medical.enableFlow")}
        </button>
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
        <ol className="flow-steps">
          {bloodFlowSteps.map((step, index) => (
            <li key={`${step.structureId}-${index}`}>
              <button type="button" onClick={() => selectStructure(step.structureId)}>
                <i
                  className={`flow-dot flow-dot--${step.oxygenation === "oxygenated" ? "arterial" : "venous"}`}
                />
                {localize(step.name)}
              </button>
            </li>
          ))}
        </ol>
      </section>
      <section className="content-section">
        <h3>{t("medical.cardiacCycle")}</h3>
        <p>{t("medical.cardiacCycleDescription")}</p>
      </section>
    </div>
  );
}
