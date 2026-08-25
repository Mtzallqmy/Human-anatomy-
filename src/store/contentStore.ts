import { create } from "zustand";

interface ContentState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useContentStore = create<ContentState>((set) => ({
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
