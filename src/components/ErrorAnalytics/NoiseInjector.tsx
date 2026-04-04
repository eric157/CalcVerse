import { useMemo } from 'react';

type NoiseInjectorProps = {
  epsilon: number;
  smoothing: boolean;
  onEpsilonChange: (epsilon: number) => void;
  onSmoothingChange: (enabled: boolean) => void;
};

export function NoiseInjector({
  epsilon,
  smoothing,
  onEpsilonChange,
  onSmoothingChange,
}: NoiseInjectorProps) {
  const label = useMemo(() => epsilon.toExponential(2), [epsilon]);

  return (
    <div className="rounded-xl border border-[var(--border-dim)] bg-[var(--bg-panel)] p-3">
      <h3 className="text-sm font-semibold">Noise Injector</h3>
      <label className="mt-2 block space-y-1">
        <span className="text-xs text-[var(--text-dim)]">epsilon · N(0,1): {label}</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={epsilon}
          onChange={(event) => onEpsilonChange(Number(event.target.value))}
          className="w-full"
        />
      </label>
      <label className="mt-2 inline-flex items-center gap-2 text-xs text-[var(--text-dim)]">
        <input
          type="checkbox"
          checked={smoothing}
          onChange={(event) => onSmoothingChange(event.target.checked)}
        />
        Gaussian smoothing
      </label>
    </div>
  );
}