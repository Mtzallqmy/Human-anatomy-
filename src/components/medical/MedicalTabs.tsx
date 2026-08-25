"use client";

import { useLocale } from "@/src/hooks/useLocale";
import { useUIStore } from "@/src/store/uiStore";
import type { MedicalTab } from "@/src/types/medical";

const tabs: MedicalTab[] = ["anatomy", "physiology", "pathology", "imaging", "references"];

export function MedicalTabs({ hasImaging = false }: { hasImaging?: boolean }) {
  const { t } = useLocale();
  const activeTab = useUIStore((state) => state.activeMedicalTab);
  const setActiveTab = useUIStore((state) => state.setActiveMedicalTab);
  return (
    <div className="medical-tabs" role="tablist">
      {tabs
        .filter((tab) => tab !== "imaging" || hasImaging)
        .map((tab) => (
          <button
            key={tab}
            id={`medical-tab-${tab}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls="medical-tab-content"
            className={activeTab === tab ? "medical-tab medical-tab--active" : "medical-tab"}
            onClick={() => setActiveTab(tab)}
          >
            {t(`medical.${tab}`)}
          </button>
        ))}
    </div>
  );
}
