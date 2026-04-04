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
  history: GraphFunction[][];
  selectedIndex: number;
  domain: [number, number];
  setDomain: (domain: [number, number]) => void;
  addFunction: () => void;
  updateFunction: (id: string, expression: string) => void;
  setFunctionColor: (id: string, color: string) => void;
  toggleFunction: (id: string) => void;
  removeFunction: (id: string) => void;
  undo: () => void;
  cycleSelection: () => void;
};

function pushHistory(history: GraphFunction[][], current: GraphFunction[]): GraphFunction[][] {
  const next = [...history, current.map((fn) => ({ ...fn }))];
  return next.slice(-30);
}

export const useGraphStore = create<GraphState>((set) => ({
  functions: defaultFunctions,
  history: [],
  selectedIndex: 0,
  domain: [-10, 10],
  setDomain: (domain) => set({ domain }),
  addFunction: () =>
    set((state) => {
      if (state.functions.length >= neonPalette.length) {
        return state;
      }
      const nextIndex = state.functions.length;
      return {
        history: pushHistory(state.history, state.functions),
        functions: [
          ...state.functions,
          {
            id: `f${nextIndex + 1}`,
            expression: 'cos(x)',
            color: neonPalette[nextIndex],
            visible: true,
          },
        ],
        selectedIndex: nextIndex,
      };
    }),
  updateFunction: (id, expression) =>
    set((state) => ({
      history: pushHistory(state.history, state.functions),
      functions: state.functions.map((fn) => (fn.id === id ? { ...fn, expression } : fn)),
    })),
  setFunctionColor: (id, color) =>
    set((state) => ({
      history: pushHistory(state.history, state.functions),
      functions: state.functions.map((fn) => (fn.id === id ? { ...fn, color } : fn)),
    })),
  toggleFunction: (id) =>
    set((state) => ({
      history: pushHistory(state.history, state.functions),
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
      const nextFunctions = state.functions.filter((fn) => fn.id !== id);
      return {
        history: pushHistory(state.history, state.functions),
        functions: nextFunctions,
        selectedIndex: Math.min(state.selectedIndex, nextFunctions.length - 1),
      };
    }),
  undo: () =>
    set((state) => {
      if (state.history.length === 0) {
        return state;
      }
      const last = state.history[state.history.length - 1];
      return {
        functions: last,
        history: state.history.slice(0, -1),
        selectedIndex: Math.min(state.selectedIndex, Math.max(0, last.length - 1)),
      };
    }),
  cycleSelection: () =>
    set((state) => ({
      selectedIndex: state.functions.length > 0 ? (state.selectedIndex + 1) % state.functions.length : 0,
    })),
}));