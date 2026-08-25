"use client";

import { useEffect, useRef, useState } from "react";
import { LoadingOverlay } from "@/src/components/ui/LoadingOverlay";
import { useLocale } from "@/src/hooks/useLocale";
import { useContentStore } from "@/src/store/contentStore";
import { usePathologyStore } from "@/src/store/pathologyStore";
import { useUIStore } from "@/src/store/uiStore";
import { useViewerStore } from "@/src/store/viewerStore";
import type { SceneManager } from "@/src/three/core/SceneManager";

export function AtlasViewer() {
  const { t, locale, localize } = useLocale();
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
  const sectionMode = useViewerStore((state) => state.sectionMode);
  const explodedView = useViewerStore((state) => state.explodedView);
  const labelMode = useViewerStore((state) => state.labelMode);
  const quality = useViewerStore((state) => state.qualityMode);
  const bloodFlow = useViewerStore((state) => state.bloodFlowEnabled);
  const visibleSystemIds = useViewerStore((state) => state.visibleSystemIds);
  const systemOpacity = useViewerStore((state) => state.systemOpacity);
  const resetRequest = useViewerStore((state) => state.resetRequest);
  const diseaseId = usePathologyStore((state) => state.selectedDiseaseId);
  const diseaseProgress = usePathologyStore((state) => state.diseaseProgress);
  const comparisonMode = usePathologyStore((state) => state.comparisonMode);
  const selectedSystemId = useViewerStore((state) => state.selectedSystemId);
  const structures = useContentStore((state) => state.structures);
  const diseases = useContentStore((state) => state.diseases);
  const assets = useContentStore((state) => state.assets);
  const meshRegistry = useContentStore((state) => state.meshRegistry);
  const selectedStructure = structures.find((structure) => structure.id === structureId);
  const selectedSystem = useContentStore((state) =>
    state.systems.find((system) => system.id === selectedSystemId),
  );

  useEffect(() => {
    let cancelled = false;
    async function initialize() {
      try {
        setLoading(true);
        setError(false);
        const container = containerRef.current;
        const canvas = canvasRef.current;
        const labelLayer = labelsRef.current;
        const systemId = selectedSystemId;
        const asset = assets.find((item) => item.systemId === systemId);
        if (!container || !canvas || !labelLayer) return;
        if (!asset) return;
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
          structures: structures.filter((structure) => structure.systemId === systemId),
          onSelect(id) {
            if (!structures.find((structure) => structure.id === id)?.parentId) {
              useViewerStore.getState().showAllStructures();
            }
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
        scene.setSystemLayers(state.visibleSystemIds, state.systemOpacity);
        scene.setSectionMode(state.sectionMode);
        scene.setExplodedView(state.explodedView);
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
  }, [assets, meshRegistry, selectedSystemId, structures]);

  useEffect(() => {
    sceneRef.current?.select(structureId);
    sceneRef.current?.setSystemLayers(visibleSystemIds, systemOpacity);
  }, [structureId, systemOpacity, visibleSystemIds]);
  useEffect(() => {
    sceneRef.current?.setVisibility(hiddenIds, isolatedId);
  }, [hiddenIds, isolatedId]);
  useEffect(() => {
    sceneRef.current?.setXrayMode(xray, structureId);
  }, [xray, structureId]);
  useEffect(() => {
    sceneRef.current?.setSectionMode(sectionMode);
  }, [sectionMode]);
  useEffect(() => {
    sceneRef.current?.setExplodedView(explodedView);
  }, [explodedView]);
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
    sceneRef.current?.setSystemLayers(visibleSystemIds, systemOpacity);
  }, [systemOpacity, visibleSystemIds]);
  useEffect(() => {
    if (resetRequest > 0) sceneRef.current?.resetCamera();
  }, [resetRequest]);
  useEffect(() => {
    sceneRef.current?.setDisease(
      diseaseId ? diseases.find((disease) => disease.id === diseaseId) : undefined,
      diseaseProgress,
      comparisonMode,
    );
  }, [comparisonMode, diseaseId, diseaseProgress, diseases]);

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
        <h1>{selectedSystem ? localize(selectedSystem.name) : t("atlas.modelTitle")}</h1>
        <span>{selectedSystem ? localize(selectedSystem.description) : t("atlas.modelSubtitle")}</span>
      </div>
      {selectedStructure && (
        <div className="viewer-selection-badge" aria-live="polite">
          <i />
          <span>{t("common.selected")}</span>
          <strong>{localize(selectedStructure.name)}</strong>
        </div>
      )}
      <p className="viewer-interaction-hint">{t("atlas.rotateHint")}</p>
      <p className="viewer-model-notice">{t("atlas.proceduralNotice")}</p>
    </div>
  );
}
