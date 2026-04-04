import { useState } from 'react';
import { ErrorPlot } from '../components/ErrorAnalytics/ErrorPlot';
import { NoiseInjector } from '../components/ErrorAnalytics/NoiseInjector';
import { useGraphStore } from '../store/graphStore';

export function ErrorLab() {
  const expression = useGraphStore((state) => state.functions[0]?.expression ?? 'sin(x)');
  const [probeX, setProbeX] = useState(1);
  const [epsilon, setEpsilon] = useState(0);
  const [smoothing, setSmoothing] = useState(false);

  return (
    <section className="mx-auto grid max-w-[1500px] gap-4 p-4 xl:grid-cols-[1fr_320px]">
      <ErrorPlot expression={expression} x0={probeX} epsilon={epsilon} smoothing={smoothing} />
      <aside className="space-y-3">
        <div className="rounded-xl border border-[var(--border-dim)] bg-[var(--bg-panel)] p-3">
          <h3 className="text-sm font-semibold">Probe Settings</h3>
          <label className="mt-2 block space-y-1 text-xs">
            <span className="text-[var(--text-dim)]">Expression from overlay</span>
            <input
              value={expression}
              readOnly
              className="w-full rounded border border-[var(--border-dim)] bg-[var(--bg-surface)] px-2 py-1 font-mono"
            />
          </label>
          <label className="mt-2 block space-y-1 text-xs">
            <span className="text-[var(--text-dim)]">x0</span>
            <input
              type="number"
              value={probeX}
              step="0.1"
              onChange={(event) => setProbeX(Number(event.target.value))}
              className="w-full rounded border border-[var(--border-dim)] bg-[var(--bg-surface)] px-2 py-1 font-mono"
            />
          </label>
        </div>

        <NoiseInjector
          epsilon={epsilon}
          smoothing={smoothing}
          onEpsilonChange={setEpsilon}
          onSmoothingChange={setSmoothing}
        />
      </aside>
    </section>
  );
}