"use client";

import { ChevronRight } from "lucide-react";
import { useLocale } from "@/src/hooks/useLocale";
import { useContentStore } from "@/src/store/contentStore";
import { useViewerStore } from "@/src/store/viewerStore";
import type { AnatomicalStructure } from "@/src/types/medical";

export function StructureBreadcrumb({ structure }: { structure: AnatomicalStructure }) {
  const { localize, isRTL } = useLocale();
  const selectStructure = useViewerStore((state) => state.setSelectedStructure);
  const parent = useContentStore((state) =>
    structure.parentId ? state.structures.find((item) => item.id === structure.parentId) : undefined,
  );
  if (!parent) return null;
  return (
    <div className="structure-breadcrumb">
      <button type="button" onClick={() => selectStructure(parent.id)}>
        {localize(parent.name)}
      </button>
      <ChevronRight size={12} className={isRTL ? "rtl-flip" : ""} />
      <span>{localize(structure.name)}</span>
    </div>
  );
}
