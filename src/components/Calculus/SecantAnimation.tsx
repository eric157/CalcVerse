import { useEffect, useMemo, useRef, useState } from 'react';
import Plot from 'react-plotly.js';
import type { Data } from 'plotly.js';
import { mathEngine } from '../../engine/MathEngine';
import { useCalcStore } from '../../store/calcStore';

type GhostLine = {
  id: number;
  slope: number;
  x0: number;
  y0: number;
  alpha: number;
};

type SecantAnimationProps = {
  expression: string;
  domain?: [number, number];
};

const DURATION_MS = 3000;

function easeInOutCubic(t: number): number {
  if (t < 0.5) {
    return 4 * t * t * t;
  }
  return 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lineTrace(slope: number, x0: number, y0: number, alpha: number, color: string): Data {
  const xValues = [x0 - 5, x0 + 5];
  const yValues = xValues.map((x) => y0 + slope * (x - x0));
  return {
    type: 'scatter',
    mode: 'lines',
    x: xValues,
    y: yValues,
    line: {
      color,
      width: 1.8,
    },
    opacity: alpha,
    hoverinfo: 'skip',
    showlegend: false,
  };
}

export function SecantAnimation({ expression, domain = [-6, 6] }: SecantAnimationProps) {
  const x0 = useCalcStore((state) => state.x0);
  const h = useCalcStore((state) => state.h);
  const setH = useCalcStore((state) => state.setH);

  const [playing, setPlaying] = useState(false);
  const [ghosts, setGhosts] = useState<GhostLine[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) {
      return;
    }

    let start = 0;
    let counter = 0;

    const tick = (time: number) => {
      if (start === 0) {
        start = time;
      }

      const elapsed = time - start;
      const progress = Math.min(elapsed / DURATION_MS, 1);
      const eased = easeInOutCubic(progress);
      const nextH = Math.max(1e-4, 2 * (1 - eased));
      setH(nextH);

      const y0 = mathEngine.evaluate(expression, { x: x0 });
      const y2 = mathEngine.evaluate(expression, { x: x0 + nextH });
      const slope = (y2 - y0) / nextH;

      if (counter % 4 === 0) {
        setGhosts((prev) => {
          const faded = prev
            .map((item) => ({ ...item, alpha: item.alpha * 0.91 }))
            .filter((item) => item.alpha > 0.07);
          return [...faded, { id: time, slope, x0, y0, alpha: 0.65 }].slice(-48);
        });
      }
      counter += 1;

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPlaying(false);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [expression, playing, setH, x0]);

  const chartData = useMemo(() => {
    const points = 500;
    const step = (domain[1] - domain[0]) / (points - 1);

    const xs: number[] = [];
    const ys: number[] = [];

    for (let i = 0; i < points; i += 1) {
      const x = domain[0] + i * step;
      xs.push(x);
      ys.push(mathEngine.evaluate(expression, { x }));
    }

    const y1 = mathEngine.evaluate(expression, { x: x0 });
    const x2 = x0 + h;
    const y2 = mathEngine.evaluate(expression, { x: x2 });

    const secantSlope = (y2 - y1) / h;
    const tangentSlope = (mathEngine.evaluate(expression, { x: x0 + 1e-4 }) - y1) / 1e-4;

    const functionTrace: Data = {
      type: 'scatter',
      mode: 'lines',
      x: xs,
      y: ys,
      line: { color: '#06b6d4', width: 2.6 },
      name: 'f(x)',
    };

    const p1Trace: Data = {
      type: 'scatter',
      mode: 'text+markers',
      x: [x0],
      y: [y1],
      text: ['P1'],
      textposition: 'top center',
      marker: { color: '#f59e0b', size: 8 },
      hovertemplate: 'P1 (%{x:.4f}, %{y:.4f})<extra></extra>',
      showlegend: false,
    };

    const p2Trace: Data = {
      type: 'scatter',
      mode: 'text+markers',
      x: [x2],
      y: [y2],
      text: ['P2'],
      textposition: 'top center',
      marker: { color: '#ef4444', size: 8 },
      hovertemplate: 'P2 (%{x:.4f}, %{y:.4f})<extra></extra>',
      showlegend: false,
    };

    const ghostTraces = ghosts.map((ghost) =>
      lineTrace(ghost.slope, ghost.x0, ghost.y0, ghost.alpha, 'rgba(148,163,184,0.6)'),
    );

    const secantTrace = lineTrace(secantSlope, x0, y1, 1, h < 0.015 ? '#a78bfa' : '#f59e0b');
    const tangentTrace = lineTrace(tangentSlope, x0, y1, 0.85, '#06b6d4');

    return {
      traces: [functionTrace, ...ghostTraces, secantTrace, tangentTrace, p1Trace, p2Trace],
      secantSlope,
    };
  }, [domain, expression, ghosts, h, x0]);

  return (
    <div className="rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-panel)] p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Secant to Tangent Limit Animation</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setGhosts([]);
              setH(2);
              setPlaying(true);
            }}
            className="rounded-md border border-[var(--border-glow)] px-2 py-1 text-xs hover:shadow-[var(--glow-violet)]"
          >
            Animate 3s
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setH(2);
              setGhosts([]);
            }}
            className="rounded-md border border-[var(--border-dim)] px-2 py-1 text-xs"
          >
            Reset
          </button>
        </div>
      </div>

      <Plot
        data={chartData.traces}
        layout={{
          paper_bgcolor: '#0a0a0f',
          plot_bgcolor: '#0a0a0f',
          margin: { l: 40, r: 12, t: 12, b: 35 },
          xaxis: { gridcolor: '#1a1a2e', color: '#4a4a6a', range: [domain[0], domain[1]] },
          yaxis: { gridcolor: '#1a1a2e', color: '#4a4a6a' },
          showlegend: false,
        }}
        config={{ responsive: true, displayModeBar: false, scrollZoom: true }}
        useResizeHandler
        style={{ width: '100%', height: '340px' }}
      />

      <div className="mt-2 grid gap-1 rounded-md border border-[var(--border-dim)] bg-black/20 p-2 font-mono text-xs text-[var(--text-dim)]">
        <p>h = {h.toExponential(3)}</p>
        <p>slope(secant) = {chartData.secantSlope.toFixed(8)}</p>
        <p>lim(h→0) [f(x+h)-f(x)]/h = f'(x) ≈ {chartData.secantSlope.toFixed(8)}</p>
      </div>
    </div>
  );
}
