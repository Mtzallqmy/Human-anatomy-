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

const AtlasViewer = dynamic(
  () => import("@/src/components/medical/AtlasViewer").then((module) => module.AtlasViewer),
  {
    ssr: false,
    loading: () => <div className="viewer-canvas" aria-label="Loading three-dimensional viewer" />,
  },
);

export function AtlasPage({ initialStructureId }: { initialStructureId?: string }) {
  const setSelectedStructure = useViewerStore((state) => state.setSelectedStructure);
  const setPanelOpen = useUIStore((state) => state.setInformationPanelOpen);
  const structures = useContentStore((state) => state.structures);

  useEffect(() => {
    if (initialStructureId && structures.some((structure) => structure.id === initialStructureId)) {
      setSelectedStructure(initialStructureId);
      setPanelOpen(true);
    }
  }, [initialStructureId, setPanelOpen, setSelectedStructure, structures]);

  return (
    <div className="atlas-page">
      <MedicalContentBootstrap />
      <AppHeader atlas />
      <main className="atlas-layout">
        <SystemSidebar />
        <section className="viewer-region">
          <AtlasViewer />
          <ViewerToolbar />
        </section>
        <StructureInfoPanel />
      </main>
    </div>
  );
}
