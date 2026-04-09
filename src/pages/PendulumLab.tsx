import { NLinkPendulumAnimator } from '../components/Pendulum/NLinkPendulumAnimator';

export function PendulumLab() {
  return (
    <section className="mx-auto max-w-[1700px] p-4">
      <h1 className="mb-1 text-2xl font-semibold">N-Link Pendulum Lab</h1>
      <p className="mb-4 text-sm text-[var(--text-dim)]">
        Simulate and calculate coupled pendulum dynamics with RK4 integration, energy tracking, and trajectory trails.
      </p>
      <NLinkPendulumAnimator />
    </section>
  );
}