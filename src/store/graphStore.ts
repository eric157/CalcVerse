import { create } from 'zustand';

export type GraphFunction = {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
};

const defaultFunctions: GraphFunction[] = [
  { id: 'f1', expression: 'sin(x)', color: '#7c3aed', visible: true },
];

type GraphState = {
  functions: GraphFunction[];
  domain: [number, number];
  setDomain: (domain: [number, number]) => void;
  addFunction: (expression: string, color: string) => void;
  updateFunction: (id: string, expression: string) => void;
  toggleFunction: (id: string) => void;
};

export const useGraphStore = create<GraphState>((set) => ({
  functions: defaultFunctions,
  domain: [-10, 10],
  setDomain: (domain) => set({ domain }),
  addFunction: (expression, color) =>
    set((state) => ({
      functions: [
        ...state.functions,
        { id: `f${state.functions.length + 1}`, expression, color, visible: true },
      ],
    })),
  updateFunction: (id, expression) =>
    set((state) => ({
      functions: state.functions.map((fn) => (fn.id === id ? { ...fn, expression } : fn)),
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
}));