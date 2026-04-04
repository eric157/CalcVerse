import { useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Plot from 'react-plotly.js';
import type { Data } from 'plotly.js';
import { AnimController } from '../components/AnimationEngine/AnimController';
import { ContourProjection } from '../components/Graph3D/ContourProjection';
import { GradientArrows } from '../components/Graph3D/GradientArrows';
import { SlicingPlane } from '../components/Graph3D/SlicingPlane';
import { Surface3D } from '../components/Graph3D/Surface3D';
import { mathEngine } from '../engine/MathEngine';
import { useOrbitCamera } from '../hooks/useOrbitCamera';
import { useCalcStore } from '../store/calcStore';

export function Lab3D() {
  const expression = useCalcStore((state) => state.surfaceExpression);
  const setExpression = useCalcStore((state) => state.setSurfaceExpression);
  const resolution = useCalcStore((state) => state.resolution3D);
  const setResolution = useCalcStore((state) => state.setResolution3D);
  const wireframe = useCalcStore((state) => state.wireframe);
  const toggleWireframe = useCalcStore((state) => state.toggleWireframe);
  const showGradient = useCalcStore((state) => state.showGradientArrows);
  const toggleGradient = useCalcStore((state) => state.toggleGradientArrows);
  const showContours = useCalcStore((state) => state.showContours);
  const toggleContours = useCalcStore((state) => state.toggleContours);
  const showSlicing = useCalcStore((state) => state.showSlicing);
  const toggleSlicing = useCalcStore((state) => state.toggleSlicing);
  const sliceAxis = useCalcStore((state) => state.sliceAxis);
  const setSliceAxis = useCalcStore((state) => state.setSliceAxis);
  const sliceOffset = useCalcStore((state) => state.sliceOffset);
  const setSliceOffset = useCalcStore((state) => state.setSliceOffset);
  const t = useCalcStore((state) => state.t);

  const [gridPoints, setGridPoints] = useState<Float32Array | null>(null);
  const [gridRes, setGridRes] = useState(resolution);
  const [sectionCurve, setSectionCurve] = useState<Array<{ x: number; z: number }>>([]);

  const orbit = useOrbitCamera();
  const hasTemporal = mathEngine.hasTimeVariable(expression);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'g') {
        toggleGradient();
      }
      if (event.key.toLowerCase() === 'w') {
        toggleWireframe();
      }
      if (event.key.toLowerCase() === 'c') {
        toggleContours();
      }
      if (event.key.toLowerCase() === 's') {
        toggleSlicing();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggleContours, toggleGradient, toggleSlicing, toggleWireframe]);

  const sectionPlotData = useMemo<Data[]>(
    () => [
      {
        type: 'scatter',
        mode: 'lines' as const,
        x: sectionCurve.map((point) => point.x),
        y: sectionCurve.map((point) => point.z),
        line: { color: '#ffffff', width: 2 },
        hovertemplate: 'x=%{x:.3f}<br>z=%{y:.3f}<extra></extra>',
      },
    ],
    [sectionCurve],
  );

  return (
    <section className="mx-auto grid max-w-[1700px] gap-4 p-4 xl:grid-cols-[1fr_360px]">
      <div className="relative h-[78vh] min-h-[540px] overflow-hidden rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-panel)]">
        <Canvas camera={{ position: [5.5, 5, 7.2], fov: 50 }}>
          <ambientLight intensity={0.36} />
          <directionalLight position={[6, 8, 3]} intensity={0.92} />
          <directionalLight position={[-6, 5, -4]} intensity={0.5} />

          <Surface3D
            expression={expression}
            resolution={resolution}
            time={hasTemporal ? t : 0}
            wireframe={wireframe}
            onGridData={(points, usedResolution) => {
              setGridPoints(points);
              setGridRes(usedResolution);
            }}
          />

          {showGradient ? <GradientArrows expression={expression} /> : null}
          {showContours ? <ContourProjection points={gridPoints} resolution={gridRes} /> : null}
          {showSlicing ? (
            <SlicingPlane
              points={gridPoints}
              resolution={gridRes}
              axis={sliceAxis}
              offset={sliceOffset}
              onSectionData={setSectionCurve}
            />
          ) : null}

          <OrbitControls
            makeDefault
            enablePan={orbit.enablePan}
            minDistance={orbit.minDistance}
            maxDistance={orbit.maxDistance}
            maxPolarAngle={orbit.maxPolarAngle}
          />
        </Canvas>

        <div className="absolute bottom-3 right-3 h-[180px] w-[280px] rounded-lg border border-[var(--border-dim)] bg-[#07070fdd] p-2">
          <p className="mb-1 text-xs text-[var(--text-dim)]">Cross-section inset</p>
          <Plot
            data={sectionPlotData}
            layout={{
              paper_bgcolor: '#07070f',
              plot_bgcolor: '#07070f',
              margin: { l: 28, r: 6, t: 6, b: 24 },
              xaxis: { color: '#64748b', gridcolor: '#1a1a2e' },
              yaxis: { color: '#64748b', gridcolor: '#1a1a2e' },
            }}
            config={{ responsive: true, displayModeBar: false }}
            useResizeHandler
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      <aside className="space-y-3 rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-panel)] p-3">
        <h1 className="text-lg font-semibold">3D Surface Explorer</h1>
        <AnimController active={hasTemporal} />

        <label className="block space-y-1 text-sm">
          <span className="text-xs text-[var(--text-dim)]">f(x, y)</span>
          <input
            value={expression}
            onChange={(event) => setExpression(event.target.value)}
            className="w-full rounded border border-[var(--border-dim)] bg-[var(--bg-surface)] px-3 py-2 font-mono text-sm"
          />
        </label>

        <label className="block space-y-1 text-sm">
          <span className="text-xs text-[var(--text-dim)]">Resolution ({resolution})</span>
          <input
            type="range"
            min={32}
            max={256}
            step={32}
            value={resolution}
            onChange={(event) => setResolution(Number(event.target.value))}
            className="w-full"
          />
        </label>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button type="button" onClick={toggleWireframe} className="rounded border border-[var(--border-dim)] px-2 py-1">
            Wireframe: {wireframe ? 'On' : 'Off'}
          </button>
          <button type="button" onClick={toggleGradient} className="rounded border border-[var(--border-dim)] px-2 py-1">
            Gradients: {showGradient ? 'On' : 'Off'}
          </button>
          <button type="button" onClick={toggleContours} className="rounded border border-[var(--border-dim)] px-2 py-1">
            Contours: {showContours ? 'On' : 'Off'}
          </button>
          <button type="button" onClick={toggleSlicing} className="rounded border border-[var(--border-dim)] px-2 py-1">
            Slicing: {showSlicing ? 'On' : 'Off'}
          </button>
        </div>

        <div className="rounded-lg border border-[var(--border-dim)] p-2">
          <p className="mb-2 text-xs text-[var(--text-dim)]">Slicing Plane</p>
          <div className="mb-2 flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => setSliceAxis('xz')}
              className={`rounded border px-2 py-1 ${sliceAxis === 'xz' ? 'border-[var(--accent-cyan)]' : 'border-[var(--border-dim)]'}`}
            >
              XZ
            </button>
            <button
              type="button"
              onClick={() => setSliceAxis('yz')}
              className={`rounded border px-2 py-1 ${sliceAxis === 'yz' ? 'border-[var(--accent-cyan)]' : 'border-[var(--border-dim)]'}`}
            >
              YZ
            </button>
          </div>
          <input
            type="range"
            min={-6}
            max={6}
            step={0.05}
            value={sliceOffset}
            onChange={(event) => setSliceOffset(Number(event.target.value))}
            className="w-full"
          />
          <p className="mt-1 font-mono text-xs text-[var(--text-dim)]">offset = {sliceOffset.toFixed(2)}</p>
        </div>

        <p className="text-xs text-[var(--text-dim)]">Keyboard: G gradients, W wireframe, C contours, S slicing.</p>
      </aside>
    </section>
  );
}