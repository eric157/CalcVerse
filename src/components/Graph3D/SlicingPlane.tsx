import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

type SlicingPlaneProps = {
  points: Float32Array | null;
  resolution: number;
  axis: 'xz' | 'yz';
  offset: number;
  xRange?: [number, number];
  yRange?: [number, number];
  onSectionData?: (curve: Array<{ x: number; z: number }>) => void;
};

export function SlicingPlane({
  points,
  resolution,
  axis,
  offset,
  xRange = [-6, 6],
  yRange = [-6, 6],
  onSectionData,
}: SlicingPlaneProps) {
  const { curvePositions, sectionCurve } = useMemo(() => {
    if (!points || points.length === 0) {
      return { curvePositions: null as Float32Array | null, sectionCurve: [] as Array<{ x: number; z: number }> };
    }

    const dx = (xRange[1] - xRange[0]) / (resolution - 1);
    const dy = (yRange[1] - yRange[0]) / (resolution - 1);
    const tolerance = axis === 'xz' ? dy * 0.6 : dx * 0.6;

    const samples: Array<{ x: number; z: number }> = [];

    for (let yi = 0; yi < resolution; yi += 1) {
      for (let xi = 0; xi < resolution; xi += 1) {
        const x = xRange[0] + xi * dx;
        const y = yRange[0] + yi * dy;
        const z = points[yi * resolution + xi];
        const distance = axis === 'xz' ? Math.abs(y - offset) : Math.abs(x - offset);
        if (distance < tolerance && Number.isFinite(z)) {
          samples.push({ x: axis === 'xz' ? x : y, z });
        }
      }
    }

    const sorted = samples.sort((a, b) => a.x - b.x);
    const positionArray = new Float32Array(sorted.length * 3);

    sorted.forEach((sample, index) => {
      const write = index * 3;
      if (axis === 'xz') {
        positionArray[write] = sample.x;
        positionArray[write + 1] = sample.z;
        positionArray[write + 2] = offset;
      } else {
        positionArray[write] = offset;
        positionArray[write + 1] = sample.z;
        positionArray[write + 2] = sample.x;
      }
    });

    return {
      curvePositions: sorted.length > 1 ? positionArray : null,
      sectionCurve: sorted,
    };
  }, [axis, offset, points, resolution, xRange, yRange]);

  useEffect(() => {
    onSectionData?.(sectionCurve);
  }, [onSectionData, sectionCurve]);

  const planeArgs: [number, number] = axis === 'xz' ? [xRange[1] - xRange[0], 10] : [yRange[1] - yRange[0], 10];

  return (
    <group>
      <mesh rotation={axis === 'xz' ? [-Math.PI / 2, 0, 0] : [0, Math.PI / 2, 0]} position={axis === 'xz' ? [0, 0, offset] : [offset, 0, 0]}>
        <planeGeometry args={planeArgs} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {curvePositions ? (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={curvePositions.length / 3}
              array={curvePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ffffff" linewidth={2} />
        </line>
      ) : null}
    </group>
  );
}