"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Columns2, ExternalLink, Layers3, ShieldCheck } from "lucide-react";
import { AppHeader } from "@/src/components/navigation/AppHeader";
import { imagingStudies } from "@/src/data/imaging/imagingStudies";
import { MedicalContentBootstrap } from "@/src/features/anatomy/MedicalContentBootstrap";
import { MedicalImageViewer } from "@/src/features/imaging/MedicalImageViewer";
import { supabaseImagingRepository } from "@/src/data-access/imaging/supabaseImagingRepository";
import { isSupabaseConfigured } from "@/src/lib/supabase/client";
import { useLocale } from "@/src/hooks/useLocale";
import { useContentStore } from "@/src/store/contentStore";
import { useImagingStore } from "@/src/store/imagingStore";
import { useViewerStore } from "@/src/store/viewerStore";
import { AppErrorBoundary } from "@/src/components/ui/AppErrorBoundary";
import { trackEducationalEvent } from "@/src/services/analytics";

const AtlasViewer = dynamic(
  () => import("@/src/components/medical/AtlasViewer").then((module) => module.AtlasViewer),
  { ssr: false, loading: () => <div className="imaging-3d-loading" /> },
);

export function ImagingPage({
  studyId,
  seriesId,
  initialFrame,
}: {
  studyId: string;
  seriesId?: string;
  initialFrame?: number;
}) {
  const { t, localize, isRTL } = useLocale();
  const localStudy = imagingStudies.find((item) => item.id === studyId && item.status === "published");
  const studyQuery = useQuery({
    queryKey: ["imaging-study", studyId],
    queryFn: () => supabaseImagingRepository.getStudy(studyId),
    enabled: isSupabaseConfigured(),
    staleTime: 10 * 60 * 1000,
  });
  const study = studyQuery.data ?? localStudy;
  const selectedSeriesId = useImagingStore((state) => state.selectedSeriesId);
  const setStudy = useImagingStore((state) => state.setStudy);
  const setSeries = useImagingStore((state) => state.setSeries);
  const splitView = useImagingStore((state) => state.splitView);
  const toggleSplitView = useImagingStore((state) => state.toggleSplitView);
  const structures = useContentStore((state) => state.structures);
  const references = useContentStore((state) => state.references);
  const setSystem = useViewerStore((state) => state.setSelectedSystem);
  const series = study?.series.find((item) => item.id === selectedSeriesId) ?? study?.series[0];
  const linkedStructures = useMemo(
    () => structures.filter((item) => study?.structureIds.includes(item.id)),
    [structures, study?.structureIds],
  );

  useEffect(() => {
    if (!study) return;
    const targetSeries = study.series.find((item) => item.id === seriesId) ?? study.series[0];
    const frame = Math.max(
      0,
      Math.min(targetSeries.frames.length - 1, initialFrame ?? Math.floor(targetSeries.frames.length / 2)),
    );
    setStudy(study.id, targetSeries.id, frame);
    trackEducationalEvent("study_opened", { studyId: study.id, modality: study.modality });
    const firstStructure = structures.find((item) => study.structureIds.includes(item.id));
    if (firstStructure) {
      setSystem(firstStructure.systemId, firstStructure.id);
      useViewerStore.getState().setSelectedStructure(firstStructure.id);
    }
  }, [initialFrame, seriesId, setStudy, setSystem, structures, study]);

  if (!study || !series) {
    return (
      <div className="imaging-page">
        <AppHeader />
        <main className="imaging-unavailable">
          <h1>{t("imaging.studyUnavailable")}</h1>
          <Link href="/atlas">{t("nav.atlas")}</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="imaging-page">
      <MedicalContentBootstrap />
      <AppHeader />
      <header className="imaging-page-header">
        <div>
          <Link href="/atlas">
            <ArrowLeft size={15} className={isRTL ? "rtl-flip" : ""} /> {t("common.back")}
          </Link>
          <p>
            {study.modality} · {study.bodyRegion}
          </p>
          <h1>{localize(study.title)}</h1>
        </div>
        <button type="button" className={splitView ? "is-active" : ""} onClick={toggleSplitView}>
          <Columns2 size={16} /> {t("imaging.splitView")}
        </button>
      </header>
      <main className={`imaging-layout${splitView ? " imaging-layout--split" : ""}`}>
        <aside className="imaging-study-sidebar">
          <p className="sidebar-title">{t("imaging.series")}</p>
          {study.series.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === series.id ? "is-active" : ""}
              onClick={() => setSeries(item.id)}
            >
              <Layers3 size={15} />
              <span>
                <strong>{localize(item.name)}</strong>
                <small>
                  {item.orientation} · {item.frames.length} {t("imaging.frames")}
                </small>
              </span>
            </button>
          ))}
          <div className="imaging-provenance">
            <ShieldCheck size={17} />
            <strong>{t("imaging.provenance")}</strong>
            <span>{study.source}</span>
            <span>{study.license}</span>
            <span>{study.attribution}</span>
          </div>
        </aside>
        <section className="imaging-center">
          {splitView && (
            <div className="imaging-3d-pane">
              <AtlasViewer />
            </div>
          )}
          <AppErrorBoundary
            title={t("common.error")}
            message={t("imaging.frameFailed")}
            retryLabel={t("common.retry")}
          >
            <MedicalImageViewer study={study} series={series} />
          </AppErrorBoundary>
        </section>
        <aside className="imaging-info-panel">
          <span className="imaging-classification">{study.classification.replaceAll("_", " ")}</span>
          <h2>{t("imaging.educationalModule")}</h2>
          <p>{localize(study.description)}</p>
          <h3>{t("imaging.linkedStructures")}</h3>
          <div className="imaging-linked-list">
            {linkedStructures.map((structure) => (
              <Link
                href={`/atlas/structure/${structure.id}`}
                key={structure.id}
                onClick={() => useViewerStore.getState().setSelectedStructure(structure.id)}
              >
                {localize(structure.name)} <ExternalLink size={12} />
              </Link>
            ))}
          </div>
          <h3>{t("medical.references")}</h3>
          {references
            .filter((item) => study.referenceIds.includes(item.id))
            .map((reference) => (
              <p className="imaging-reference" key={reference.id}>
                {reference.title}
              </p>
            ))}
          <p className="clinical-disclaimer">{t("imaging.educationOnly")}</p>
        </aside>
      </main>
    </div>
  );
}
