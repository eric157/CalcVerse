import { create } from 'zustand';

type CalculusState = {
  x0: number;
  h: number;
  integralBounds: [number, number];
  riemannN: number;
  setX0: (value: number) => void;
  setH: (value: number) => void;
  setIntegralBounds: (bounds: [number, number]) => void;
  setRiemannN: (n: number) => void;
};

export const useCalcStore = create<CalculusState>((set) => ({
  x0: 1,
  h: 1,
  integralBounds: [0, 1],
  riemannN: 8,
  setX0: (value) => set({ x0: value }),
  setH: (value) => set({ h: value }),
  setIntegralBounds: (bounds) => set({ integralBounds: bounds }),
  setRiemannN: (n) => set({ riemannN: n }),
}));