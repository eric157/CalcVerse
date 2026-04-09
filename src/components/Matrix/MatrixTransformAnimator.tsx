import { useMemo, useState } from 'react';
import { useAnimationFrame } from '../../hooks/useAnimationFrame';
import {
  Matrix2,
  applyMatrix,
  eigenvalues2x2,
  interpolateWithIdentity,
  matrixDeterminant,
  matrixTrace,
} from '../../engine/MatrixEngine';
import { SliderInput } from '../UI/SliderInput';
import { GlowButton } from '../UI/GlowButton';

type MatrixPreset = {
  label: string;
  matrix: Matrix2;
};

const presets: MatrixPreset[] = [
  { label: 'Rotation 45°', matrix: { a11: 0.7071, a12: -0.7071, a21: 0.7071, a22: 0.7071 } },
  { label: 'Scale X2 Y0.5', matrix: { a11: 2, a12: 0, a21: 0, a22: 0.5 } },
  { label: 'Shear X', matrix: { a11: 1, a12: 1.2, a21: 0, a22: 1 } },
  { label: 'Reflection X', matrix: { a11: 1, a12: 0, a21: 0, a22: -1 } },
];

function toSvg(point: [number, number], centerX: number, centerY: number, scale: number): [number, number] {
  return [centerX + point[0] * scale, centerY - point[1] * scale];
}

export function MatrixTransformAnimator() {
  const [matrix, setMatrix] = useState<Matrix2>({ a11: 1.2, a12: 0.5, a21: -0.3, a22: 1.1 });
  const [playing, setPlaying] = useState(true);
  const [blend, setBlend] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [speed, setSpeed] = useState(0.5);
  const [probe, setProbe] = useState<[number, number]>([1, 1]);

  useAnimationFrame(playing, (deltaSeconds) => {
    const next = blend + direction * deltaSeconds * speed;
    if (next >= 1) {
      setBlend(1);
      setDirection(-1);
      return;
    }
    if (next <= 0) {
      setBlend(0);
      setDirection(1);
      return;
    }
    setBlend(next);
  });

  const currentMatrix = useMemo(() => interpolateWithIdentity(matrix, blend), [blend, matrix]);

  const { determinant, trace, eigen, transformedProbe } = useMemo(() => {
    const determinant = matrixDeterminant(currentMatrix);
    const trace = matrixTrace(currentMatrix);
    const eigen = eigenvalues2x2(currentMatrix);
    const transformedProbe = applyMatrix(currentMatrix, probe);
    return { determinant, trace, eigen, transformedProbe };
  }, [currentMatrix, probe]);

  const gridSegments = useMemo(() => {
    const lines: Array<[[number, number], [number, number]]> = [];
    for (let value = -3; value <= 3; value += 1) {
      lines.push([
        applyMatrix(currentMatrix, [value, -3]),
        applyMatrix(currentMatrix, [value, 3]),
      ]);
      lines.push([
        applyMatrix(currentMatrix, [-3, value]),
        applyMatrix(currentMatrix, [3, value]),
      ]);
    }
    return lines;
  }, [currentMatrix]);

  const squarePoints = useMemo(() => {
    const points: [number, number][] = [
      applyMatrix(currentMatrix, [0, 0]),
      applyMatrix(currentMatrix, [1, 0]),
      applyMatrix(currentMatrix, [1, 1]),
      applyMatrix(currentMatrix, [0, 1]),
    ];
    return points;
  }, [currentMatrix]);

  const basis1 = applyMatrix(currentMatrix, [1, 0]);
  const basis2 = applyMatrix(currentMatrix, [0, 1]);

  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <div className="rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-panel)] p-3">
        <svg viewBox="0 0 700 520" className="h-[540px] w-full rounded-xl bg-[#090914]">
          <defs>
            <marker id="arrow-head" markerWidth="8" markerHeight="8" refX="5" refY="2.5" orient="auto">
              <polygon points="0 0, 6 2.5, 0 5" fill="#f8fafc" />
            </marker>
          </defs>

          {gridSegments.map((segment, index) => {
            const [x1, y1] = toSvg(segment[0], 350, 260, 65);
            const [x2, y2] = toSvg(segment[1], 350, 260, 65);
            return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1f2937" strokeWidth={1} />;
          })}

          <line x1={0} y1={260} x2={700} y2={260} stroke="#334155" strokeWidth={1.2} />
          <line x1={350} y1={0} x2={350} y2={520} stroke="#334155" strokeWidth={1.2} />

          <polygon
            points={squarePoints.map((point) => toSvg(point, 350, 260, 65).join(',')).join(' ')}
            fill="rgba(6,182,212,0.18)"
            stroke="#22d3ee"
            strokeWidth={2}
          />

          {(() => {
            const [x, y] = toSvg([0, 0], 350, 260, 65);
            const [bx1, by1] = toSvg(basis1, 350, 260, 65);
            const [bx2, by2] = toSvg(basis2, 350, 260, 65);
            const [px, py] = toSvg(transformedProbe, 350, 260, 65);

            return (
              <>
                <line x1={x} y1={y} x2={bx1} y2={by1} stroke="#a78bfa" strokeWidth={2.5} markerEnd="url(#arrow-head)" />
                <line x1={x} y1={y} x2={bx2} y2={by2} stroke="#f59e0b" strokeWidth={2.5} markerEnd="url(#arrow-head)" />
                <circle cx={px} cy={py} r={6} fill="#f43f5e" />
              </>
            );
          })()}
        </svg>
      </div>

      <aside className="space-y-3 rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-panel)] p-3">
        <h2 className="text-lg font-semibold">Matrix Transformation Animation</h2>
        <p className="text-xs text-[var(--text-dim)]">
          Interpolates from identity matrix to your matrix and back while calculating determinant, trace, eigenvalues, and
          transformed vectors.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <SliderInput label="a11" value={matrix.a11} min={-3} max={3} step={0.05} onChange={(value) => setMatrix((prev) => ({ ...prev, a11: value }))} />
          <SliderInput label="a12" value={matrix.a12} min={-3} max={3} step={0.05} onChange={(value) => setMatrix((prev) => ({ ...prev, a12: value }))} />
          <SliderInput label="a21" value={matrix.a21} min={-3} max={3} step={0.05} onChange={(value) => setMatrix((prev) => ({ ...prev, a21: value }))} />
          <SliderInput label="a22" value={matrix.a22} min={-3} max={3} step={0.05} onChange={(value) => setMatrix((prev) => ({ ...prev, a22: value }))} />
        </div>

        <SliderInput label="animation speed" value={speed} min={0.1} max={2} step={0.05} onChange={setSpeed} />

        <div className="flex flex-wrap gap-2">
          <GlowButton tone="violet" onClick={() => setPlaying((value) => !value)}>
            {playing ? 'Pause' : 'Play'}
          </GlowButton>
          <GlowButton tone="cyan" onClick={() => setBlend(0)}>
            Reset Blend
          </GlowButton>
        </div>

        <div className="rounded-lg border border-[var(--border-dim)] bg-[var(--bg-surface)] p-2">
          <p className="font-mono text-xs text-[var(--text-dim)]">blend t = {blend.toFixed(3)}</p>
          <p className="font-mono text-xs text-[var(--text-dim)]">det(A) = {determinant.toFixed(4)}</p>
          <p className="font-mono text-xs text-[var(--text-dim)]">trace(A) = {trace.toFixed(4)}</p>
          <p className="font-mono text-xs text-[var(--text-dim)]">area scale = |det(A)| = {Math.abs(determinant).toFixed(4)}</p>
          <p className="font-mono text-xs text-[var(--text-dim)]">orientation = {determinant >= 0 ? 'preserved' : 'flipped'}</p>
          {eigen.kind === 'real' ? (
            <p className="font-mono text-xs text-[var(--text-dim)]">eigenvalues = {eigen.lambda1.toFixed(4)}, {eigen.lambda2.toFixed(4)}</p>
          ) : (
            <p className="font-mono text-xs text-[var(--text-dim)]">eigenvalues = {eigen.real.toFixed(4)} ± {eigen.imaginary.toFixed(4)}i</p>
          )}
          <p className="font-mono text-xs text-[var(--text-dim)]">A·[{probe[0].toFixed(2)}, {probe[1].toFixed(2)}] = [{transformedProbe[0].toFixed(3)}, {transformedProbe[1].toFixed(3)}]</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <SliderInput label="probe x" value={probe[0]} min={-2} max={2} step={0.05} onChange={(value) => setProbe(([_, y]) => [value, y])} />
          <SliderInput label="probe y" value={probe[1]} min={-2} max={2} step={0.05} onChange={(value) => setProbe(([x]) => [x, value])} />
        </div>

        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="rounded-md border border-[var(--border-dim)] px-2 py-1 text-xs hover:border-[var(--accent-cyan)]"
              onClick={() => setMatrix(preset.matrix)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </aside>
    </section>
  );
}