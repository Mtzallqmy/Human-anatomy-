"use client";

import { useLocale } from "@/src/hooks/useLocale";
import { usePathologyStore } from "@/src/store/pathologyStore";
import type { Disease } from "@/src/types/medical";

export function DiseaseProgressSlider({ disease }: { disease: Disease }) {
  const { t, localize } = useLocale();
  const progress = usePathologyStore((state) => state.diseaseProgress);
  const selectedStage = usePathologyStore((state) => state.selectedDiseaseStage);
  const setProgress = usePathologyStore((state) => state.setDiseaseProgress);
  const activeStage = disease.stages.find((stage) => stage.id === selectedStage) ?? disease.stages[0];

  return (
    <section className="disease-slider">
      <div className="slider-heading">
        <h3>{t("medical.diseaseProgress")}</h3>
        <span>{Math.round(progress * 100)}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={progress}
        onChange={(event) => setProgress(Number(event.target.value))}
        aria-label={t("medical.diseaseProgress")}
        style={{ "--slider-progress": `${progress * 100}%` } as React.CSSProperties}
      />
      <div className="slider-stage-labels">
        <span>{localize(disease.stages[0].name)}</span>
        <span>{localize(disease.stages[disease.stages.length - 1].name)}</span>
      </div>
      <div className="active-stage">
        <strong>{localize(activeStage.name)}</strong>
        <p>{localize(activeStage.description)}</p>
      </div>
    </section>
  );
}
