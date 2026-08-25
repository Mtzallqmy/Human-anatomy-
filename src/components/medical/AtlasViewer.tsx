"use client";

import { useEffect, useRef, useState } from "react";
import { LoadingOverlay } from "@/src/components/ui/LoadingOverlay";
import { meshRegistry } from "@/src/data/assets/modelAssets";
import { useLocale } from "@/src/hooks/useLocale";
import { medicalRepository } from "@/src/services/medicalRepository";
import { usePathologyStore } from "@/src/store/pathologyStore";
import { useUIStore } from "@/src/store/uiStore";
import { useViewerStore } from "@/src/store/viewerStore";
import type { SceneManager } from "@/src/three/core/SceneManager";

export function AtlasViewer() {
  const { t, locale } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneManager | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const structureId = useViewerStore((state) => state.selectedStructureId);
  const hiddenIds = useViewerStore((state) => state.hiddenStructureIds);
  const isolatedId = useViewerStore((state) => state.isolatedStructureId);
  const xray = useViewerStore((state) => state.xrayMode);
  const labelMode = useViewerStore((state) => state.labelMode);
  const quality = useViewerStore((state) => state.qualityMode);
  const bloodFlow = useViewerStore((state) => state.bloodFlowEnabled);
  const resetRequest = useViewerStore((state) => state.resetRequest);
  const diseaseId = usePathologyStore((state) => state.selectedDiseaseId);
  const diseaseProgress = usePathologyStore((state) => state.diseaseProgress);
  const comparisonMode = usePathologyStore((state) => state.comparisonMode);

  useEffect(() => {
    let cancelled = false;
    async function initialize() {
      try {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        const labelLayer = labelsRef.current;
        const systemId = useViewerStore.getState().selectedSystemId;
        const asset = medicalRepository.getModelAsset(systemId);
        if (!container || !canvas || !labelLayer || !asset)
          throw new Error("No model asset is registered for the selected system.");
        const context = canvas.getContext("webgl2", {
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
        if (!context) {
          setError(true);
          setLoading(false);
          return;
        }
        const { SceneManager } = await import("@/src/three/core/SceneManager");
        if (cancelled) return;
        const scene = new SceneManager({
          container,
          canvas,
          context,
          labelLayer,
          meshMapping: meshRegistry,
          structures: medicalRepository.getSystemStructures(systemId),
          onSelect(id) {
            useViewerStore.getState().setSelectedStructure(id);
            useUIStore.getState().setInformationPanelOpen(true);
          },
        });
        sceneRef.current = scene;
        await scene.loadModel(asset);
        if (cancelled) {
          scene.dispose();
          return;
        }
        const state = useViewerStore.getState();
        scene.setLabels(state.labelMode, useUIStore.getState().language);
        scene.select(state.selectedStructureId, false);
        scene.setBloodFlow(state.bloodFlowEnabled);
        scene.setQuality(state.qualityMode);
        setLoading(false);
      } catch (reason) {
        console.error("Anatomical viewer initialization failed:", reason);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }
    void initialize();
    return () => {
      cancelled = true;
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.select(structureId);
  }, [structureId]);
  useEffect(() => {
    sceneRef.current?.setVisibility(hiddenIds, isolatedId);
  }, [hiddenIds, isolatedId]);
  useEffect(() => {
    sceneRef.current?.setXrayMode(xray, structureId);
  }, [xray, structureId]);
  useEffect(() => {
    sceneRef.current?.setLabels(labelMode, locale);
  }, [labelMode, locale]);
  useEffect(() => {
    sceneRef.current?.setQuality(quality);
  }, [quality]);
  useEffect(() => {
    sceneRef.current?.setBloodFlow(bloodFlow);
  }, [bloodFlow]);
  useEffect(() => {
    if (resetRequest > 0) sceneRef.current?.resetCamera();
  }, [resetRequest]);
  useEffect(() => {
    sceneRef.current?.setDisease(
      diseaseId ? medicalRepository.getDiseaseById(diseaseId) : undefined,
      diseaseProgress,
      comparisonMode,
    );
  }, [diseaseId, diseaseProgress, comparisonMode]);

  return (
    <div className="atlas-canvas-wrap" ref={containerRef}>
      <canvas ref={canvasRef} className="anatomy-canvas" aria-label={t("atlas.modelTitle")} />
      <div className="anatomy-label-layer" ref={labelsRef} />
      {(loading || error) && <LoadingOverlay error={error} />}
      {comparisonMode && diseaseId && (
        <div className="comparison-indicator">
          <i />
          {t("medical.healthyState")}
        </div>
      )}
      <div className="viewer-model-header">
        <p>{t("atlas.chapter")}</p>
        <h1>{t("atlas.modelTitle")}</h1>
        <span>{t("atlas.modelSubtitle")}</span>
      </div>
      <p className="viewer-interaction-hint">{t("atlas.rotateHint")}</p>
      <p className="viewer-model-notice">{t("atlas.proceduralNotice")}</p>
    </div>
  );
}
