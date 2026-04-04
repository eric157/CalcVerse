import { useMemo } from 'react';
import { integrate, IntegrationMethod } from '../../engine/Integrator';
import { useCalcStore } from '../../store/calcStore';
import { mathEngine } from '../../engine/MathEngine';

type IntegralShaderProps = {
  expression: string;
  bounds: [number, number];
  n: number;
  method: IntegrationMethod;
};

export function IntegralShader({ expression, bounds, n, method }: IntegralShaderProps) {
  const t = useCalcStore((state) => state.t);
  const isTemporal = useMemo(() => mathEngine.hasTimeVariable(expression), [expression]);
  const activeTime = isTemporal ? t : 0;

  const result = useMemo(() => integrate(expression, bounds[0], bounds[1], n, method, activeTime), [bounds, expression, method, n, activeTime]);
  const exact = useMemo(() => integrate(expression, bounds[0], bounds[1], 1024, 'simpson', activeTime).value, [bounds, expression, activeTime]);

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