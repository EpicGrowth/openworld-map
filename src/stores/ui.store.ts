import { create } from "zustand";
import type { PostCategory, MapViewState } from "@/types";

interface UIState {
  // Modal states
  isPostModalOpen: boolean;
  isAuthModalOpen: boolean;

  // Feed state
  selectedCategory: PostCategory | null;

  // Map state
  mapViewState: MapViewState;
  showUserPins: boolean;
  selectedPinId: string | null;

  // Mobile navigation
  activeTab: "map" | "feed" | "leaderboard" | "profile";

  // Actions
  openPostModal: () => void;
  closePostModal: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  setSelectedCategory: (category: PostCategory | null) => void;
  setMapViewState: (viewState: Partial<MapViewState>) => void;
  setShowUserPins: (show: boolean) => void;
  setSelectedPinId: (pinId: string | null) => void;
  setActiveTab: (tab: UIState["activeTab"]) => void;
}

const DEFAULT_MAP_VIEW: MapViewState = {
  latitude: 45.4642, // Milan, Italy (default for gig workers)
  longitude: 9.19,
  zoom: 12,
  bearing: 0,
  pitch: 0,
};

export const useUIStore = create<UIState>()((set) => ({
  // Initial state
  isPostModalOpen: false,
  isAuthModalOpen: false,
  selectedCategory: null,
  mapViewState: DEFAULT_MAP_VIEW,
  showUserPins: false,
  selectedPinId: null,
  activeTab: "feed",

  // Actions
  openPostModal: () => set({ isPostModalOpen: true }),
  closePostModal: () => set({ isPostModalOpen: false }),
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setMapViewState: (viewState) =>
    set((state) => ({
      mapViewState: { ...state.mapViewState, ...viewState },
    })),
  setShowUserPins: (show) => set({ showUserPins: show }),
  setSelectedPinId: (pinId) => set({ selectedPinId: pinId }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
