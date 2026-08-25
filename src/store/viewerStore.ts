import { create } from "zustand";
import type { LabelMode, QualityMode } from "@/src/types/medical";

interface ViewerState {
  selectedStructureId: string;
  selectedSystemId: string;
  hiddenStructureIds: string[];
  isolatedStructureId: string | null;
  xrayMode: boolean;
  sectionMode: boolean;
  explodedView: boolean;
  labelMode: LabelMode;
  qualityMode: QualityMode;
  bloodFlowEnabled: boolean;
  visibleSystemIds: string[];
  systemOpacity: Record<string, number>;
  resetRequest: number;
  setSelectedStructure: (id: string) => void;
  setSelectedSystem: (id: string, rootStructureId?: string) => void;
  toggleSystemLayer: (id: string) => void;
  setSystemOpacity: (id: string, opacity: number) => void;
  hideStructure: (id: string) => void;
  showStructure: (id: string) => void;
  isolateStructure: (id: string | null) => void;
  showAllStructures: () => void;
  setXrayMode: (enabled: boolean) => void;
  setSectionMode: (enabled: boolean) => void;
  setExplodedView: (enabled: boolean) => void;
  setLabelMode: (mode: LabelMode) => void;
  setQualityMode: (mode: QualityMode) => void;
  setBloodFlowEnabled: (enabled: boolean) => void;
  requestReset: () => void;
}

export const useViewerStore = create<ViewerState>((set) => ({
  selectedStructureId: "ANAT_HEART",
  selectedSystemId: "SYS_CARDIOVASCULAR",
  hiddenStructureIds: [],
  isolatedStructureId: null,
  xrayMode: false,
  sectionMode: false,
  explodedView: false,
  labelMode: "simple",
  qualityMode: "high",
  bloodFlowEnabled: false,
  visibleSystemIds: [
    "SYS_CARDIOVASCULAR",
    "SYS_RESPIRATORY",
    "SYS_DIGESTIVE",
    "SYS_URINARY",
    "SYS_NERVOUS",
    "SYS_MUSCULOSKELETAL",
  ],
  systemOpacity: {},
  resetRequest: 0,
  setSelectedStructure: (selectedStructureId) =>
    set((state) => ({
      selectedStructureId,
      hiddenStructureIds: state.hiddenStructureIds.filter((item) => item !== selectedStructureId),
      isolatedStructureId: null,
    })),
  setSelectedSystem: (selectedSystemId, rootStructureId) =>
    set((state) => ({
      selectedSystemId,
      selectedStructureId: rootStructureId ?? state.selectedStructureId,
      hiddenStructureIds: [],
      isolatedStructureId: null,
      xrayMode: false,
      sectionMode: false,
      explodedView: false,
      bloodFlowEnabled: false,
    })),
  toggleSystemLayer: (id) =>
    set((state) => ({
      visibleSystemIds: state.visibleSystemIds.includes(id)
        ? state.visibleSystemIds.filter((item) => item !== id)
        : [...state.visibleSystemIds, id],
    })),
  setSystemOpacity: (id, opacity) =>
    set((state) => ({ systemOpacity: { ...state.systemOpacity, [id]: opacity } })),
  hideStructure: (id) =>
    set((state) => ({ hiddenStructureIds: [...new Set([...state.hiddenStructureIds, id])] })),
  showStructure: (id) =>
    set((state) => ({ hiddenStructureIds: state.hiddenStructureIds.filter((item) => item !== id) })),
  isolateStructure: (isolatedStructureId) => set({ isolatedStructureId }),
  showAllStructures: () => set({ hiddenStructureIds: [], isolatedStructureId: null }),
  setXrayMode: (xrayMode) => set({ xrayMode }),
  setSectionMode: (sectionMode) => set({ sectionMode }),
  setExplodedView: (explodedView) => set({ explodedView }),
  setLabelMode: (labelMode) => set({ labelMode }),
  setQualityMode: (qualityMode) => set({ qualityMode }),
  setBloodFlowEnabled: (bloodFlowEnabled) => set({ bloodFlowEnabled }),
  requestReset: () =>
    set((state) => ({
      resetRequest: state.resetRequest + 1,
      hiddenStructureIds: [],
      isolatedStructureId: null,
      xrayMode: false,
      sectionMode: false,
      explodedView: false,
    })),
}));
