import { create } from 'zustand';

export type PanelId = 'functions' | 'calculus' | 'surface' | 'analytics' | 'shortcuts';

type UIState = {
  activePanel: PanelId | null;
  sidebarOpen: boolean;
  isShortcutModalOpen: boolean;
  theme: 'dark';
  setActivePanel: (id: PanelId | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setShortcutModalOpen: (open: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  activePanel: null,
  sidebarOpen: true,
  isShortcutModalOpen: false,
  theme: 'dark',
  setActivePanel: (id) => set({ activePanel: id }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setShortcutModalOpen: (open) => set({ isShortcutModalOpen: open }),
}));