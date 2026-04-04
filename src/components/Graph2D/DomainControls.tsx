import { useGraphStore } from '../../store/graphStore';

export function DomainControls() {
  const domain = useGraphStore((state) => state.domain);
  const setDomain = useGraphStore((state) => state.setDomain);

  return (
    <div className="rounded-xl border border-[var(--border-dim)] bg-[var(--bg-panel)] p-3">
      <h3 className="text-sm font-semibold">Domain</h3>
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <label className="space-y-1">
          <span className="text-xs text-[var(--text-dim)]">Min x</span>
          <input
            type="number"
            value={domain[0]}
            step="0.5"
            onChange={(event) => setDomain([Number(event.target.value), domain[1]])}
            className="w-full rounded-md border border-[var(--border-dim)] bg-[var(--bg-surface)] px-2 py-1 font-mono text-sm"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-[var(--text-dim)]">Max x</span>
          <input
            type="number"
            value={domain[1]}
            step="0.5"
            onChange={(event) => setDomain([domain[0], Number(event.target.value)])}
            className="w-full rounded-md border border-[var(--border-dim)] bg-[var(--bg-surface)] px-2 py-1 font-mono text-sm"
          />
        </label>
      </div>
    </div>
  );
}