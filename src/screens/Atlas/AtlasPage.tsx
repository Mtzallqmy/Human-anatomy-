"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { ViewerToolbar } from "@/src/components/medical/ViewerToolbar";
import { AppHeader } from "@/src/components/navigation/AppHeader";
import { StructureInfoPanel } from "@/src/components/panels/StructureInfoPanel";
import { SystemSidebar } from "@/src/components/panels/SystemSidebar";
import { MedicalContentBootstrap } from "@/src/features/anatomy/MedicalContentBootstrap";
import { useContentStore } from "@/src/store/contentStore";
import { useUIStore } from "@/src/store/uiStore";
import { useViewerStore } from "@/src/store/viewerStore";
import { AppErrorBoundary } from "@/src/components/ui/AppErrorBoundary";
import { useLocale } from "@/src/hooks/useLocale";

const AtlasViewer = dynamic(
  () => import("@/src/components/medical/AtlasViewer").then((module) => module.AtlasViewer),
  {
    ssr: false,
    loading: () => <div className="viewer-canvas" aria-label="Loading three-dimensional viewer" />,
  },
);

export function AtlasPage({
  initialStructureId,
  initialSystemId,
}: {
  initialStructureId?: string;
  initialSystemId?: string;
}) {
  const setSelectedStructure = useViewerStore((state) => state.setSelectedStructure);
  const setSelectedSystem = useViewerStore((state) => state.setSelectedSystem);
  const setPanelOpen = useUIStore((state) => state.setInformationPanelOpen);
  const structures = useContentStore((state) => state.structures);
  const { t } = useLocale();

  useEffect(() => {
    const structure = initialStructureId
      ? structures.find((item) => item.id === initialStructureId)
      : undefined;
    if (structure) {
      setSelectedSystem(structure.systemId, structure.id);
      setSelectedStructure(structure.id);
      setPanelOpen(true);
    } else if (initialSystemId) {
      const root = structures.find((item) => item.systemId === initialSystemId && !item.parentId);
      setSelectedSystem(initialSystemId, root?.id);
    }
  }, [
    initialStructureId,
    initialSystemId,
    setPanelOpen,
    setSelectedStructure,
    setSelectedSystem,
    structures,
  ]);

  return (
    <div className="atlas-page">
      <MedicalContentBootstrap />
      <AppHeader atlas />
      <main className="atlas-layout">
        <SystemSidebar />
        <section className="viewer-region">
          <AppErrorBoundary
            title={t("common.error")}
            message={t("atlas.modelError")}
            retryLabel={t("common.retry")}
          >
            <AtlasViewer />
          </AppErrorBoundary>
          <ViewerToolbar />
        </section>
        <StructureInfoPanel />
      </main>
    </div>
  );
}
