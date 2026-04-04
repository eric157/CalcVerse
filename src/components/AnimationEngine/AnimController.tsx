import { useCallback } from 'react';
import { useAnimationFrame } from '../../hooks/useAnimationFrame';
import { useCalcStore } from '../../store/calcStore';
import { PlaybackControls } from './PlaybackControls';
import { TimeSlider } from './TimeSlider';

type AnimControllerProps = {
  active: boolean;
};

export function AnimController({ active }: AnimControllerProps) {
  const playing = useCalcStore((state) => state.playing);
  const t = useCalcStore((state) => state.t);
  const setT = useCalcStore((state) => state.setT);
  const speed = useCalcStore((state) => state.speed);
  const tRange = useCalcStore((state) => state.tRange);

  const onFrame = useCallback(
    (deltaSeconds: number) => {
      if (!active) {
        return;
      }

      const [min, max] = tRange;
      const span = max - min;
      const next = t + deltaSeconds * speed;
      const normalized = ((next - min) % span + span) % span;
      setT(min + normalized);
    },
    [active, setT, speed, t, tRange],
  );

  useAnimationFrame(playing && active, onFrame);

  return (
    <div className="space-y-2 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-panel)] p-3">
      <h3 className="text-sm font-semibold">Animation Engine</h3>
      <PlaybackControls />
      <TimeSlider />
    </div>
  );
}