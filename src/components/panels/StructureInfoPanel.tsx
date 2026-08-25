"use client";

import { ChevronDown, X } from "lucide-react";
import { useEffect } from "react";
import { StructureBreadcrumb } from "@/src/components/medical/StructureBreadcrumb";
import { MedicalTabs } from "@/src/components/medical/MedicalTabs";
import { AnatomyPanel } from "@/src/components/panels/AnatomyPanel";
import { PathologyPanel } from "@/src/components/panels/PathologyPanel";
import { PhysiologyPanel } from "@/src/components/panels/PhysiologyPanel";
import { ReferencesPanel } from "@/src/components/panels/ReferencesPanel";
import { ImagingPanel } from "@/src/features/imaging/ImagingPanel";
import { getImagingStudiesForStructure } from "@/src/data/imaging/imagingStudies";
import { useLocale } from "@/src/hooks/useLocale";
import { useContentStore } from "@/src/store/contentStore";
import { useUIStore } from "@/src/store/uiStore";
import { useViewerStore } from "@/src/store/viewerStore";

export function StructureInfoPanel() {
  const { t, localize } = useLocale();
  const structureId = useViewerStore((state) => state.selectedStructureId);
  const tab = useUIStore((state) => state.activeMedicalTab);
  const setTab = useUIStore((state) => state.setActiveMedicalTab);
  const panelOpen = useUIStore((state) => state.informationPanelOpen);
  const setPanelOpen = useUIStore((state) => state.setInformationPanelOpen);
  const structure = useContentStore((state) => state.structures.find((item) => item.id === structureId));
  const hasImaging = structure ? getImagingStudiesForStructure(structure.id).length > 0 : false;

  useEffect(() => {
    if (tab === "imaging" && !hasImaging) setTab("anatomy");
  }, [hasImaging, setTab, tab]);

  if (!structure)
    return (
      <aside className="structure-panel">
        <p>{t("atlas.selectPrompt")}</p>
        <p>{t("atlas.selectDescription")}</p>
      </aside>
    );

  return (
    <aside className={`structure-panel${panelOpen ? " structure-panel--open" : ""}`}>
      <button
        className="panel-drag-handle"
        type="button"
        aria-label={panelOpen ? t("common.close") : t("atlas.mobileInfo")}
        onClick={() => setPanelOpen(!panelOpen)}
      >
        <i />
      </button>
      <div className="structure-panel-heading">
        <span>{t("atlas.selectedStructure")}</span>
        <button type="button" aria-label={t("common.close")} onClick={() => setPanelOpen(false)}>
          <X size={15} />
        </button>
      </div>
      <StructureBreadcrumb structure={structure} />
      <div className="structure-title">
        <h2>{localize(structure.name)}</h2>
        {structure.latinName && <p>{structure.latinName}</p>}
      </div>
      <button type="button" className="mobile-panel-expand" onClick={() => setPanelOpen(!panelOpen)}>
        {t("atlas.mobileInfo")}
        <ChevronDown size={14} />
      </button>
      <MedicalTabs hasImaging={hasImaging} />
      <div
        id="medical-tab-content"
        className="medical-tab-content"
        role="tabpanel"
        aria-labelledby={`medical-tab-${tab}`}
      >
        {tab === "anatomy" && <AnatomyPanel structure={structure} />}
        {tab === "physiology" && <PhysiologyPanel structure={structure} />}
        {tab === "pathology" && <PathologyPanel structure={structure} />}
        {tab === "imaging" && <ImagingPanel structureId={structure.id} />}
        {tab === "references" && <ReferencesPanel referenceIds={structure.referenceIds} />}
      </div>
    </aside>
  );
}
