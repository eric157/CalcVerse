import { useCalcStore } from '../../store/calcStore';

const speedOptions = [0.25, 0.5, 1, 2, 4] as const;

export function PlaybackControls() {
  const playing = useCalcStore((state) => state.playing);
  const setPlaying = useCalcStore((state) => state.setPlaying);
  const resetTime = useCalcStore((state) => state.resetTime);
  const speed = useCalcStore((state) => state.speed);
  const setSpeed = useCalcStore((state) => state.setSpeed);

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <button
        type="button"
        onClick={() => setPlaying(!playing)}
        className="rounded border border-[var(--border-glow)] px-2 py-1 hover:shadow-[var(--glow-violet)]"
      >
        {playing ? 'Pause' : 'Play'}
      </button>
      <button type="button" onClick={resetTime} className="rounded border border-[var(--border-dim)] px-2 py-1">
        Reset
      </button>
      <select
        value={speed}
        onChange={(event) => setSpeed(Number(event.target.value))}
        className="rounded border border-[var(--border-dim)] bg-[var(--bg-surface)] px-2 py-1"
      >
        {speedOptions.map((value) => (
          <option key={value} value={value}>
            {value}x
          </option>
        ))}
      </select>
    </div>
  );
}