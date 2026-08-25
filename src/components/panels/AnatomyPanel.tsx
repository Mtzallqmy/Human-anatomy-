"use client";

import { ArrowUpRight, BookOpen, GitBranch, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { BilingualMedicalText } from "@/src/components/medical/BilingualMedicalText";
import { getSystemLearningProfile } from "@/src/data/anatomy/comprehensiveSystems";
import { useLocale } from "@/src/hooks/useLocale";
import { medicalRepository } from "@/src/services/medicalRepository";
import { useViewerStore } from "@/src/store/viewerStore";
import type { AnatomicalStructure } from "@/src/types/medical";

export function AnatomyPanel({ structure }: { structure: AnatomicalStructure }) {
  const { t, locale } = useLocale();
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
  const related = structure.relatedStructureIds.map((id) => medicalRepository.getStructureById(id)).filter((item): item is AnatomicalStructure => Boolean(item));
  const components = structure.childrenIds.map((id) => medicalRepository.getStructureById(id)).filter((item): item is AnatomicalStructure => Boolean(item));
  const parent = structure.parentId ? medicalRepository.getStructureById(structure.parentId) : undefined;

  return (
    <div className="medical-content anatomy-panel-rich">
      <section className="content-section anatomy-overview-card">
        <div className="content-section-title-row"><BookOpen size={16} /><h3>{t("medical.overview")}</h3></div>
        <BilingualMedicalText value={structure.description} />
      </section>

      <section className="content-section">
        <p className="panel-kicker">{label("Structural anatomy", "التشريح البنيوي")}</p>
        <h3>{label("Form, organization & relationships", "الشكل والتنظيم والعلاقات")}</h3>
        <BilingualMedicalText value={structure.anatomy} />
        {profile && <ul className="anatomy-focus-list">{profile.anatomyFocus.map((item) => <li key={item.en}><BilingualMedicalText value={item} compact /></li>)}</ul>}
      </section>

      <section className="content-section">
        <h3>{t("medical.location")}</h3>
        <div className="location-value"><MapPin size={14} /><BilingualMedicalText value={structure.location} compact /></div>
      </section>

      {(parent || components.length > 0) && (
        <section className="content-section">
          <div className="content-section-title-row"><GitBranch size={16} /><h3>{label("Anatomical hierarchy", "التسلسل التشريحي")}</h3></div>
          {parent && <div className="anatomy-parent-link"><span>{label("Part of", "جزء من")}</span><button type="button" onClick={() => openStructure(parent)}><BilingualMedicalText value={parent.name} compact /><ArrowUpRight size={13} /></button></div>}
          {components.length > 0 && <><span className="anatomy-hierarchy-label">{t("medical.components")}</span><div className="related-list">{components.map((item) => <button key={item.id} type="button" onClick={() => openStructure(item)}><span><BilingualMedicalText value={item.name} compact />{item.latinName && <small dir="ltr">{item.latinName}</small>}</span><ArrowUpRight size={13} /></button>)}</div></>}
        </section>
      )}

      {structure.bloodSupply && <section className="content-section"><h3>{t("medical.bloodSupply")}</h3><BilingualMedicalText value={structure.bloodSupply} /></section>}
      {structure.innervation && <section className="content-section"><h3>{t("medical.innervation")}</h3><BilingualMedicalText value={structure.innervation} /></section>}

      {related.length > 0 && <section className="content-section"><h3>{t("medical.related")}</h3><div className="related-list">{related.map((item) => <button key={item.id} type="button" onClick={() => openStructure(item)}><span><BilingualMedicalText value={item.name} compact />{item.latinName && <small dir="ltr">{item.latinName}</small>}</span><ArrowUpRight size={13} /></button>)}</div></section>}
    </div>
  );
}
