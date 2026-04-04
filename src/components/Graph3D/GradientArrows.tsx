import { useMemo } from 'react';
import * as THREE from 'three';
import { mathEngine } from '../../engine/MathEngine';

type GradientArrowsProps = {
  expression: string;
  xRange?: [number, number];
  yRange?: [number, number];
  samples?: number;
};

export function GradientArrows({
  expression,
  xRange = [-6, 6],
  yRange = [-6, 6],
  samples = 16,
}: GradientArrowsProps) {
  const arrows = useMemo(() => {
    const helpers: THREE.ArrowHelper[] = [];
    const dx = (xRange[1] - xRange[0]) / (samples - 1);
    const dy = (yRange[1] - yRange[0]) / (samples - 1);
    const h = 0.03;

    for (let yi = 0; yi < samples; yi += 1) {
      for (let xi = 0; xi < samples; xi += 1) {
        const x = xRange[0] + xi * dx;
        const y = yRange[0] + yi * dy;
        const z = mathEngine.evaluate(expression, { x, y });

        const dfdx =
          (mathEngine.evaluate(expression, { x: x + h, y }) -
            mathEngine.evaluate(expression, { x: x - h, y })) /
          (2 * h);
        const dfdy =
          (mathEngine.evaluate(expression, { x, y: y + h }) -
            mathEngine.evaluate(expression, { x, y: y - h })) /
          (2 * h);

        const magnitude = Math.hypot(dfdx, dfdy);
        const scaled = Math.min(0.7, 0.12 + magnitude * 0.1);

        const direction = new THREE.Vector3(dfdx, 0, dfdy);
        if (direction.lengthSq() > 1e-7) {
          direction.normalize();
        } else {
          direction.set(1, 0, 0);
        }

        const color = new THREE.Color().setHSL(0.62 - Math.min(1, magnitude / 3) * 0.62, 1, 0.58);
        const helper = new THREE.ArrowHelper(
          direction,
          new THREE.Vector3(x, z + 0.03, y),
          scaled,
          color.getHex(),
          0.1,
          0.08,
        );
        helpers.push(helper);
      }
    }

    return helpers;
  }, [expression, samples, xRange, yRange]);

  return (
    <group>
      {arrows.map((arrow, index) => (
        <primitive key={index} object={arrow} />
      ))}
    </group>
  );
}