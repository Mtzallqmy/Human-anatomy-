import { create } from "zustand";

export type CtWindowPreset = "soft-tissue" | "lung" | "bone";

interface ImagingState {
  selectedStudyId: string | null;
  selectedSeriesId: string | null;
  frameIndex: number;
  windowPreset: CtWindowPreset;
  zoom: number;
  labelsEnabled: boolean;
  syncWith3D: boolean;
  splitView: boolean;
  setStudy: (studyId: string, seriesId: string, initialFrame?: number) => void;
  setSeries: (seriesId: string) => void;
  setFrameIndex: (index: number) => void;
  setWindowPreset: (preset: CtWindowPreset) => void;
  setZoom: (zoom: number) => void;
  toggleLabels: () => void;
  toggleSync: () => void;
  toggleSplitView: () => void;
}

export const useImagingStore = create<ImagingState>((set) => ({
  selectedStudyId: null,
  selectedSeriesId: null,
  frameIndex: 0,
  windowPreset: "soft-tissue",
  zoom: 1,
  labelsEnabled: true,
  syncWith3D: true,
  splitView: false,
  setStudy: (selectedStudyId, selectedSeriesId, frameIndex = 0) =>
    set({ selectedStudyId, selectedSeriesId, frameIndex }),
  setSeries: (selectedSeriesId) => set({ selectedSeriesId, frameIndex: 0 }),
  setFrameIndex: (frameIndex) => set({ frameIndex }),
  setWindowPreset: (windowPreset) => set({ windowPreset }),
  setZoom: (zoom) => set({ zoom }),
  toggleLabels: () => set((state) => ({ labelsEnabled: !state.labelsEnabled })),
  toggleSync: () => set((state) => ({ syncWith3D: !state.syncWith3D })),
  toggleSplitView: () => set((state) => ({ splitView: !state.splitView })),
}));
