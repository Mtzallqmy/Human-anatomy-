import { create } from "zustand";
import { allHumanStructures, expandedDiseases } from "@/src/data/anatomy/humanBodyCatalog";
import { supplementalStructures } from "@/src/data/anatomy/comprehensiveSystems";
import { sexSpecificStructures, sexSpecificSystems } from "@/src/data/anatomy/sexSpecificAtlas";
import { meshRegistry, modelAssets } from "@/src/data/assets/modelAssets";
import { comprehensiveDiseases } from "@/src/data/pathology/comprehensiveDiseases";
import { heartDiseases } from "@/src/data/pathology/heartDiseases";
import { scientificReferences } from "@/src/data/references/references";
import { bodySystems } from "@/src/data/systems/systems";
import type { AnatomicalStructure, BodySystem, Disease, ModelAsset, ScientificReference } from "@/src/types/medical";

type DataSource = "local" | "supabase";

const localSystems = [...bodySystems.filter((system) => system.id !== "SYS_REPRODUCTIVE"), ...sexSpecificSystems];
const localStructures = [...allHumanStructures, ...supplementalStructures, ...sexSpecificStructures];
const localDiseases = [...heartDiseases, ...expandedDiseases, ...comprehensiveDiseases];

function mergeById<T extends { id: string }>(primary: T[], fallback: T[]): T[] {
  const merged = new Map(fallback.map((item) => [item.id, item]));
  for (const item of primary) merged.set(item.id, item);
  return [...merged.values()];
}

function mergeSystems(remoteSystems: BodySystem[]): BodySystem[] {
  const remote = new Map(remoteSystems.map((system) => [system.id, system]));
  return localSystems.map((localSystem) => {
    const remoteSystem = remote.get(localSystem.id);
    if (!remoteSystem) return localSystem;
    return {
      ...localSystem,
      ...remoteSystem,
      available: localSystem.available || remoteSystem.available,
      rootStructureIds: remoteSystem.rootStructureIds.length ? remoteSystem.rootStructureIds : localSystem.rootStructureIds,
      organIds: remoteSystem.organIds.length ? remoteSystem.organIds : localSystem.organIds,
    };
  });
}

interface ContentState {
  searchQuery: string;
  systems: BodySystem[];
  structures: AnatomicalStructure[];
  diseases: Disease[];
  references: ScientificReference[];
  assets: ModelAsset[];
  meshRegistry: Record<string, string>;
  dataSource: DataSource;
  isLoading: boolean;
  error: string | null;
  setSearchQuery: (query: string) => void;
  setSystems: (systems: BodySystem[]) => void;
  setLoading: (loading: boolean) => void;
  setRemoteBundle: (bundle: { structures: AnatomicalStructure[]; diseases: Disease[]; references: ScientificReference[]; assets: ModelAsset[]; meshRegistry: Record<string, string> }) => void;
  useFallback: (message: string) => void;
}

export const useContentStore = create<ContentState>((set) => ({
  searchQuery: "",
  systems: localSystems,
  structures: localStructures,
  diseases: localDiseases,
  references: scientificReferences,
  assets: modelAssets,
  meshRegistry: { ...meshRegistry },
  dataSource: "local",
  isLoading: false,
  error: null,
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSystems: (systems) => set({ systems: mergeSystems(systems) }),
  setLoading: (isLoading) => set({ isLoading }),
  setRemoteBundle: (bundle) => set({
    structures: mergeById(bundle.structures, localStructures),
    diseases: mergeById(bundle.diseases, localDiseases),
    references: mergeById(bundle.references, scientificReferences),
    assets: mergeById(bundle.assets, modelAssets),
    meshRegistry: { ...meshRegistry, ...bundle.meshRegistry },
    dataSource: "supabase",
    isLoading: false,
    error: null,
  }),
  useFallback: (error) => set({
    systems: localSystems,
    structures: localStructures,
    diseases: localDiseases,
    references: scientificReferences,
    assets: modelAssets,
    meshRegistry: { ...meshRegistry },
    dataSource: "local",
    isLoading: false,
    error,
  }),
}));
