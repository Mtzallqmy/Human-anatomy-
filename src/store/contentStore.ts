import { create } from "zustand";
import { allHumanStructures, expandedDiseases } from "@/src/data/anatomy/humanBodyCatalog";
import { meshRegistry, modelAssets } from "@/src/data/assets/modelAssets";
import { heartDiseases } from "@/src/data/pathology/heartDiseases";
import { scientificReferences } from "@/src/data/references/references";
import { bodySystems } from "@/src/data/systems/systems";
import type {
  AnatomicalStructure,
  BodySystem,
  Disease,
  ModelAsset,
  ScientificReference,
} from "@/src/types/medical";

type DataSource = "local" | "supabase";

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
  setRemoteBundle: (bundle: {
    structures: AnatomicalStructure[];
    diseases: Disease[];
    references: ScientificReference[];
    assets: ModelAsset[];
    meshRegistry: Record<string, string>;
  }) => void;
  useFallback: (message: string) => void;
}

export const useContentStore = create<ContentState>((set) => ({
  searchQuery: "",
  systems: bodySystems,
  structures: allHumanStructures,
  diseases: [...heartDiseases, ...expandedDiseases],
  references: scientificReferences,
  assets: modelAssets,
  meshRegistry: { ...meshRegistry },
  dataSource: "local",
  isLoading: false,
  error: null,
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSystems: (systems) => set({ systems }),
  setLoading: (isLoading) => set({ isLoading }),
  setRemoteBundle: (bundle) => set({ ...bundle, dataSource: "supabase", isLoading: false, error: null }),
  useFallback: (error) =>
    set({
      systems: bodySystems,
      structures: allHumanStructures,
      diseases: [...heartDiseases, ...expandedDiseases],
      references: scientificReferences,
      assets: modelAssets,
      meshRegistry: { ...meshRegistry },
      dataSource: "local",
      isLoading: false,
      error,
    }),
}));
