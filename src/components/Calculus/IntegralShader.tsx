import { useMemo } from 'react';
import { integrate, IntegrationMethod } from '../../engine/Integrator';

type IntegralShaderProps = {
  expression: string;
  bounds: [number, number];
  n: number;
  method: IntegrationMethod;
};

export function IntegralShader({ expression, bounds, n, method }: IntegralShaderProps) {
  const result = useMemo(() => integrate(expression, bounds[0], bounds[1], n, method), [bounds, expression, method, n]);
  const exact = useMemo(() => integrate(expression, bounds[0], bounds[1], 2000, 'simpson').value, [bounds, expression]);

  return (
    <div className="rounded-xl border border-[var(--border-dim)] bg-[var(--bg-panel)] p-3">
      <h3 className="text-sm font-semibold">Integral Shader</h3>
      <div className="mt-2 space-y-1 font-mono text-xs text-[var(--text-dim)]">
        <p>method = {method}</p>
        <p>n = {n}</p>
        <p>sum = {result.value.toFixed(8)}</p>
        <p>exact(reference) = {exact.toFixed(8)}</p>
        <p>error = {Math.abs(result.value - exact).toExponential(3)}</p>
      </div>
    </div>
  );
}