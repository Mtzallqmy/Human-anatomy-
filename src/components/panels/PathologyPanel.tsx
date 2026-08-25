"use client";

import Link from "next/link";
import { ArrowUpRight, TriangleAlert } from "lucide-react";
import { CompareToggle } from "@/src/components/medical/CompareToggle";
import { DiseaseProgressSlider } from "@/src/components/medical/DiseaseProgressSlider";
import { useLocale } from "@/src/hooks/useLocale";
import { medicalRepository } from "@/src/services/medicalRepository";
import { usePathologyStore } from "@/src/store/pathologyStore";
import type { AnatomicalStructure, Disease } from "@/src/types/medical";

export function PathologyPanel({ structure }: { structure: AnatomicalStructure }) {
  const { t, localize } = useLocale();
  const selectedDiseaseId = usePathologyStore((state) => state.selectedDiseaseId);
  const selectDisease = usePathologyStore((state) => state.selectDisease);
  const diseases = structure.relatedDiseaseIds
    .map((id) => medicalRepository.getDiseaseById(id))
    .filter((disease): disease is Disease => Boolean(disease));
  const activeDisease = diseases.find((disease) => disease.id === selectedDiseaseId);

  return (
    <div className="medical-content">
      <section className="content-section">
        <h3>{t("medical.associatedConditions")}</h3>
        {diseases.length === 0 ? (
          <p>{t("medical.noConditions")}</p>
        ) : (
          <div className="disease-choice-list">
            {diseases.map((disease) => (
              <button
                key={disease.id}
                type="button"
                className={
                  selectedDiseaseId === disease.id
                    ? "disease-choice disease-choice--active"
                    : "disease-choice"
                }
                onClick={() => selectDisease(selectedDiseaseId === disease.id ? null : disease.id)}
              >
                <span>
                  <strong>{localize(disease.name)}</strong>
                  <small>{localize(disease.summary)}</small>
                </span>
                <i />
              </button>
            ))}
          </div>
        )}
      </section>
      {activeDisease && (
        <>
          <DiseaseProgressSlider disease={activeDisease} />
          <CompareToggle />
          <section className="content-section">
            <h3>{t("medical.pathogenesis")}</h3>
            <p>{localize(activeDisease.pathogenesis)}</p>
            <Link className="disease-detail-link" href={`/disease/${activeDisease.id}`}>
              {t("common.viewAll")}
              <ArrowUpRight size={13} />
            </Link>
          </section>
          <p className="clinical-disclaimer">
            <TriangleAlert size={13} />
            {t("medical.visualEducation")}
          </p>
        </>
      )}
    </div>
  );
}
