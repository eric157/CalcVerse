import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

type GradientArrowsProps = {
  points: Float32Array | null;
  gradients: Float32Array | null;
  resolution: number;
};

const _obj = new THREE.Object3D();
const _color = new THREE.Color();

export function GradientArrows({ points, gradients, resolution }: GradientArrowsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const samples = 14; // Arrows grid resolution

  const transforms = useMemo(() => {
    if (!points || !gradients || points.length === 0) return null;

    const data: Array<{ matrix: THREE.Matrix4; color: THREE.Color }> = [];
    const step = Math.floor(resolution / samples);
    const actualRes = resolution;

    for (let yi = 0; yi < samples; yi++) {
      for (let xi = 0; xi < samples; xi++) {
        const gridXi = xi * step;
        const gridYi = yi * step;
        const idx = gridYi * actualRes + gridXi;

        const x = -6 + (gridXi / (actualRes - 1)) * 12;
        const y = -6 + (gridYi / (actualRes - 1)) * 12;
        const z = points[idx];

        if (isNaN(z)) continue;

        const grIdx = idx * 2;
        const fx = gradients[grIdx];
        const fy = gradients[grIdx + 1];

        const dfdx = fx;
        const dfdy = fy;
        const magnitude = Math.hypot(dfdx, dfdy);
        const direction = new THREE.Vector3(dfdx, 0, dfdy);

        if (direction.lengthSq() > 1e-7) {
          direction.normalize();
        } else {
          direction.set(0, 1, 0); // Point up if zero gradient
        }

        // Setup Object3D for transform
        _obj.position.set(x, z + 0.1, y);
        _obj.lookAt(x + dfdx, z + 1, y + dfdy); // Point in dir of gradient
        const scale = Math.min(0.6, 0.15 + magnitude * 0.08);
        _obj.scale.set(scale, scale, scale * 1.5);
        _obj.updateMatrix();

        const color = _color.setHSL(0.62 - Math.min(1, magnitude / 3) * 0.62, 1, 0.58).clone();
        data.push({ matrix: _obj.matrix.clone(), color });
      }
    }
    return data;
  }, [points, gradients, resolution]);

  useEffect(() => {
    if (meshRef.current && transforms) {
      transforms.forEach((t, i) => {
        meshRef.current?.setMatrixAt(i, t.matrix);
        meshRef.current?.setColorAt(i, t.color);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
      if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
      meshRef.current.count = transforms.length;
    } else if (meshRef.current) {
      meshRef.current.count = 0;
    }
  }, [transforms]);

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, samples * samples]}>
      <coneGeometry args={[0.08, 0.35, 6]} />
      <meshStandardMaterial vertexColors />
    </instancedMesh>
  );
}