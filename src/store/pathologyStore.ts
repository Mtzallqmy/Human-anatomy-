import { create } from "zustand";

interface PathologyState {
  selectedDiseaseId: string | null;
  selectedDiseaseStage: string;
  diseaseProgress: number;
  comparisonMode: boolean;
  selectDisease: (id: string | null) => void;
  setDiseaseProgress: (progress: number) => void;
  setComparisonMode: (enabled: boolean) => void;
  resetPathology: () => void;
}

export const usePathologyStore = create<PathologyState>((set) => ({
  selectedDiseaseId: null,
  selectedDiseaseStage: "healthy",
  diseaseProgress: 0,
  comparisonMode: false,
  selectDisease: (selectedDiseaseId) =>
    set({
      selectedDiseaseId,
      diseaseProgress: selectedDiseaseId ? 0.35 : 0,
      selectedDiseaseStage: selectedDiseaseId ? "early" : "healthy",
    }),
  setDiseaseProgress: (value) => {
    const diseaseProgress = Math.max(0, Math.min(1, value));
    const selectedDiseaseStage =
      diseaseProgress < 0.12
        ? "healthy"
        : diseaseProgress < 0.43
          ? "early"
          : diseaseProgress < 0.76
            ? "moderate"
            : "advanced";
    set({ diseaseProgress, selectedDiseaseStage });
  },
  setComparisonMode: (comparisonMode) => set({ comparisonMode }),
  resetPathology: () =>
    set({
      selectedDiseaseId: null,
      selectedDiseaseStage: "healthy",
      diseaseProgress: 0,
      comparisonMode: false,
    }),
}));
