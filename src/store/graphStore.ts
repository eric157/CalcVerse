import { create } from 'zustand';

export type GraphFunction = {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
};

export const neonPalette = [
  '#7c3aed',
  '#06b6d4',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#ec4899',
  '#8b5cf6',
  '#14b8a6',
] as const;

const defaultFunctions: GraphFunction[] = [
  { id: 'f1', expression: 'sin(x)', color: neonPalette[0], visible: true },
];

type GraphState = {
  functions: GraphFunction[];
  domain: [number, number];
  setDomain: (domain: [number, number]) => void;
  addFunction: () => void;
  updateFunction: (id: string, expression: string) => void;
  setFunctionColor: (id: string, color: string) => void;
  toggleFunction: (id: string) => void;
  removeFunction: (id: string) => void;
};

export const useGraphStore = create<GraphState>((set) => ({
  functions: defaultFunctions,
  domain: [-10, 10],
  setDomain: (domain) => set({ domain }),
  addFunction: () =>
    set((state) => {
      if (state.functions.length >= neonPalette.length) {
        return state;
      }
      const nextIndex = state.functions.length;
      return {
        functions: [
          ...state.functions,
          {
            id: `f${nextIndex + 1}`,
            expression: 'cos(x)',
            color: neonPalette[nextIndex],
            visible: true,
          },
        ],
      };
    }),
  updateFunction: (id, expression) =>
    set((state) => ({
      functions: state.functions.map((fn) => (fn.id === id ? { ...fn, expression } : fn)),
    })),
  setFunctionColor: (id, color) =>
    set((state) => ({
      functions: state.functions.map((fn) => (fn.id === id ? { ...fn, color } : fn)),
    })),
  toggleFunction: (id) =>
    set((state) => ({
      functions: state.functions.map((fn) =>
        fn.id === id
          ? {
              ...fn,
              visible: !fn.visible,
            }
          : fn,
      ),
    })),
  removeFunction: (id) =>
    set((state) => {
      if (state.functions.length <= 1) {
        return state;
      }
      return { functions: state.functions.filter((fn) => fn.id !== id) };
    }),
}));