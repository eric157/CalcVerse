import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { WorkerMsg } from '../../engine/WebWorker';

type Surface3DProps = {
  expression: string;
  resolution: number;
  wireframe: boolean;
  xRange?: [number, number];
  yRange?: [number, number];
  time?: number;
  onGridData?: (points: Float32Array, resolution: number) => void;
};

const tempColor = new THREE.Color();

export function Surface3D({
  expression,
  resolution,
  wireframe,
  xRange = [-6, 6],
  yRange = [-6, 6],
  time = 0,
  onGridData,
}: Surface3DProps) {
  const workerRef = useRef<Worker | null>(null);
  const [grid, setGrid] = useState<Float32Array | null>(null);
  const [workerResolution, setWorkerResolution] = useState(resolution);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../../engine/WebWorker.ts', import.meta.url), { type: 'module' });

    workerRef.current.onmessage = (event: MessageEvent<WorkerMsg>) => {
      const data = event.data;
      if (data.type === 'RESULT_GRID') {
        const points = data.points;
        setGrid(new Float32Array(points));
        setWorkerResolution(data.resolution);
        onGridData?.(new Float32Array(points), data.resolution);
      }
    };

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [onGridData]);

  useEffect(() => {
    workerRef.current?.postMessage({
      type: 'EVALUATE_GRID',
      expr: expression,
      xRange,
      yRange,
      resolution,
      t: time,
    } satisfies WorkerMsg);
  }, [expression, resolution, time, xRange, yRange]);

  const geometry = useMemo(() => {
    if (!grid) {
      return null;
    }

    const n = workerResolution;
    const totalVertices = n * n;

    const positions = new Float32Array(totalVertices * 3);
    const colors = new Float32Array(totalVertices * 3);

    const dx = (xRange[1] - xRange[0]) / (n - 1);
    const dy = (yRange[1] - yRange[0]) / (n - 1);

    let zMin = Number.POSITIVE_INFINITY;
    let zMax = Number.NEGATIVE_INFINITY;

    for (let index = 0; index < totalVertices; index += 1) {
      const z = grid[index];
      if (Number.isFinite(z)) {
        zMin = Math.min(zMin, z);
        zMax = Math.max(zMax, z);
      }
    }

    const span = Math.max(1e-6, zMax - zMin);

    for (let yi = 0; yi < n; yi += 1) {
      for (let xi = 0; xi < n; xi += 1) {
        const index = yi * n + xi;
        const posIndex = index * 3;
        const z = grid[index];

        positions[posIndex] = xRange[0] + xi * dx;
        positions[posIndex + 1] = Number.isFinite(z) ? z : 0;
        positions[posIndex + 2] = yRange[0] + yi * dy;

        const normalized = (positions[posIndex + 1] - zMin) / span;
        tempColor.setHSL(0.65 - normalized * 0.65, 0.9, 0.55);
        colors[posIndex] = tempColor.r;
        colors[posIndex + 1] = tempColor.g;
        colors[posIndex + 2] = tempColor.b;
      }
    }

    const indices: number[] = [];

    for (let yi = 0; yi < n - 1; yi += 1) {
      for (let xi = 0; xi < n - 1; xi += 1) {
        const a = yi * n + xi;
        const b = a + 1;
        const c = a + n;
        const d = c + 1;

        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    const built = new THREE.BufferGeometry();
    built.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    built.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    built.setIndex(indices);
    built.computeVertexNormals();
    return built;
  }, [grid, workerResolution, xRange, yRange]);

  useEffect(() => {
    return () => {
      geometry?.dispose();
    };
  }, [geometry]);

  if (!geometry) {
    return null;
  }

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial vertexColors roughness={0.2} metalness={0.15} side={THREE.DoubleSide} />
      </mesh>
      {wireframe ? (
        <mesh geometry={geometry}>
          <meshBasicMaterial wireframe transparent opacity={0.25} color="#c4b5fd" />
        </mesh>
      ) : null}
    </group>
  );
}