import { useMemo } from 'react';
import { useCalcStore } from '../../store/calcStore';

export function TimeSlider() {
  const t = useCalcStore((state) => state.t);
  const tRange = useCalcStore((state) => state.tRange);
  const setT = useCalcStore((state) => state.setT);

  const waveformPath = useMemo(() => {
    const width = 120;
    const height = 30;
    const points: string[] = [];

    for (let i = 0; i <= width; i += 1) {
      const x = i;
      const y = height / 2 + Math.sin((i / width) * Math.PI * 2 + t) * 9;
      points.push(`${x},${y}`);
    }

    return `M ${points.join(' L ')}`;
  }, [t]);

  return (
    <div className="space-y-2 rounded-md border border-[var(--border-dim)] bg-[var(--bg-surface)] p-2">
      <p className="font-mono text-xs text-[var(--text-dim)]">t = {t.toFixed(3)}</p>
      <input
        type="range"
        min={tRange[0]}
        max={tRange[1]}
        step={0.001}
        value={t}
        onChange={(event) => setT(Number(event.target.value))}
        className="w-full"
      />
      <svg width="120" height="30" viewBox="0 0 120 30" className="w-full">
        <path d={waveformPath} stroke="#06b6d4" strokeWidth="1.4" fill="none" />
      </svg>
    </div>
  );
}