"use client";

import { useEffect, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, Link2, ScanLine, Tags, ZoomIn } from "lucide-react";
import { GeneratedMedicalImage } from "@/src/features/imaging/GeneratedMedicalImage";
import { useLocale } from "@/src/hooks/useLocale";
import { useImagingStore } from "@/src/store/imagingStore";
import { useUIStore } from "@/src/store/uiStore";
import { useViewerStore } from "@/src/store/viewerStore";
import type { ImagingSeries, ImagingStudy } from "@/src/types/medical";
import { trackEducationalEvent } from "@/src/services/analytics";

export function MedicalImageViewer({ study, series }: { study: ImagingStudy; series: ImagingSeries }) {
  const { t, localize, isRTL } = useLocale();
  const frameIndex = useImagingStore((state) => state.frameIndex);
  const setFrameIndex = useImagingStore((state) => state.setFrameIndex);
  const windowPreset = useImagingStore((state) => state.windowPreset);
  const setWindowPreset = useImagingStore((state) => state.setWindowPreset);
  const zoom = useImagingStore((state) => state.zoom);
  const setZoom = useImagingStore((state) => state.setZoom);
  const labelsEnabled = useImagingStore((state) => state.labelsEnabled);
  const toggleLabels = useImagingStore((state) => state.toggleLabels);
  const syncWith3D = useImagingStore((state) => state.syncWith3D);
  const toggleSync = useImagingStore((state) => state.toggleSync);
  const stageRef = useRef<HTMLDivElement>(null);
  const frame = series.frames[Math.min(frameIndex, series.frames.length - 1)];
  const annotations = useMemo(
    () => series.annotations.filter((item) => item.frameIndex === frame?.index),
    [frame?.index, series.annotations],
  );

  useEffect(() => {
    for (const nearby of series.frames.filter((item) => Math.abs(item.index - frameIndex) <= 2)) {
      if (nearby.imageUrl) {
        const image = new Image();
        image.src = nearby.imageUrl;
      }
    }
  }, [frameIndex, series.frames]);
  useEffect(() => {
    trackEducationalEvent("frame_changed", { studyId: study.id, seriesId: series.id, frameIndex });
  }, [frameIndex, series.id, study.id]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") setFrameIndex(Math.max(0, frameIndex - 1));
      if (event.key === "ArrowRight") setFrameIndex(Math.min(series.frames.length - 1, frameIndex + 1));
    };
    stage.addEventListener("keydown", onKey);
    return () => stage.removeEventListener("keydown", onKey);
  }, [frameIndex, series.frames.length, setFrameIndex]);

  if (!frame) return <div className="imaging-error">{t("imaging.frameFailed")}</div>;

  return (
    <section className="medical-image-viewer" aria-label={localize(study.title)}>
      <div className="imaging-viewer-toolbar">
        <span className="modality-badge">
          <ScanLine size={14} /> {study.modality}
        </span>
        {study.modality === "CT" && (
          <select
            value={windowPreset}
            onChange={(event) => setWindowPreset(event.target.value as typeof windowPreset)}
            aria-label={t("imaging.windowPreset")}
          >
            <option value="soft-tissue">{t("imaging.softTissue")}</option>
            <option value="lung">{t("imaging.lungWindow")}</option>
            <option value="bone">{t("imaging.boneWindow")}</option>
          </select>
        )}
        <button type="button" className={labelsEnabled ? "is-active" : ""} onClick={toggleLabels}>
          <Tags size={14} /> {t("imaging.annotations")}
        </button>
        <button
          type="button"
          className={syncWith3D ? "is-active" : ""}
          onClick={() => {
            toggleSync();
            if (!syncWith3D) trackEducationalEvent("sync_3d_enabled", { studyId: study.id });
          }}
        >
          <Link2 size={14} /> {t("imaging.sync3d")}
        </button>
      </div>
      <div
        className={`imaging-stage window-${windowPreset}`}
        ref={stageRef}
        tabIndex={0}
        onWheel={(event) => {
          if (series.frames.length < 2) return;
          event.preventDefault();
          setFrameIndex(
            Math.max(0, Math.min(series.frames.length - 1, frameIndex + (event.deltaY > 0 ? 1 : -1))),
          );
        }}
      >
        <div className="imaging-orientation">
          <span>A</span>
          <span>R</span>
          <span>P</span>
          <span>L</span>
        </div>
        <div className="imaging-frame" style={{ transform: `scale(${zoom})` }}>
          {frame.imageUrl ? (
            // Signed private-storage URLs are short-lived and cannot use a stable Next image optimizer key.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={frame.imageUrl} alt={localize(study.title)} />
          ) : (
            <GeneratedMedicalImage frame={frame} />
          )}
          {labelsEnabled &&
            annotations.map((item) => {
              const [x, y] = item.geometry.coordinates[0];
              return (
                <button
                  type="button"
                  key={item.id}
                  className="imaging-annotation"
                  style={{ insetInlineStart: `${x * 100}%`, top: `${y * 100}%`, borderColor: item.color }}
                  aria-label={localize(item.label)}
                  onClick={() => {
                    if (syncWith3D) useViewerStore.getState().setSelectedStructure(item.structureId);
                    useUIStore.getState().setInformationPanelOpen(true);
                    trackEducationalEvent("annotation_clicked", {
                      studyId: study.id,
                      annotationId: item.id,
                      structureId: item.structureId,
                    });
                  }}
                >
                  <i style={{ backgroundColor: item.color }} />
                  <span>{localize(item.label)}</span>
                </button>
              );
            })}
        </div>
      </div>
      <div className="imaging-slice-controls">
        <button
          type="button"
          disabled={frameIndex === 0}
          onClick={() => setFrameIndex(frameIndex - 1)}
          aria-label={t("imaging.previousSlice")}
        >
          {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <input
          type="range"
          min="0"
          max={series.frames.length - 1}
          value={frameIndex}
          onChange={(event) => setFrameIndex(Number(event.target.value))}
          aria-label={t("imaging.sliceNavigation")}
        />
        <strong>
          {frameIndex + 1} / {series.frames.length}
        </strong>
        <button
          type="button"
          disabled={frameIndex === series.frames.length - 1}
          onClick={() => setFrameIndex(frameIndex + 1)}
          aria-label={t("imaging.nextSlice")}
        >
          {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
        <label>
          <ZoomIn size={14} />
          <input
            type="range"
            min="1"
            max="2.5"
            step="0.1"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            aria-label={t("imaging.zoom")}
          />
        </label>
      </div>
    </section>
  );
}
