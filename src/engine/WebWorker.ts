/// <reference lib="webworker" />
import { create, all, MathJsStatic } from 'mathjs';

const math = create(all) as MathJsStatic;

export type WorkerMsg =
  | {
      type: 'EVALUATE_GRID';
      expr: string;
      xRange: [number, number];
      yRange: [number, number];
      resolution: number;
      t?: number;
    }
  | {
      type: 'RESULT_GRID';
      points: Float32Array;
      gradients: Float32Array;
      resolution: number;
    }
  | {
      type: 'ERROR';
      message: string;
    };

function normalizeAbsolute(expression: string): string {
  const absPattern = /\|([^|]+)\|/g;
  let normalized = expression;
  let previous = '';

  while (normalized !== previous) {
    previous = normalized;
    normalized = normalized.replace(absPattern, 'abs($1)');
  }

  return normalized;
}

function evaluateGrid(
  expr: string,
  xRange: [number, number],
  yRange: [number, number],
  resolution: number,
  t = 0,
): { points: Float32Array; gradients: Float32Array } {
  const total = resolution * resolution;
  const points = new Float32Array(total);
  const gradients = new Float32Array(total * 2);

  const dx = (xRange[1] - xRange[0]) / (resolution - 1);
  const dy = (yRange[1] - yRange[0]) / (resolution - 1);
  const normalized = normalizeAbsolute(expr.trim());
  const compiled = math.compile(normalized);
  const scope = { x: 0, y: 0, t };

  // First pass: Calculate Z values
  for (let yi = 0; yi < resolution; yi += 1) {
    scope.y = yRange[0] + yi * dy;
    for (let xi = 0; xi < resolution; xi += 1) {
      scope.x = xRange[0] + xi * dx;
      const index = yi * resolution + xi;
      try {
        const val = compiled.evaluate(scope);
        points[index] = typeof val === 'number' ? val : Number(val);
      } catch {
        points[index] = Number.NaN;
      }
    }
  }

  // Second pass: Calculate gradients (fx, fy) using Central differences
  const hx = dx;
  const hy = dy;

  for (let yi = 0; yi < resolution; yi += 1) {
    for (let xi = 0; xi < resolution; xi += 1) {
      const idx = yi * resolution + xi;
      const grIdx = idx * 2;

      // Improved Finite Differences
      let gx = 0;
      let gy = 0;

      if (xi > 0 && xi < resolution - 1) {
        gx = (points[idx + 1] - points[idx - 1]) / (2 * hx);
      } else if (xi === 0) {
        gx = (points[idx + 1] - points[idx]) / hx;
      } else {
        gx = (points[idx] - points[idx - 1]) / hx;
      }

      if (yi > 0 && yi < resolution - 1) {
        gy = (points[idx + resolution] - points[idx - resolution]) / (2 * hy);
      } else if (yi === 0) {
        gy = (points[idx + resolution] - points[idx]) / hy;
      } else {
        gy = (points[idx] - points[idx - resolution]) / hy;
      }

      gradients[grIdx] = gx;
      gradients[grIdx + 1] = gy;
    }
  }

  return { points, gradients };
}

const inWorkerContext =
  typeof self !== 'undefined' &&
  typeof WorkerGlobalScope !== 'undefined' &&
  self instanceof WorkerGlobalScope;

if (inWorkerContext) {
  const workerScope = self as unknown as DedicatedWorkerGlobalScope;

  workerScope.onmessage = (event: MessageEvent<WorkerMsg>) => {
    const data = event.data;
    if (data.type !== 'EVALUATE_GRID') {
      return;
    }

    try {
      const { points, gradients } = evaluateGrid(data.expr, data.xRange, data.yRange, data.resolution, data.t ?? 0);

      const payload: WorkerMsg = {
        type: 'RESULT_GRID',
        points,
        gradients,
        resolution: data.resolution,
      };

      // Transfer both buffers for zero-copy performance
      workerScope.postMessage(payload, [points.buffer, gradients.buffer]);
    } catch (error) {
      const payload: WorkerMsg = {
        type: 'ERROR',
        message: error instanceof Error ? error.message : 'Failed to evaluate grid',
      };
      workerScope.postMessage(payload);
    }
  };
}