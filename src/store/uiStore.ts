import { create } from 'zustand';

export type PanelId = 'functions' | 'calculus' | 'surface' | 'analytics' | 'shortcuts';

type UIState = {
  activePanel: PanelId | null;
  sidebarOpen: boolean;
  isShortcutModalOpen: boolean;
  theme: 'dark';
  toast: string | null;
  setActivePanel: (id: PanelId | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setShortcutModalOpen: (open: boolean) => void;
  setToast: (message: string | null) => void;
};

export const useUIStore = create<UIState>((set, get) => ({
  activePanel: null,
  sidebarOpen: true,
  isShortcutModalOpen: false,
  theme: 'dark',
  toast: null,
  setActivePanel: (id) => set({ activePanel: id }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setShortcutModalOpen: (open) => set({ isShortcutModalOpen: open }),
  setToast: (message) => {
    set({ toast: message });
    if (message) {
      setTimeout(() => {
        if (get().toast === message) {
          set({ toast: null });
        }
      }, 4000);
    }
  },
}));