import { useState } from 'react';
import { useMathEval } from '../hooks/useMathEval';
import { useCalcStore } from '../store/calcStore';
import { useGraphStore } from '../store/graphStore';

export function Lab2D() {
  const graphFn = useGraphStore((state) => state.functions[0]);
  const updateFunction = useGraphStore((state) => state.updateFunction);
  const x0 = useCalcStore((state) => state.x0);
  const setX0 = useCalcStore((state) => state.setX0);
  const [localExpr, setLocalExpr] = useState(graphFn.expression);

  const evaluation = useMathEval(localExpr, x0);

  return (
    <section className="mx-auto max-w-4xl p-4">
      <h1 className="text-xl font-semibold">2D Calculus Lab</h1>
      <p className="mt-2 text-sm text-[var(--text-dim)]">Typed math parser + evaluator + symbolic derivative.</p>

      <div className="mt-5 grid gap-4 rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-panel)] p-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="block text-[var(--text-dim)]">Expression f(x)</span>
          <input
            value={localExpr}
            onChange={(event) => setLocalExpr(event.target.value)}
            className="w-full rounded-md border border-[var(--border-dim)] bg-[var(--bg-surface)] px-3 py-2 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-cyan)]"
          />
          <button
            type="button"
            onClick={() => updateFunction(graphFn.id, localExpr)}
            className="rounded-md border border-[var(--border-glow)] px-3 py-1.5 text-xs transition hover:shadow-[var(--glow-violet)]"
          >
            Save to store
          </button>
        </label>

        <label className="space-y-2 text-sm">
          <span className="block text-[var(--text-dim)]">Probe point x</span>
          <input
            type="number"
            value={x0}
            step="0.25"
            onChange={(event) => setX0(Number(event.target.value))}
            className="w-full rounded-md border border-[var(--border-dim)] bg-[var(--bg-surface)] px-3 py-2 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-cyan)]"
          />
        </label>

        <div className="rounded-xl border border-[var(--border-dim)] bg-[var(--bg-surface)] p-3 text-sm md:col-span-2">
          {!evaluation.valid ? (
            <p className="text-red-300">Parse error: {evaluation.error}</p>
          ) : (
            <div className="grid gap-2 font-mono text-sm">
              <p>f({x0.toFixed(4)}) = {evaluation.value.toFixed(8)}</p>
              <p>f'(x) = {evaluation.derivative?.symbolic ?? 'n/a'}</p>
              <p>f'({x0.toFixed(4)}) ≈ {evaluation.derivative?.numerical.toFixed(8) ?? 'n/a'}</p>
              <p>absolute error = {evaluation.derivative?.error.toExponential(3) ?? 'n/a'}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}