import { create } from "zustand";
import type { Locale, MedicalTab } from "@/src/types/medical";

interface UIState {
  language: Locale;
  sidebarOpen: boolean;
  informationPanelOpen: boolean;
  mobileMenuOpen: boolean;
  activeMedicalTab: MedicalTab;
  setLanguage: (language: Locale) => void;
  setSidebarOpen: (open: boolean) => void;
  setInformationPanelOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setActiveMedicalTab: (tab: MedicalTab) => void;
}

export const useUIStore = create<UIState>((set) => ({
  language: "en",
  sidebarOpen: false,
  informationPanelOpen: true,
  mobileMenuOpen: false,
  activeMedicalTab: "anatomy",
  setLanguage: (language) => set({ language }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setInformationPanelOpen: (informationPanelOpen) => set({ informationPanelOpen }),
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
  setActiveMedicalTab: (activeMedicalTab) => set({ activeMedicalTab }),
}));
