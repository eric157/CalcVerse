import { useMemo } from 'react';

export function useOrbitCamera() {
  return useMemo(
    () => ({
      minDistance: 3,
      maxDistance: 24,
      enablePan: true,
      maxPolarAngle: Math.PI * 0.49,
    }),
    [],
  );
}
