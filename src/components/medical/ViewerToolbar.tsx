"use client";

import {
  Crosshair,
  Eye,
  EyeOff,
  Maximize2,
  PanelLeft,
  RotateCcw,
  ScanLine,
  SlidersHorizontal,
  Tag,
  Waves,
} from "lucide-react";
import { useLocale } from "@/src/hooks/useLocale";
import { useUIStore } from "@/src/store/uiStore";
import { useViewerStore } from "@/src/store/viewerStore";
import type { QualityMode } from "@/src/types/medical";

export function ViewerToolbar() {
  const { t } = useLocale();
  const state = useViewerStore();
  const setSidebarOpen = useUIStore((item) => item.setSidebarOpen);
  const setPanelOpen = useUIStore((item) => item.setInformationPanelOpen);
  const qualityModes: QualityMode[] = ["low", "medium", "high"];

  return (
    <div className="viewer-toolbar" aria-label={t("atlas.modelTitle")}>
      <button
        type="button"
        className="toolbar-button toolbar-button--mobile"
        title={t("atlas.mobileSystems")}
        aria-label={t("atlas.mobileSystems")}
        onClick={() => setSidebarOpen(true)}
      >
        <PanelLeft size={16} />
      </button>
      <button
        type="button"
        className="toolbar-button"
        title={t("atlas.reset")}
        aria-label={t("atlas.reset")}
        onClick={state.requestReset}
      >
        <RotateCcw size={15} />
      </button>
      <button
        type="button"
        className={`toolbar-button${state.isolatedStructureId ? " toolbar-button--active" : ""}`}
        title={t("atlas.isolate")}
        aria-label={t("atlas.isolate")}
        onClick={() => state.isolateStructure(state.isolatedStructureId ? null : state.selectedStructureId)}
      >
        <Crosshair size={15} />
      </button>
      <button
        type="button"
        className="toolbar-button"
        title={t("atlas.showAll")}
        aria-label={t("atlas.showAll")}
        onClick={state.showAllStructures}
      >
        <Eye size={15} />
      </button>
      <button
        type="button"
        className="toolbar-button"
        title={t("atlas.hide")}
        aria-label={t("atlas.hide")}
        onClick={() => state.hideStructure(state.selectedStructureId)}
      >
        <EyeOff size={15} />
      </button>
      <i className="toolbar-separator" />
      <button
        type="button"
        className={`toolbar-button${state.xrayMode ? " toolbar-button--active" : ""}`}
        title={t("atlas.xray")}
        aria-label={t("atlas.xray")}
        aria-pressed={state.xrayMode}
        onClick={() => state.setXrayMode(!state.xrayMode)}
      >
        <ScanLine size={15} />
      </button>
      <button
        type="button"
        className={`toolbar-button${state.labelMode !== "off" ? " toolbar-button--active" : ""}`}
        title={t("atlas.labels")}
        aria-label={t("atlas.labels")}
        onClick={() =>
          state.setLabelMode(
            state.labelMode === "off" ? "simple" : state.labelMode === "simple" ? "study" : "off",
          )
        }
      >
        <Tag size={15} />
        {state.labelMode === "study" && <small>1</small>}
      </button>
      <button
        type="button"
        className={`toolbar-button${state.bloodFlowEnabled ? " toolbar-button--active" : ""}`}
        title={t("atlas.flow")}
        aria-label={t("atlas.flow")}
        aria-pressed={state.bloodFlowEnabled}
        onClick={() => state.setBloodFlowEnabled(!state.bloodFlowEnabled)}
      >
        <Waves size={15} />
      </button>
      <i className="toolbar-separator" />
      <button
        type="button"
        className="toolbar-button quality-button"
        title={`${t("atlas.quality")}: ${t(`atlas.${state.qualityMode}`)}`}
        aria-label={t("atlas.quality")}
        onClick={() =>
          state.setQualityMode(
            qualityModes[(qualityModes.indexOf(state.qualityMode) + 1) % qualityModes.length],
          )
        }
      >
        <SlidersHorizontal size={15} />
        <span>{t(`atlas.${state.qualityMode}`)}</span>
      </button>
      <button
        type="button"
        className="toolbar-button toolbar-button--mobile"
        title={t("atlas.mobileInfo")}
        aria-label={t("atlas.mobileInfo")}
        onClick={() => setPanelOpen(true)}
      >
        <Maximize2 size={15} />
      </button>
    </div>
  );
}
