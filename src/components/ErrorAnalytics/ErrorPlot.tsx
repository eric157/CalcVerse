import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import type { Data } from 'plotly.js';
import { create, all, MathJsStatic } from 'mathjs';
import { mathEngine } from '../../engine/MathEngine';

const math = create(all) as MathJsStatic;

type ErrorPlotProps = {
  expression: string;
  x0: number;
  epsilon: number;
  smoothing: boolean;
};

function gaussianRandom(seed: number): number {
  const s1 = Math.sin(seed * 12.9898) * 43758.5453;
  const s2 = Math.sin((seed + 1) * 93.9898) * 24634.6345;
  const u1 = s1 - Math.floor(s1);
  const u2 = s2 - Math.floor(s2);
  return Math.sqrt(-2 * Math.log(Math.max(1e-9, u1))) * Math.cos(2 * Math.PI * u2);
}

function noisyValue(expression: string, x: number, epsilon: number, seed: number): number {
  const base = mathEngine.evaluate(expression, { x });
  return base + epsilon * gaussianRandom(seed);
}

function smoothedNoisyValue(expression: string, x: number, epsilon: number, seed: number): number {
  const offsets = [-1, 0, 1];
  const kernel = [0.25, 0.5, 0.25];
  let total = 0;

  for (let i = 0; i < offsets.length; i += 1) {
    total += kernel[i] * noisyValue(expression, x + offsets[i] * 1e-4, epsilon, seed + i);
  }

  return total;
}

function evaluateDerivative(
  expression: string,
  x: number,
  h: number,
  method: 'forward' | 'backward' | 'central',
  epsilon: number,
  smoothing: boolean,
  seed: number,
): number {
  const sampler = smoothing ? smoothedNoisyValue : noisyValue;

  const f = (value: number, localSeed: number) => sampler(expression, value, epsilon, localSeed);

  if (method === 'forward') {
    return (f(x + h, seed) - f(x, seed + 10)) / h;
  }
  if (method === 'backward') {
    return (f(x, seed + 20) - f(x - h, seed + 30)) / h;
  }
  return (f(x + h, seed + 40) - f(x - h, seed + 50)) / (2 * h);
}

export function ErrorPlot({ expression, x0, epsilon, smoothing }: ErrorPlotProps) {
  const { hValues, forwardErrors, backwardErrors, centralErrors, optimalH } = useMemo(() => {
    const symbolic = mathEngine.derivative(expression, 'x');
    const exactEval = math.evaluate(symbolic, { x: x0 });
    const exact = typeof exactEval === 'number' ? exactEval : Number(exactEval);

    const hValues = Array.from({ length: 30 }, (_, i) => 10 ** (-1 - i * (14 / 29)));

    const forwardErrors = hValues.map((h, index) =>
      Math.abs(evaluateDerivative(expression, x0, h, 'forward', epsilon, smoothing, index * 13) - exact),
    );
    const backwardErrors = hValues.map((h, index) =>
      Math.abs(evaluateDerivative(expression, x0, h, 'backward', epsilon, smoothing, index * 19) - exact),
    );
    const centralErrors = hValues.map((h, index) =>
      Math.abs(evaluateDerivative(expression, x0, h, 'central', epsilon, smoothing, index * 29) - exact),
    );

    let bestIndex = 0;
    for (let i = 1; i < centralErrors.length; i += 1) {
      if (centralErrors[i] < centralErrors[bestIndex]) {
        bestIndex = i;
      }
    }

    return {
      hValues,
      forwardErrors,
      backwardErrors,
      centralErrors,
      optimalH: hValues[bestIndex],
    };
  }, [epsilon, expression, smoothing, x0]);

  const traces: Data[] = [
    {
      type: 'scatter',
      mode: 'lines+markers',
      x: hValues,
      y: forwardErrors,
      line: { color: '#f59e0b', width: 2 },
      marker: { size: 4 },
      name: 'Forward',
    },
    {
      type: 'scatter',
      mode: 'lines+markers',
      x: hValues,
      y: backwardErrors,
      line: { color: '#ef4444', width: 2 },
      marker: { size: 4 },
      name: 'Backward',
    },
    {
      type: 'scatter',
      mode: 'lines+markers',
      x: hValues,
      y: centralErrors,
      line: { color: '#06b6d4', width: 2 },
      marker: { size: 4 },
      name: 'Central',
    },
  ];

  return (
    <div className="rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-panel)] p-3">
      <h3 className="mb-2 text-sm font-semibold">Error vs Step Size (log-log)</h3>
      <Plot
        data={traces}
        layout={{
          paper_bgcolor: '#0a0a0f',
          plot_bgcolor: '#0a0a0f',
          margin: { l: 52, r: 18, t: 12, b: 45 },
          xaxis: {
            type: 'log',
            title: { text: 'h' },
            gridcolor: '#1a1a2e',
            color: '#4a4a6a',
          },
          yaxis: {
            type: 'log',
            title: { text: '|numerical - exact|' },
            gridcolor: '#1a1a2e',
            color: '#4a4a6a',
          },
          shapes: [
            {
              type: 'line',
              x0: optimalH,
              x1: optimalH,
              y0: Math.min(...centralErrors),
              y1: Math.max(...forwardErrors),
              line: { color: '#a78bfa', width: 1.5, dash: 'dash' },
            },
          ],
          annotations: [
            {
              x: optimalH,
              y: Math.min(...centralErrors),
              text: `optimal h ~ ${optimalH.toExponential(2)}`,
              showarrow: true,
              arrowhead: 2,
              ax: 30,
              ay: -30,
              font: { size: 11, color: '#cbd5e1' },
            },
          ],
          legend: { bgcolor: 'rgba(18,18,42,0.75)', bordercolor: '#1e1e3a', borderwidth: 1 },
        }}
        config={{ responsive: true, displayModeBar: false, scrollZoom: true }}
        useResizeHandler
        style={{ width: '100%', height: '420px' }}
      />

      <div className="mt-2 rounded-md border border-[var(--border-dim)] bg-black/20 p-2 font-mono text-xs text-[var(--text-dim)]">
        <p>Truncation regime: slope ~ 1 (forward/backward), ~2 (central)</p>
        <p>Cancellation regime: very small h amplifies floating-point and noise</p>
        <p>Optimal h: {optimalH.toExponential(3)}</p>
      </div>
    </div>
  );
}