"use client";

import { useEffect } from "react";
import { AtlasViewer } from "@/src/components/medical/AtlasViewer";
import { ViewerToolbar } from "@/src/components/medical/ViewerToolbar";
import { AppHeader } from "@/src/components/navigation/AppHeader";
import { StructureInfoPanel } from "@/src/components/panels/StructureInfoPanel";
import { SystemSidebar } from "@/src/components/panels/SystemSidebar";
import { medicalRepository } from "@/src/services/medicalRepository";
import { useUIStore } from "@/src/store/uiStore";
import { useViewerStore } from "@/src/store/viewerStore";

export function AtlasPage({ initialStructureId }: { initialStructureId?: string }) {
  const setSelectedStructure = useViewerStore((state) => state.setSelectedStructure);
  const setPanelOpen = useUIStore((state) => state.setInformationPanelOpen);

  useEffect(() => {
    if (initialStructureId && medicalRepository.getStructureById(initialStructureId)) {
      setSelectedStructure(initialStructureId);
      setPanelOpen(true);
    }
  }, [initialStructureId, setPanelOpen, setSelectedStructure]);

  return (
    <div className="atlas-page">
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
