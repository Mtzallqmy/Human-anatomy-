"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Network } from "lucide-react";
import { AppHeader } from "@/src/components/navigation/AppHeader";
import { MedicalContentBootstrap } from "@/src/features/anatomy/MedicalContentBootstrap";
import { useLocale } from "@/src/hooks/useLocale";
import { useContentStore } from "@/src/store/contentStore";
import { useViewerStore } from "@/src/store/viewerStore";

export function SystemPage({ systemId }: { systemId: string }) {
  const { localize, t } = useLocale();
  const systems = useContentStore((state) => state.systems);
  const structures = useContentStore((state) => state.structures).filter(
    (item) => item.systemId === systemId,
  );
  const diseases = useContentStore((state) => state.diseases).filter((disease) =>
    disease.affectedStructureIds.some((id) => structures.some((item) => item.id === id)),
  );
  const setSystem = useViewerStore((state) => state.setSelectedSystem);
  const system = systems.find((item) => item.id === systemId);

  useEffect(() => {
    setSystem(systemId, system?.rootStructureIds[0]);
  }, [setSystem, system?.rootStructureIds, systemId]);

  if (!system) return null;
  return (
    <div className="editorial-page">
      <MedicalContentBootstrap />
      <AppHeader />
      <main className="editorial-main">
        <section className="editorial-hero">
          <p className="eyebrow">
            <span className="status-dot" /> Multi-system atlas
          </p>
          <h1>{localize(system.name)}</h1>
          <p className="editorial-intro">{localize(system.description)}</p>
          <Link href={`/atlas/${system.slug}`} className="primary-link">
            {t("systemPage.explore")} <ArrowUpRight size={16} />
          </Link>
        </section>
        <div className="system-metrics">
          <div>
            <strong>{structures.length}</strong>
            <span>{t("systemPage.anatomyCount")}</span>
          </div>
          <div>
            <strong>{diseases.length}</strong>
            <span>{t("systemPage.diseaseCount")}</span>
          </div>
          <div>
            <strong>3D</strong>
            <span>{t("common.interactive")}</span>
          </div>
        </div>
        <section className="organ-feature">
          <div>
            <p className="eyebrow">{t("systemPage.organLabel")}</p>
            <Network size={66} strokeWidth={0.9} className="organ-feature-icon" />
            <h2>{localize(system.name)}</h2>
            <p>{localize(system.description)}</p>
          </div>
        </section>
        <section className="disease-module-section">
          <div className="editorial-section-heading">
            <h2>{t("systemPage.conditions")}</h2>
            <span>{diseases.length}</span>
          </div>
          <div className="disease-module-grid">
            {diseases.map((disease, index) => (
              <Link key={disease.id} href={`/disease/${disease.id}`} className="disease-module-card">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{localize(disease.name)}</h3>
                <p>{localize(disease.summary)}</p>
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
