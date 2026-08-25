import { create } from "zustand";
import type { LabelMode, QualityMode } from "@/src/types/medical";

interface ViewerState {
  selectedStructureId: string;
  selectedSystemId: string;
  hiddenStructureIds: string[];
  isolatedStructureId: string | null;
  xrayMode: boolean;
  labelMode: LabelMode;
  qualityMode: QualityMode;
  bloodFlowEnabled: boolean;
  resetRequest: number;
  setSelectedStructure: (id: string) => void;
  setSelectedSystem: (id: string) => void;
  hideStructure: (id: string) => void;
  showStructure: (id: string) => void;
  isolateStructure: (id: string | null) => void;
  showAllStructures: () => void;
  setXrayMode: (enabled: boolean) => void;
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
  labelMode: "simple",
  qualityMode: "high",
  bloodFlowEnabled: false,
  resetRequest: 0,
  setSelectedStructure: (selectedStructureId) =>
    set((state) => ({
      selectedStructureId,
      hiddenStructureIds: state.hiddenStructureIds.filter((item) => item !== selectedStructureId),
      isolatedStructureId: null,
    })),
  setSelectedSystem: (selectedSystemId) => set({ selectedSystemId }),
  hideStructure: (id) =>
    set((state) => ({ hiddenStructureIds: [...new Set([...state.hiddenStructureIds, id])] })),
  showStructure: (id) =>
    set((state) => ({ hiddenStructureIds: state.hiddenStructureIds.filter((item) => item !== id) })),
  isolateStructure: (isolatedStructureId) => set({ isolatedStructureId }),
  showAllStructures: () => set({ hiddenStructureIds: [], isolatedStructureId: null }),
  setXrayMode: (xrayMode) => set({ xrayMode }),
  setLabelMode: (labelMode) => set({ labelMode }),
  setQualityMode: (qualityMode) => set({ qualityMode }),
  setBloodFlowEnabled: (bloodFlowEnabled) => set({ bloodFlowEnabled }),
  requestReset: () =>
    set((state) => ({
      resetRequest: state.resetRequest + 1,
      hiddenStructureIds: [],
      isolatedStructureId: null,
      xrayMode: false,
    })),
}));
