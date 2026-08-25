"use client";

import { Columns2 } from "lucide-react";
import { useLocale } from "@/src/hooks/useLocale";
import { usePathologyStore } from "@/src/store/pathologyStore";

export function CompareToggle() {
  const { t } = useLocale();
  const comparisonMode = usePathologyStore((state) => state.comparisonMode);
  const setComparisonMode = usePathologyStore((state) => state.setComparisonMode);
  return (
    <button
      type="button"
      className={`compare-toggle${comparisonMode ? " compare-toggle--active" : ""}`}
      aria-pressed={comparisonMode}
      onClick={() => setComparisonMode(!comparisonMode)}
    >
      <Columns2 size={15} />
      <span>{t(comparisonMode ? "medical.compareOn" : "medical.compare")}</span>
      <i className="toggle-track">
        <i />
      </i>
    </button>
  );
}
