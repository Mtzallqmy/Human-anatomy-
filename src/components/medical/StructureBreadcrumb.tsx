"use client";

import { ChevronRight } from "lucide-react";
import { useLocale } from "@/src/hooks/useLocale";
import { medicalRepository } from "@/src/services/medicalRepository";
import { useViewerStore } from "@/src/store/viewerStore";
import type { AnatomicalStructure } from "@/src/types/medical";

export function StructureBreadcrumb({ structure }: { structure: AnatomicalStructure }) {
  const { localize, isRTL } = useLocale();
  const selectStructure = useViewerStore((state) => state.setSelectedStructure);
  const parent = structure.parentId ? medicalRepository.getStructureById(structure.parentId) : undefined;
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
