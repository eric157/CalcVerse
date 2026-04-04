import { useMemo } from 'react';
import * as THREE from 'three';

type ContourProjectionProps = {
  points: Float32Array | null;
  resolution: number;
  xRange?: [number, number];
  yRange?: [number, number];
  levels?: number;
};

type Segment = [THREE.Vector3, THREE.Vector3];

function interpolatePoint(
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number,
  level: number,
): THREE.Vector3 {
  const denom = z2 - z1;
  const t = Math.abs(denom) < 1e-8 ? 0.5 : (level - z1) / denom;
  return new THREE.Vector3(x1 + (x2 - x1) * t, -0.05, y1 + (y2 - y1) * t);
}

export function ContourProjection({
  points,
  resolution,
  xRange = [-6, 6],
  yRange = [-6, 6],
  levels = 10,
}: ContourProjectionProps) {
  const contourLines = useMemo(() => {
    if (!points || points.length === 0) {
      return [] as { geometry: THREE.BufferGeometry; color: string }[];
    }

    let zMin = Number.POSITIVE_INFINITY;
    let zMax = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < points.length; i += 1) {
      if (Number.isFinite(points[i])) {
        zMin = Math.min(zMin, points[i]);
        zMax = Math.max(zMax, points[i]);
      }
    }

    const levelStep = (zMax - zMin) / Math.max(1, levels - 1);
    const dx = (xRange[1] - xRange[0]) / (resolution - 1);
    const dy = (yRange[1] - yRange[0]) / (resolution - 1);

    const results: { geometry: THREE.BufferGeometry; color: string }[] = [];

    for (let li = 0; li < levels; li += 1) {
      const level = zMin + levelStep * li;
      const segments: Segment[] = [];

      for (let yi = 0; yi < resolution - 1; yi += 1) {
        for (let xi = 0; xi < resolution - 1; xi += 1) {
          const idx = yi * resolution + xi;

          const z00 = points[idx];
          const z10 = points[idx + 1];
          const z01 = points[idx + resolution];
          const z11 = points[idx + resolution + 1];

          const x = xRange[0] + xi * dx;
          const y = yRange[0] + yi * dy;

          const corners = [
            { x, y, z: z00 },
            { x: x + dx, y, z: z10 },
            { x: x + dx, y: y + dy, z: z11 },
            { x, y: y + dy, z: z01 },
          ];

          const crossings: THREE.Vector3[] = [];
          const edges: Array<[number, number]> = [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ];

          for (const [a, b] of edges) {
            const za = corners[a].z;
            const zb = corners[b].z;
            if ((za <= level && zb > level) || (za > level && zb <= level)) {
              crossings.push(
                interpolatePoint(
                  corners[a].x,
                  corners[a].y,
                  za,
                  corners[b].x,
                  corners[b].y,
                  zb,
                  level,
                ),
              );
            }
          }

          if (crossings.length === 2) {
            segments.push([crossings[0], crossings[1]]);
          }
        }
      }

      if (segments.length > 0) {
        const vertices = new Float32Array(segments.length * 2 * 3);
        segments.forEach((segment, index) => {
          const [a, b] = segment;
          const offset = index * 6;
          vertices[offset] = a.x;
          vertices[offset + 1] = a.y;
          vertices[offset + 2] = a.z;
          vertices[offset + 3] = b.x;
          vertices[offset + 4] = b.y;
          vertices[offset + 5] = b.z;
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const hue = 0.65 - (li / Math.max(1, levels - 1)) * 0.65;
        const color = new THREE.Color().setHSL(hue, 0.95, 0.58);

        results.push({ geometry, color: `#${color.getHexString()}` });
      }
    }

    return results;
  }, [levels, points, resolution, xRange, yRange]);

  return (
    <group>
      {contourLines.map((line, index) => (
        <lineSegments key={index} geometry={line.geometry}>
          <lineBasicMaterial color={line.color} linewidth={1} transparent opacity={0.85} />
        </lineSegments>
      ))}
    </group>
  );
}