import { useMemo, useRef, useState } from 'react';
import { useAnimationFrame } from '../../hooks/useAnimationFrame';
import {
  PendulumParams,
  PendulumState,
  createInitialPendulumState,
  pendulumEnergy,
  pendulumPositions,
  rk4Step,
} from '../../engine/PendulumEngine';
import { SliderInput } from '../UI/SliderInput';
import { GlowButton } from '../UI/GlowButton';

const palette = ['#7c3aed', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6'];

function createUniformParams(links: number, gravity: number, damping: number): PendulumParams {
  return {
    lengths: Array.from({ length: links }, () => 1),
    masses: Array.from({ length: links }, () => 1),
    gravity,
    damping,
  };
}

export function NLinkPendulumAnimator() {
  const [links, setLinks] = useState(4);
  const [playing, setPlaying] = useState(true);
  const [gravity, setGravity] = useState(9.81);
  const [damping, setDamping] = useState(0.03);
  const [dt, setDt] = useState(0.01);
  const [speed, setSpeed] = useState(1);
  const [state, setState] = useState<PendulumState>(() => createInitialPendulumState(4));
  const [trail, setTrail] = useState<Array<{ x: number; y: number }>>([]);

  const stateRef = useRef(state);
  stateRef.current = state;

  const params = useMemo(() => createUniformParams(links, gravity, damping), [damping, gravity, links]);

  useAnimationFrame(playing, (deltaSeconds) => {
    const steps = Math.max(1, Math.round((deltaSeconds * speed) / dt));
    let next = stateRef.current;
    for (let i = 0; i < steps; i += 1) {
      next = rk4Step(next, params, dt);
    }
    stateRef.current = next;
    setState(next);

    const positions = pendulumPositions(next, params.lengths);
    const bob = positions[positions.length - 1];
    setTrail((prev) => [...prev.slice(-380), { x: bob.x, y: bob.y }]);
  });

  const positions = useMemo(() => pendulumPositions(state, params.lengths), [params.lengths, state]);
  const energy = useMemo(() => pendulumEnergy(state, params), [params, state]);

  const resetWithLinks = (value: number) => {
    setLinks(value);
    const initial = createInitialPendulumState(value);
    setState(initial);
    stateRef.current = initial;
    setTrail([]);
  };

  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <div className="rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-panel)] p-3">
        <svg viewBox="0 0 760 560" className="h-[560px] w-full rounded-xl bg-[#090914]">
          <defs>
            <linearGradient id="trail-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          <line x1={380} y1={32} x2={380} y2={46} stroke="#94a3b8" strokeWidth={3} />
          <circle cx={380} cy={32} r={4} fill="#e2e8f0" />

          {trail.length > 1 ? (
            <polyline
              points={trail.map((point) => `${380 + point.x * 68},${32 + point.y * 68}`).join(' ')}
              fill="none"
              stroke="url(#trail-gradient)"
              strokeWidth={1.8}
            />
          ) : null}

          {positions.slice(1).map((point, index) => {
            const start = positions[index];
            const x1 = 380 + start.x * 68;
            const y1 = 32 + start.y * 68;
            const x2 = 380 + point.x * 68;
            const y2 = 32 + point.y * 68;
            const color = palette[index % palette.length];

            return (
              <g key={index}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2.4} />
                <circle cx={x2} cy={y2} r={7} fill={color} />
              </g>
            );
          })}
        </svg>
      </div>

      <aside className="space-y-3 rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-panel)] p-3">
        <h2 className="text-lg font-semibold">N-Link Pendulum</h2>
        <p className="text-xs text-[var(--text-dim)]">
          RK4 simulation of an n-link pendulum chain using coupled equations of motion and full energy calculation.
        </p>

        <SliderInput label="links" value={links} min={2} max={8} step={1} onChange={(value) => resetWithLinks(Math.round(value))} />
        <SliderInput label="gravity" value={gravity} min={1} max={20} step={0.05} onChange={setGravity} />
        <SliderInput label="damping" value={damping} min={0} max={0.2} step={0.001} onChange={setDamping} />
        <SliderInput label="time step" value={dt} min={0.002} max={0.03} step={0.001} onChange={setDt} />
        <SliderInput label="speed" value={speed} min={0.2} max={4} step={0.1} onChange={setSpeed} />

        <div className="flex flex-wrap gap-2">
          <GlowButton tone="violet" onClick={() => setPlaying((value) => !value)}>
            {playing ? 'Pause' : 'Play'}
          </GlowButton>
          <GlowButton
            tone="cyan"
            onClick={() => {
              const initial = createInitialPendulumState(links);
              setState(initial);
              stateRef.current = initial;
              setTrail([]);
            }}
          >
            Reset
          </GlowButton>
          <GlowButton
            tone="cyan"
            onClick={() => {
              const seeded = createInitialPendulumState(links);
              const randomized: PendulumState = {
                theta: seeded.theta.map((theta, index) => theta + Math.sin(index * 1.37 + Date.now() * 0.001) * 0.32),
                omega: seeded.omega.map(() => 0),
              };
              setState(randomized);
              stateRef.current = randomized;
              setTrail([]);
            }}
          >
            Randomize
          </GlowButton>
        </div>

        <div className="rounded-lg border border-[var(--border-dim)] bg-[var(--bg-surface)] p-2">
          <p className="font-mono text-xs text-[var(--text-dim)]">Kinetic = {energy.kinetic.toFixed(5)}</p>
          <p className="font-mono text-xs text-[var(--text-dim)]">Potential = {energy.potential.toFixed(5)}</p>
          <p className="font-mono text-xs text-[var(--text-dim)]">Total Energy = {energy.total.toFixed(5)}</p>
          <p className="font-mono text-xs text-[var(--text-dim)]">theta₁ = {state.theta[0].toFixed(4)} rad</p>
          <p className="font-mono text-xs text-[var(--text-dim)]">omega₁ = {state.omega[0].toFixed(4)} rad/s</p>
          <p className="font-mono text-xs text-[var(--text-dim)]">thetaₙ = {state.theta[state.theta.length - 1].toFixed(4)} rad</p>
          <p className="font-mono text-xs text-[var(--text-dim)]">omegaₙ = {state.omega[state.omega.length - 1].toFixed(4)} rad/s</p>
        </div>
      </aside>
    </section>
  );
}