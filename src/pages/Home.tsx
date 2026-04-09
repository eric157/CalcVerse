import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalcVerseLogo } from '../components/Logo/CalcVerseLogo';
import { GlowButton } from '../components/UI/GlowButton';

const cards = [
  {
    title: '2D Calculus Lab',
    desc: 'Trace derivatives, secants, and integrals in real time.',
    to: '/lab-2d',
  },
  {
    title: '3D Surface Explorer',
    desc: 'Rotate scalar fields, inspect gradients, and slice planes.',
    to: '/lab-3d',
  },
  {
    title: 'Error Analytics',
    desc: 'See truncation and floating-point cancellation interact.',
    to: '/error-lab',
  },
  {
    title: 'Matrix Lab',
    desc: 'Animate 2x2 transforms with determinant and eigenvalue calculations.',
    to: '/matrix-lab',
  },
  {
    title: 'N-Link Pendulum',
    desc: 'Simulate chaotic coupled pendulums with live energy metrics.',
    to: '/pendulum-lab',
  },
];

export function Home() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-10 rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-panel)]/80 p-6 glow-cyan"
      >
        <CalcVerseLogo animated size={48} variant="wordmark" />
        <p className="mt-3 text-sm text-[var(--text-dim)]">Make math feel alive.</p>
      </motion.div>

      <div className="grid w-full max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card, index) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-panel)] p-4"
          >
            <h2 className="text-lg font-semibold">{card.title}</h2>
            <p className="mt-2 text-sm text-[var(--text-dim)]">{card.desc}</p>
            <Link
              to={card.to}
              className="mt-4 inline-flex rounded-md border border-[var(--border-dim)] px-3 py-1.5 text-sm transition hover:border-[var(--accent-violet)]"
            >
              Open
            </Link>
          </motion.article>
        ))}
      </div>

      <Link to="/lab-2d" className="mt-8 inline-flex pulse-glow">
        <GlowButton tone="violet">Enter the Universe</GlowButton>
      </Link>
    </section>
  );
}
