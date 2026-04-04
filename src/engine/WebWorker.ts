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
      resolution: number;
      shared: boolean;
    }
  | {
      type: 'ERROR';
      message: string;
    };

function evaluateGrid(
  expr: string,
  xRange: [number, number],
  yRange: [number, number],
  resolution: number,
  t = 0,
): Float32Array {
  const total = resolution * resolution;
  const points = new Float32Array(total);

  const dx = (xRange[1] - xRange[0]) / (resolution - 1);
  const dy = (yRange[1] - yRange[0]) / (resolution - 1);

  for (let yi = 0; yi < resolution; yi += 1) {
    const y = yRange[0] + yi * dy;
    for (let xi = 0; xi < resolution; xi += 1) {
      const x = xRange[0] + xi * dx;
      const index = yi * resolution + xi;

      try {
        const value = math.evaluate(expr, { x, y, t });
        points[index] = typeof value === 'number' ? value : Number(value);
      } catch {
        points[index] = Number.NaN;
      }
    }
  }

  return points;
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
      const points = evaluateGrid(data.expr, data.xRange, data.yRange, data.resolution, data.t ?? 0);

      if (typeof SharedArrayBuffer !== 'undefined') {
        const sharedBuffer = new SharedArrayBuffer(points.byteLength);
        const shared = new Float32Array(sharedBuffer);
        shared.set(points);
        const payload: WorkerMsg = {
          type: 'RESULT_GRID',
          points: shared,
          resolution: data.resolution,
          shared: true,
        };
        workerScope.postMessage(payload);
        return;
      }

      const payload: WorkerMsg = {
        type: 'RESULT_GRID',
        points,
        resolution: data.resolution,
        shared: false,
      };
      workerScope.postMessage(payload, [points.buffer]);
    } catch (error) {
      const payload: WorkerMsg = {
        type: 'ERROR',
        message: error instanceof Error ? error.message : 'Failed to evaluate grid',
      };
      workerScope.postMessage(payload);
    }
  };
}