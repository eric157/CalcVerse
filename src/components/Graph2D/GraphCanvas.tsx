import { useCallback, useMemo } from 'react';
import Plot from 'react-plotly.js';
import type { Data, Layout, Config } from 'plotly.js';
import { mathEngine } from '../../engine/MathEngine';
import { validateExpression } from '../../engine/FunctionParser';
import { useGraphStore } from '../../store/graphStore';
import { useCalcStore } from '../../store/calcStore';

type PlotPoint = {
  x: number;
  y: number;
  dy: number;
};

function sampleFunction(expression: string, domain: [number, number], time: number, points = 2000): PlotPoint[] {
  const [min, max] = domain;
  const step = (max - min) / (points - 1);
  const values: PlotPoint[] = [];

  for (let i = 0; i < points; i += 1) {
    const x = min + i * step;
    let y: number;
    try {
      y = mathEngine.evaluate(expression, { x, t: time });
    } catch {
      y = Number.NaN;
    }
    values.push({ x, y, dy: Number.NaN });
  }

  for (let i = 1; i < values.length - 1; i += 1) {
    const prev = values[i - 1];
    const next = values[i + 1];
    const derivative = (next.y - prev.y) / (next.x - prev.x);
    values[i].dy = derivative;
  }

  if (values.length > 1) {
    values[0].dy = values[1].dy;
    values[values.length - 1].dy = values[values.length - 2].dy;
  }

  return values;
}

function injectGlow(graphDiv: HTMLElement | null) {
  if (!graphDiv) {
    return;
  }

  const svg = graphDiv.querySelector('svg.main-svg');
  if (!svg) {
    return;
  }

  let defs = svg.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.prepend(defs);
  }

  if (!defs.querySelector('#curve-glow')) {
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'curve-glow');

    const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    blur.setAttribute('stdDeviation', '2.2');
    blur.setAttribute('result', 'blurred');

    const merge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const node1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    node1.setAttribute('in', 'blurred');
    const node2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    node2.setAttribute('in', 'SourceGraphic');

    merge.append(node1, node2);
    filter.append(blur, merge);
    defs.append(filter);
  }

  graphDiv.querySelectorAll('.scatterlayer .trace path.js-line').forEach((path) => {
    path.setAttribute('filter', 'url(#curve-glow)');
  });
}

export function GraphCanvas() {
  const functions = useGraphStore((state) => state.functions);
  const domain = useGraphStore((state) => state.domain);
  const time = useCalcStore((state) => state.t);

  const traces = useMemo(() => {
    return functions
      .filter((fn) => fn.visible)
      .map((fn): Data | null => {
        const validation = validateExpression(fn.expression);
        if (!validation.isValid) {
          return null;
        }

        const temporal = mathEngine.hasTimeVariable(validation.normalized);
        const points = sampleFunction(validation.normalized, domain, temporal ? time : 0, 800);

        return {
          type: 'scatter',
          mode: 'lines',
          x: points.map((p) => p.x),
          y: points.map((p) => p.y),
          customdata: points.map((p) => p.dy),
          line: {
            color: fn.color,
            width: 2.3,
          },
          hovertemplate:
            "x = %{x:.4f}<br>f(x) = %{y:.4f}<br>f'(x) = %{customdata:.4f}<extra></extra>",
          name: fn.expression,
        } satisfies Data;
      })
      .filter((trace): trace is Data => trace !== null);
  }, [domain, functions, time]);

  const layout = useMemo<Partial<Layout>>(
    () => ({
      paper_bgcolor: '#0a0a0f',
      plot_bgcolor: '#0a0a0f',
      hovermode: 'closest',
      xaxis: {
        title: { text: 'x' },
        gridcolor: '#1a1a2e',
        color: '#4a4a6a',
        range: [domain[0], domain[1]],
      },
      yaxis: {
        title: { text: 'f(x)' },
        gridcolor: '#1a1a2e',
        color: '#4a4a6a',
        zerolinecolor: '#2d2d4f',
      },
      margin: { l: 45, r: 12, t: 12, b: 40 },
      showlegend: true,
      legend: {
        bgcolor: 'rgba(18,18,42,0.7)',
        bordercolor: '#1e1e3a',
        borderwidth: 1,
      },
    }),
    [domain],
  );

  const config = useMemo<Partial<Config>>(
    () => ({
      responsive: true,
      displayModeBar: false,
      scrollZoom: true,
    }),
    [],
  );

  const attachGlow = useCallback((_: unknown, graphDiv: HTMLElement) => {
    injectGlow(graphDiv);
  }, []);

  return (
    <div className="h-[55vh] min-h-[420px] rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-panel)] p-2 glow-cyan">
      <Plot
        data={traces}
        layout={layout}
        config={config}
        useResizeHandler
        onInitialized={attachGlow}
        onUpdate={attachGlow}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}