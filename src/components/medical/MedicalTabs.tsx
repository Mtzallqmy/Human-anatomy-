"use client";

import { useLocale } from "@/src/hooks/useLocale";
import { useUIStore } from "@/src/store/uiStore";
import type { MedicalTab } from "@/src/types/medical";

const tabs: MedicalTab[] = ["anatomy", "physiology", "pathology", "references"];

export function MedicalTabs() {
  const { t } = useLocale();
  const activeTab = useUIStore((state) => state.activeMedicalTab);
  const setActiveTab = useUIStore((state) => state.setActiveMedicalTab);
  return (
    <div className="medical-tabs" role="tablist">
      {tabs.map((tab) => (
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
