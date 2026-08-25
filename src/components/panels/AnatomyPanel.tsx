"use client";

import { ArrowUpRight, BookOpen, GitBranch, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSystemLearningProfile } from "@/src/data/anatomy/comprehensiveSystems";
import { useLocale } from "@/src/hooks/useLocale";
import { medicalRepository } from "@/src/services/medicalRepository";
import { useViewerStore } from "@/src/store/viewerStore";
import type { AnatomicalStructure } from "@/src/types/medical";

export function AnatomyPanel({ structure }: { structure: AnatomicalStructure }) {
  const { t, localize, locale } = useLocale();
  const setSelectedStructure = useViewerStore((state) => state.setSelectedStructure);
  const setSelectedSystem = useViewerStore((state) => state.setSelectedSystem);
  const router = useRouter();
  const label = (en: string, ar: string) => (locale === "ar" ? ar : en);
  const profile = getSystemLearningProfile(structure.systemId);
  const openStructure = (item: AnatomicalStructure) => {
    setSelectedSystem(item.systemId, item.id);
    setSelectedStructure(item.id);
    router.push(`/atlas/structure/${item.id}`);
  };
  const related = structure.relatedStructureIds
    .map((id) => medicalRepository.getStructureById(id))
    .filter((item): item is AnatomicalStructure => Boolean(item));
  const components = structure.childrenIds
    .map((id) => medicalRepository.getStructureById(id))
    .filter((item): item is AnatomicalStructure => Boolean(item));
  const parent = structure.parentId ? medicalRepository.getStructureById(structure.parentId) : undefined;

  return (
    <div className="medical-content anatomy-panel-rich">
      <section className="content-section anatomy-overview-card">
        <div className="content-section-title-row">
          <BookOpen size={16} />
          <h3>{t("medical.overview")}</h3>
        </div>
        <p>{localize(structure.description)}</p>
      </section>

      <section className="content-section">
        <p className="panel-kicker">{label("Structural anatomy", "التشريح البنيوي")}</p>
        <h3>{label("Form, organization & relationships", "الشكل والتنظيم والعلاقات")}</h3>
        <p>{localize(structure.anatomy)}</p>
        {profile && (
          <ul className="anatomy-focus-list">
            {profile.anatomyFocus.map((item) => (
              <li key={item.en}>{localize(item)}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="content-section">
        <h3>{t("medical.location")}</h3>
        <p className="location-value">
          <MapPin size={14} />
          {localize(structure.location)}
        </p>
      </section>

      {(parent || components.length > 0) && (
        <section className="content-section">
          <div className="content-section-title-row">
            <GitBranch size={16} />
            <h3>{label("Anatomical hierarchy", "التسلسل التشريحي")}</h3>
          </div>
          {parent && (
            <div className="anatomy-parent-link">
              <span>{label("Part of", "جزء من")}</span>
              <button type="button" onClick={() => openStructure(parent)}>
                {localize(parent.name)} <ArrowUpRight size={13} />
              </button>
            </div>
          )}
          {components.length > 0 && (
            <>
              <span className="anatomy-hierarchy-label">{t("medical.components")}</span>
              <div className="related-list">
                {components.map((item) => (
                  <button key={item.id} type="button" onClick={() => openStructure(item)}>
                    <span>
                      {localize(item.name)}
                      {item.latinName && <small dir="ltr">{item.latinName}</small>}
                    </span>
                    <ArrowUpRight size={13} />
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      )}

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

      {related.length > 0 && (
        <section className="content-section">
          <h3>{t("medical.related")}</h3>
          <div className="related-list">
            {related.map((item) => (
              <button key={item.id} type="button" onClick={() => openStructure(item)}>
                <span>
                  {localize(item.name)}
                  {item.latinName && <small dir="ltr">{item.latinName}</small>}
                </span>
                <ArrowUpRight size={13} />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
