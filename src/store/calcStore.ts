import { create } from 'zustand';

type CalculusState = {
  x0: number;
  h: number;
  integralBounds: [number, number];
  riemannN: number;
  surfaceExpression: string;
  resolution3D: number;
  wireframe: boolean;
  showGradientArrows: boolean;
  showContours: boolean;
  showSlicing: boolean;
  sliceAxis: 'xz' | 'yz';
  sliceOffset: number;
  t: number;
  tRange: [number, number];
  playing: boolean;
  speed: number;
  setX0: (value: number) => void;
  setH: (value: number) => void;
  setIntegralBounds: (bounds: [number, number]) => void;
  setRiemannN: (n: number) => void;
  setSurfaceExpression: (expression: string) => void;
  setResolution3D: (resolution: number) => void;
  toggleWireframe: () => void;
  toggleGradientArrows: () => void;
  toggleContours: () => void;
  toggleSlicing: () => void;
  setSliceAxis: (axis: 'xz' | 'yz') => void;
  setSliceOffset: (offset: number) => void;
  setT: (value: number) => void;
  setTRange: (range: [number, number]) => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  resetTime: () => void;
};

const defaultTRange: [number, number] = [0, Math.PI * 2];

export const useCalcStore = create<CalculusState>((set) => ({
  x0: 1,
  h: 1,
  integralBounds: [0, 1],
  riemannN: 8,
  surfaceExpression: 'sin(x)*cos(y)',
  resolution3D: 128,
  wireframe: false,
  showGradientArrows: true,
  showContours: true,
  showSlicing: true,
  sliceAxis: 'xz',
  sliceOffset: 0,
  t: 0,
  tRange: defaultTRange,
  playing: false,
  speed: 1,
  setX0: (value) => set({ x0: value }),
  setH: (value) => set({ h: value }),
  setIntegralBounds: (bounds) => set({ integralBounds: bounds }),
  setRiemannN: (n) => set({ riemannN: n }),
  setSurfaceExpression: (surfaceExpression) => set({ surfaceExpression }),
  setResolution3D: (resolution3D) => set({ resolution3D }),
  toggleWireframe: () => set((state) => ({ wireframe: !state.wireframe })),
  toggleGradientArrows: () => set((state) => ({ showGradientArrows: !state.showGradientArrows })),
  toggleContours: () => set((state) => ({ showContours: !state.showContours })),
  toggleSlicing: () => set((state) => ({ showSlicing: !state.showSlicing })),
  setSliceAxis: (sliceAxis) => set({ sliceAxis }),
  setSliceOffset: (sliceOffset) => set({ sliceOffset }),
  setT: (t) => set({ t }),
  setTRange: (tRange) => set({ tRange }),
  setPlaying: (playing) => set({ playing }),
  setSpeed: (speed) => set({ speed }),
  resetTime: () => set((state) => ({ t: state.tRange[0] })),
}));