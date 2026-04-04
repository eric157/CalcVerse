import { useEffect, useRef } from 'react';

type FrameCallback = (deltaSeconds: number) => void;

export function useAnimationFrame(enabled: boolean, callback: FrameCallback) {
  const frameRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = null;
      lastRef.current = 0;
      return;
    }

    const step = (time: number) => {
      if (lastRef.current === 0) {
        lastRef.current = time;
      }
      const delta = (time - lastRef.current) / 1000;
      lastRef.current = time;
      callback(delta);
      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = null;
      lastRef.current = 0;
    };
  }, [callback, enabled]);
}