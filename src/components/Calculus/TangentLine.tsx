import { useEffect, useMemo, useState } from 'react';
import { useMotionValueEvent, useSpring } from 'framer-motion';
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

  const slopeSpring = useSpring(details.slope, { stiffness: 120, damping: 20 });
  const ySpring = useSpring(details.y0, { stiffness: 120, damping: 20 });
  const [displaySlope, setDisplaySlope] = useState(details.slope);
  const [displayY, setDisplayY] = useState(details.y0);

  useEffect(() => {
    slopeSpring.set(details.slope);
    ySpring.set(details.y0);
  }, [details.slope, details.y0, slopeSpring, ySpring]);

  useMotionValueEvent(slopeSpring, 'change', (latest) => setDisplaySlope(latest));
  useMotionValueEvent(ySpring, 'change', (latest) => setDisplayY(latest));

  return (
    <div className="rounded-xl border border-[var(--border-dim)] bg-[var(--bg-panel)] p-3">
      <h3 className="text-sm font-semibold">Tangent Diagnostics</h3>
      <div className="mt-2 space-y-1 font-mono text-xs text-[var(--text-dim)]">
        <p>x0 = {x0.toFixed(4)}</p>
        <p>f(x0) = {displayY.toFixed(8)}</p>
        <p>f'(x0) ≈ {displaySlope.toFixed(8)}</p>
        <p>symbolic: {details.symbolic}</p>
        <p>numeric-symbolic error: {details.error.toExponential(3)}</p>
      </div>
    </div>
  );
}