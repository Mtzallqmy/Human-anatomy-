"use client";

import { useEffect, type CSSProperties } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Gauge,
  MapPin,
  Network,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { AppHeader } from "@/src/components/navigation/AppHeader";
import { BilingualMedicalText } from "@/src/components/medical/BilingualMedicalText";
import { getSystemLearningProfile } from "@/src/data/anatomy/comprehensiveSystems";
import { getSexSpecificLearningProfile } from "@/src/data/anatomy/sexSpecificLearningProfiles";
import { MedicalContentBootstrap } from "@/src/features/anatomy/MedicalContentBootstrap";
import { useLocale } from "@/src/hooks/useLocale";
import { useContentStore } from "@/src/store/contentStore";
import { useViewerStore } from "@/src/store/viewerStore";

export function SystemPage({ systemId }: { systemId: string }) {
  const { localize, t, locale } = useLocale();
  const systems = useContentStore((state) => state.systems);
  const structures = useContentStore((state) => state.structures).filter(
    (item) => item.systemId === systemId,
  );
  const diseases = useContentStore((state) => state.diseases).filter((disease) =>
    disease.affectedStructureIds.some((id) => structures.some((item) => item.id === id)),
  );
  const setSystem = useViewerStore((state) => state.setSelectedSystem);
  const system = systems.find((item) => item.id === systemId);
  const profile = getSystemLearningProfile(systemId) ?? getSexSpecificLearningProfile(systemId);
  const label = (en: string, ar: string) => (locale === "ar" ? ar : en);
  const detailedStructures = structures.filter((structure) => structure.parentId);

  useEffect(() => {
    setSystem(systemId, system?.rootStructureIds[0]);
  }, [setSystem, system?.rootStructureIds, systemId]);

  if (!system) return null;
  return (
    <div className="editorial-page system-learning-page">
      <MedicalContentBootstrap />
      <AppHeader />
      <main className="editorial-main system-learning-main">
        <section className="editorial-hero system-learning-hero">
          <div>
            <p className="eyebrow">
              <span className="status-dot" /> {label("Integrated body-system curriculum", "منهج متكامل لأجهزة الجسم")}
            </p>
            <h1>{localize(system.name)}</h1>
            <div className="editorial-intro">{profile ? <BilingualMedicalText value={profile.overview} /> : <BilingualMedicalText value={system.description} />}</div>
            <div className="system-hero-actions">
              <Link href={`/atlas/${system.slug}`} className="primary-link">
                {t("systemPage.explore")} <ArrowUpRight size={16} />
              </Link>
              <a href="#anatomy" className="secondary-link">
                {label("Start the chapter", "ابدأ الفصل")}
              </a>
            </div>
          </div>
          <div className="system-hero-mark" aria-hidden="true" style={{ "--system-accent": system.accentColor } as CSSProperties}>
            <Network size={92} strokeWidth={0.8} />
            <span>{String(detailedStructures.length).padStart(2, "0")}</span>
          </div>
        </section>

        <div className="system-metrics system-metrics-expanded">
          <div><strong>{detailedStructures.length}</strong><span>{t("systemPage.anatomyCount")}</span></div>
          <div><strong>{profile?.physiologyFocus.length ?? 0}</strong><span>{label("Core physiology topics", "موضوعات فسيولوجية أساسية")}</span></div>
          <div><strong>{profile?.mechanisms.length ?? 0}</strong><span>{label("Mechanisms explained", "آليات مشروحة")}</span></div>
          <div><strong>{diseases.length}</strong><span>{t("systemPage.diseaseCount")}</span></div>
        </div>

        <nav className="system-learning-nav" aria-label={label("Chapter navigation", "تنقل الفصل")}>
          <a href="#anatomy"><BookOpen size={15} /> {label("Anatomy", "التشريح")}</a>
          <a href="#physiology"><Activity size={15} /> {label("Physiology", "الفسيولوجيا")}</a>
          <a href="#mechanisms"><Sparkles size={15} /> {label("Mechanisms", "الآليات")}</a>
          <a href="#clinical"><Stethoscope size={15} /> {label("Clinical links", "الربط السريري")}</a>
        </nav>

        {profile && (
          <section className="system-learning-snapshot">
            <div className="editorial-section-heading"><div><p className="eyebrow">{label("Chapter map", "خريطة الفصل")}</p><h2>{label("What you will master", "ما الذي ستتقنه؟")}</h2></div></div>
            <div className="system-curriculum-grid">
              <article><BookOpen size={20} /><h3>{label("Anatomy focus", "محاور التشريح")}</h3><ul>{profile.anatomyFocus.map((item) => <li key={item.en}><BilingualMedicalText value={item} compact /></li>)}</ul></article>
              <article><Activity size={20} /><h3>{label("Physiology focus", "محاور الفسيولوجيا")}</h3><ul>{profile.physiologyFocus.map((item) => <li key={item.en}><BilingualMedicalText value={item} compact /></li>)}</ul></article>
              <article><Gauge size={20} /><h3>{label("Control & regulation", "التحكم والتنظيم")}</h3><ul>{profile.regulation.map((item) => <li key={item.en}><BilingualMedicalText value={item} compact /></li>)}</ul></article>
            </div>
          </section>
        )}

        <section className="system-anatomy-section" id="anatomy">
          <div className="editorial-section-heading"><div><p className="eyebrow">{label("Regional → structural", "من المنطقة إلى التركيب")}</p><h2>{label("Anatomy, structure by structure", "التشريح، تركيبًا بعد تركيب")}</h2></div><span>{detailedStructures.length}</span></div>
          <div className="anatomy-card-grid">
            {detailedStructures.map((structure, index) => (
              <Link key={structure.id} href={`/atlas/structure/${structure.id}`} className="anatomy-learning-card">
                <div className="anatomy-card-topline"><span>{String(index + 1).padStart(2, "0")}</span><ArrowUpRight size={15} /></div>
                <h3><BilingualMedicalText value={structure.name} compact /></h3>
                {structure.latinName && <small dir="ltr">{structure.latinName}</small>}
                <BilingualMedicalText value={structure.anatomy} />
                <div className="anatomy-location"><MapPin size={13} /><BilingualMedicalText value={structure.location} compact /></div>
              </Link>
            ))}
          </div>
        </section>

        {profile && (
          <section className="physiology-deep-dive" id="physiology">
            <div className="editorial-section-heading"><div><p className="eyebrow">{label("Function → mechanism → regulation", "الوظيفة ← الآلية ← التنظيم")}</p><h2>{label("Physiology in depth", "الفسيولوجيا بتفصيل أعمق")}</h2></div></div>
            <div className="physiology-deep-grid" id="mechanisms">
              <div className="mechanism-grid">
                {profile.mechanisms.map((mechanism, index) => (
                  <article className="mechanism-card" key={mechanism.title.en}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3><BilingualMedicalText value={mechanism.title} compact /></h3>
                    <BilingualMedicalText value={mechanism.description} />
                  </article>
                ))}
              </div>
              <aside className="physiology-values-panel">
                <p className="eyebrow">{label("Useful reference values", "قيم مرجعية مفيدة")}</p>
                {profile.keyValues.map((item) => (
                  <div className="system-key-value" key={item.label.en}>
                    <BilingualMedicalText value={item.label} compact />
                    <strong dir="ltr">{item.value}</strong>
                    <BilingualMedicalText value={item.note} compact />
                  </div>
                ))}
              </aside>
            </div>
            <Link href={`/atlas/${system.slug}`} className="system-atlas-callout">
              <span><Activity size={18} /><strong>{label("See the physiology inside the 3D atlas", "شاهد الفسيولوجيا داخل الأطلس ثلاثي الأبعاد")}</strong><small>{label("Select structures, follow pathways and switch between anatomy, physiology, pathology and imaging.", "حدد التراكيب وتتبع المسارات وانتقل بين التشريح والفسيولوجيا والمرض والتصوير.")}</small></span><ArrowUpRight size={18} />
            </Link>
          </section>
        )}

        {profile && (
          <section className="clinical-integration-section" id="clinical">
            <div className="editorial-section-heading"><div><p className="eyebrow">{label("Clinical integration", "الربط السريري")}</p><h2>{label("From normal function to disease", "من الوظيفة الطبيعية إلى المرض")}</h2></div></div>
            <div className="clinical-link-grid">{profile.clinicalLinks.map((item, index) => <article key={item.en}><span>{String(index + 1).padStart(2, "0")}</span><BilingualMedicalText value={item} /></article>)}</div>
          </section>
        )}

        <section className="disease-module-section">
          <div className="editorial-section-heading"><h2>{t("systemPage.conditions")}</h2><span>{diseases.length}</span></div>
          {diseases.length ? (
            <div className="disease-module-grid">
              {diseases.map((disease, index) => (
                <Link key={disease.id} href={`/disease/${disease.id}`} className="disease-module-card">
                  <span>{String(index + 1).padStart(2, "0")}</span><h3>{localize(disease.name)}</h3><p>{localize(disease.summary)}</p><ArrowUpRight size={16} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="system-empty-clinical"><Stethoscope size={22} /><div><strong>{label("Pathology module ready for expansion", "وحدة الأمراض جاهزة للتوسع")}</strong><p>{label("This chapter currently prioritizes normal anatomy and physiology. Disease cases can be added through the existing review workflow without redesigning the page.", "يركز هذا الفصل حاليًا على التشريح والفسيولوجيا الطبيعيين، ويمكن إضافة الحالات المرضية عبر مسار المراجعة الحالي دون إعادة تصميم الصفحة.")}</p></div></div>
          )}
        </section>
      </main>
    </div>
  );
}
