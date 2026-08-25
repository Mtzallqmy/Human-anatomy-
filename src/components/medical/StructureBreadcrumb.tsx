"use client";

import { ChevronRight } from "lucide-react";
import { useLocale } from "@/src/hooks/useLocale";
import { useViewerStore } from "@/src/store/viewerStore";
import type { AnatomicalStructure } from "@/src/types/medical";
import { medicalRepository } from "@/src/services/medicalRepository";

export function StructureBreadcrumb({ structure }: { structure: AnatomicalStructure }) {
  const { localize, isRTL } = useLocale();
  const selectStructure = useViewerStore((state) => state.setSelectedStructure);
  const chain: AnatomicalStructure[] = [];
  let current: AnatomicalStructure | undefined = structure;
  while (current) {
    chain.unshift(current);
    current = current.parentId ? medicalRepository.getStructureById(current.parentId) : undefined;
  }
  return (
    <div className="structure-breadcrumb">
      {chain.map((item, index) => (
        <span key={item.id} className="breadcrumb-segment">
          {index < chain.length - 1 ? (
            <button type="button" onClick={() => selectStructure(item.id)}>
              {localize(item.name)}
            </button>
          ) : (
            <span>{localize(item.name)}</span>
          )}
          {index < chain.length - 1 && <ChevronRight size={12} className={isRTL ? "rtl-flip" : ""} />}
        </span>
      ))}
    </div>
  );
}
