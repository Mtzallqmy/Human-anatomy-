"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import { useLocale } from "@/src/hooks/useLocale";
import { medicalRepository } from "@/src/services/medicalRepository";
import { useViewerStore } from "@/src/store/viewerStore";
import type { AnatomicalStructure } from "@/src/types/medical";

export function AnatomyPanel({ structure }: { structure: AnatomicalStructure }) {
  const { t, localize } = useLocale();
  const setSelectedStructure = useViewerStore((state) => state.setSelectedStructure);
  const related = structure.relatedStructureIds
    .map((id) => medicalRepository.getStructureById(id))
    .filter((item): item is AnatomicalStructure => Boolean(item));
  const components = structure.childrenIds
    .map((id) => medicalRepository.getStructureById(id))
    .filter((item): item is AnatomicalStructure => Boolean(item))
    .slice(0, 6);

  return (
    <div className="medical-content">
      <section className="content-section">
        <h3>{t("medical.overview")}</h3>
        <p>{localize(structure.anatomy)}</p>
      </section>
      <section className="content-section">
        <h3>{t("medical.location")}</h3>
        <p className="location-value">
          <MapPin size={14} />
          {localize(structure.location)}
        </p>
      </section>
      {structure.bloodSupply && (
        <section className="content-section">
          <h3>{t("medical.bloodSupply")}</h3>
          <p>{localize(structure.bloodSupply)}</p>
        </section>
      )}
      {structure.innervation && (
        <section className="content-section">
          <h3>{t("medical.innervation")}</h3>
          <p>{localize(structure.innervation)}</p>
        </section>
      )}
      {components.length > 0 && (
        <section className="content-section">
          <h3>{t("medical.components")}</h3>
          <div className="related-list">
            {components.map((item) => (
              <button key={item.id} type="button" onClick={() => setSelectedStructure(item.id)}>
                {localize(item.name)}
                <ArrowUpRight size={13} />
              </button>
            ))}
          </div>
        </section>
      )}
      {related.length > 0 && (
        <section className="content-section">
          <h3>{t("medical.related")}</h3>
          <div className="related-list">
            {related.map((item) => (
              <button key={item.id} type="button" onClick={() => setSelectedStructure(item.id)}>
                {localize(item.name)}
                <ArrowUpRight size={13} />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
