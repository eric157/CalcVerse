import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalcVerseLogo } from '../components/Logo/CalcVerseLogo';

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
];

export function Home() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-10 rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-panel)]/80 p-6 shadow-[var(--glow-cyan)]"
      >
        <CalcVerseLogo animated size={48} variant="wordmark" />
        <p className="mt-3 text-sm text-[var(--text-dim)]">Make math feel alive.</p>
      </motion.div>

      <div className="grid w-full max-w-5xl gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
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

      <Link
        to="/lab-2d"
        className="mt-8 rounded-lg border border-[var(--border-glow)] bg-[var(--bg-panel)] px-5 py-2 text-sm font-semibold shadow-[var(--glow-violet)] transition hover:scale-[1.02]"
      >
        Enter the Universe
      </Link>
    </section>
  );
}