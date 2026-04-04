import { useMemo } from 'react';
import { differentiate } from '../../engine/Differentiator';
import { mathEngine } from '../../engine/MathEngine';

type TangentLineProps = {
  expression: string;
  x0: number;
};

export function TangentLine({ expression, x0 }: TangentLineProps) {
  const details = useMemo(() => {
    const y0 = mathEngine.evaluate(expression, { x: x0 });
    const derivative = differentiate(expression, x0, 1e-5, 'central');
    return {
      y0,
      slope: derivative.numerical,
      symbolic: derivative.symbolic,
      error: derivative.error,
    };
  }, [expression, x0]);

  return (
    <div className="rounded-xl border border-[var(--border-dim)] bg-[var(--bg-panel)] p-3">
      <h3 className="text-sm font-semibold">Tangent Diagnostics</h3>
      <div className="mt-2 space-y-1 font-mono text-xs text-[var(--text-dim)]">
        <p>x0 = {x0.toFixed(4)}</p>
        <p>f(x0) = {details.y0.toFixed(8)}</p>
        <p>f'(x0) ≈ {details.slope.toFixed(8)}</p>
        <p>symbolic: {details.symbolic}</p>
        <p>numeric-symbolic error: {details.error.toExponential(3)}</p>
      </div>
    </div>
  );
}