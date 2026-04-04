import { useEffect, useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import type { Data } from 'plotly.js';
import { useMotionValueEvent, useSpring } from 'framer-motion';
import { integrate, IntegrationMethod } from '../../engine/Integrator';
import { mathEngine } from '../../engine/MathEngine';
import { useCalcStore } from '../../store/calcStore';
import { GlowButton } from '../UI/GlowButton';

type RiemannSumsProps = {
  expression: string;
};

const methodColors: Record<IntegrationMethod, string> = {
  left: '#3b82f6',
  right: '#f97316',
  midpoint: '#22c55e',
  trapezoid: '#a855f7',
  simpson: '#06b6d4',
};

const animationSteps = [1, 4, 8, 16, 32, 100, 500];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function RiemannSums({ expression }: RiemannSumsProps) {
  const bounds = useCalcStore((state) => state.integralBounds);
  const setBounds = useCalcStore((state) => state.setIntegralBounds);
  const n = useCalcStore((state) => state.riemannN);
  const setN = useCalcStore((state) => state.setRiemannN);

  const [method, setMethod] = useState<IntegrationMethod>('left');
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      for (const step of animationSteps) {
        if (cancelled) {
          return;
        }
        setN(step);
        await delay(200);
      }
      setPlaying(false);
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [playing, setN]);

  const result = useMemo(() => integrate(expression, bounds[0], bounds[1], n, method), [bounds, expression, method, n]);
  const exact = useMemo(() => integrate(expression, bounds[0], bounds[1], 4000, 'simpson').value, [bounds, expression]);

  const sumSpring = useSpring(result.value, { stiffness: 90, damping: 18 });
  const [displayValue, setDisplayValue] = useState(result.value);
  useEffect(() => {
    sumSpring.set(result.value);
  }, [result.value, sumSpring]);
  useMotionValueEvent(sumSpring, 'change', (latest) => setDisplayValue(latest));

  const plotData = useMemo(() => {
    const points = 500;
    const step = (bounds[1] - bounds[0]) / (points - 1);

    const xCurve: number[] = [];
    const yCurve: number[] = [];

    for (let i = 0; i < points; i += 1) {
      const x = bounds[0] + i * step;
      xCurve.push(x);
      yCurve.push(mathEngine.evaluate(expression, { x }));
    }

    const curveTrace: Data = {
      type: 'scatter',
      mode: 'lines',
      x: xCurve,
      y: yCurve,
      line: { color: '#06b6d4', width: 2 },
      name: 'f(x)',
    };

    const rectTrace: Data = {
      type: 'bar',
      x: result.rectangles.map((rect) => (rect.xLeft + rect.xRight) / 2),
      y: result.rectangles.map((rect) => rect.height),
      width: result.rectangles.map((rect) => rect.xRight - rect.xLeft),
      marker: {
        color: methodColors[method],
        opacity: 0.45,
      },
      hovertemplate: 'x=%{x:.3f}<br>h=%{y:.3f}<extra></extra>',
      name: `${method} rectangles`,
    };

    return [curveTrace, rectTrace];
  }, [bounds, expression, method, result.rectangles]);

  return (
    <div className="rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-panel)] p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Riemann Sum Animator</h3>
        <div className="flex items-center gap-2 text-xs">
          <select
            value={method}
            onChange={(event) => setMethod(event.target.value as IntegrationMethod)}
            className="rounded border border-[var(--border-dim)] bg-[var(--bg-surface)] px-2 py-1"
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="midpoint">Midpoint</option>
            <option value="trapezoid">Trapezoid</option>
            <option value="simpson">Simpson 1/3</option>
          </select>
          <GlowButton
            tone="cyan"
            className="text-xs"
            onClick={() => {
              setN(1);
              setPlaying(true);
            }}
          >
            Animate n
          </GlowButton>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-2 gap-2 text-xs">
        <label className="space-y-1">
          <span className="block text-[var(--text-dim)]">a</span>
          <input
            type="number"
            value={bounds[0]}
            step="0.25"
            onChange={(event) => setBounds([Number(event.target.value), bounds[1]])}
            className="w-full rounded border border-[var(--border-dim)] bg-[var(--bg-surface)] px-2 py-1 font-mono"
          />
        </label>
        <label className="space-y-1">
          <span className="block text-[var(--text-dim)]">b</span>
          <input
            type="number"
            value={bounds[1]}
            step="0.25"
            onChange={(event) => setBounds([bounds[0], Number(event.target.value)])}
            className="w-full rounded border border-[var(--border-dim)] bg-[var(--bg-surface)] px-2 py-1 font-mono"
          />
        </label>
      </div>

      <Plot
        data={plotData}
        layout={{
          barmode: 'overlay',
          paper_bgcolor: '#0a0a0f',
          plot_bgcolor: '#0a0a0f',
          xaxis: { gridcolor: '#1a1a2e', color: '#4a4a6a' },
          yaxis: { gridcolor: '#1a1a2e', color: '#4a4a6a' },
          margin: { l: 40, r: 10, t: 10, b: 36 },
          showlegend: false,
        }}
        config={{ responsive: true, displayModeBar: false, scrollZoom: true }}
        useResizeHandler
        style={{ width: '100%', height: '330px' }}
      />

      <div className="mt-2 rounded-md border border-[var(--border-dim)] bg-black/20 p-2 font-mono text-xs text-[var(--text-dim)]">
        <p>Σ f(xi)Δx = {displayValue.toFixed(8)}</p>
        <p>exact reference = {exact.toFixed(8)}</p>
        <p>error = {result.error.toExponential(3)}</p>
        <p>n = {n}</p>
      </div>
    </div>
  );
}