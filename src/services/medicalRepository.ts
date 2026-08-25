import { heartStructures } from "@/src/data/anatomy/heartStructures";
import { modelAssets } from "@/src/data/assets/modelAssets";
import { heartDiseases } from "@/src/data/pathology/heartDiseases";
import { scientificReferences } from "@/src/data/references/references";
import { bodySystems } from "@/src/data/systems/systems";
import type { SearchResult } from "@/src/types/medical";

export const medicalRepository = {
  getSystems: () => bodySystems,
  getSystemById: (id: string) => bodySystems.find((system) => system.id === id),
  getSystemBySlug: (slug: string) => bodySystems.find((system) => system.slug === slug),
  getStructures: () => heartStructures,
  getStructureById: (id: string) => heartStructures.find((structure) => structure.id === id),
  getSystemStructures: (systemId: string) =>
    heartStructures.filter((structure) => structure.systemId === systemId),
  getDiseases: () => heartDiseases,
  getDiseaseById: (id: string) => heartDiseases.find((disease) => disease.id === id),
  getStructureDiseases: (structureId: string) =>
    heartDiseases.filter((disease) => disease.affectedStructureIds.includes(structureId)),
  getReferences: () => scientificReferences,
  getReferencesByIds: (ids: string[]) =>
    scientificReferences.filter((reference) => ids.includes(reference.id)),
  getModelAsset: (systemId: string) => modelAssets.find((asset) => asset.systemId === systemId),
  search(query: string): SearchResult[] {
    const normalized = query.trim().toLocaleLowerCase();
    if (normalized.length < 2) return [];

    const matches = (en: string, ar: string) =>
      en.toLocaleLowerCase().includes(normalized) || ar.includes(normalized);
    const structures: SearchResult[] = heartStructures
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
    const diseases: SearchResult[] = heartDiseases
      .filter((item) => matches(item.name.en, item.name.ar))
      .map((item) => ({ id: item.id, name: item.name, type: "disease", href: `/disease/${item.id}` }));
    return [...structures, ...systems, ...diseases].slice(0, 8);
  },
};
