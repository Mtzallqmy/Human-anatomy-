import {
  allHumanStructures,
  expandedDiseases,
  physiologyAnimations,
} from "@/src/data/anatomy/humanBodyCatalog";
import {
  supplementalPhysiologyAnimations,
  supplementalStructures,
} from "@/src/data/anatomy/comprehensiveSystems";
import { modelAssets } from "@/src/data/assets/modelAssets";
import { heartDiseases } from "@/src/data/pathology/heartDiseases";
import { scientificReferences } from "@/src/data/references/references";
import { bodySystems } from "@/src/data/systems/systems";
import type { SearchResult } from "@/src/types/medical";

const structuresCatalog = [...allHumanStructures, ...supplementalStructures];
const diseasesCatalog = [...heartDiseases, ...expandedDiseases];
const physiologyCatalog = [...physiologyAnimations, ...supplementalPhysiologyAnimations];

export const medicalRepository = {
  getSystems: () => bodySystems,
  getSystemById: (id: string) => bodySystems.find((system) => system.id === id),
  getSystemBySlug: (slug: string) => bodySystems.find((system) => system.slug === slug),
  getStructures: () => structuresCatalog,
  getStructureById: (id: string) => structuresCatalog.find((structure) => structure.id === id),
  getSystemStructures: (systemId: string) =>
    structuresCatalog.filter((structure) => structure.systemId === systemId),
  getDiseases: () => diseasesCatalog,
  getDiseaseById: (id: string) => diseasesCatalog.find((disease) => disease.id === id),
  getStructureDiseases: (structureId: string) =>
    diseasesCatalog.filter((disease) => disease.affectedStructureIds.includes(structureId)),
  getPhysiologyAnimations: (systemId?: string) =>
    systemId ? physiologyCatalog.filter((item) => item.systemId === systemId) : physiologyCatalog,
  getReferences: () => scientificReferences,
  getReferencesByIds: (ids: string[]) =>
    scientificReferences.filter((reference) => ids.includes(reference.id)),
  getModelAsset: (systemId: string) => modelAssets.find((asset) => asset.systemId === systemId),
  search(query: string): SearchResult[] {
    const normalized = query.trim().toLocaleLowerCase();
    if (normalized.length < 2) return [];

    const matches = (en: string, ar: string) =>
      en.toLocaleLowerCase().includes(normalized) || ar.includes(normalized);
    const structures: SearchResult[] = structuresCatalog
      .filter(
        (item) =>
          matches(item.name.en, item.name.ar) || item.latinName?.toLocaleLowerCase().includes(normalized),
      )
      .map((item) => ({
        id: item.id,
        name: item.name,
        type: "structure",
        systemId: item.systemId,
        href: `/atlas/structure/${item.id}`,
      }));
    const systems: SearchResult[] = bodySystems
      .filter((item) => item.available && matches(item.name.en, item.name.ar))
      .map((item) => ({
        id: item.id,
        name: item.name,
        type: "system",
        systemId: item.id,
        href: `/systems/${item.slug}`,
      }));
    const diseases: SearchResult[] = diseasesCatalog
      .filter((item) => matches(item.name.en, item.name.ar))
      .map((item) => ({ id: item.id, name: item.name, type: "disease", href: `/disease/${item.id}` }));
    const physiology: SearchResult[] = physiologyCatalog
      .filter((item) => matches(item.name.en, item.name.ar))
      .map((item) => ({
        id: item.id,
        name: item.name,
        type: "physiology",
        systemId: item.systemId,
        href: `/atlas/${bodySystems.find((system) => system.id === item.systemId)?.slug ?? "human-body"}`,
      }));
    return [...structures, ...systems, ...physiology, ...diseases].slice(0, 12);
  },
};
