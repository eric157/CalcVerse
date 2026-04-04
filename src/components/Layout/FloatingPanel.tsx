import { PropsWithChildren } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FloatingPanelProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  open: boolean;
  onClose: () => void;
}>;

export function FloatingPanel({ title, subtitle, open, onClose, children }: FloatingPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          className="w-full max-w-md rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-panel)]/95 p-4 shadow-[var(--glow-violet)]"
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-[var(--text-primary)]">{title}</h2>
              {subtitle ? <p className="text-xs text-[var(--text-dim)]">{subtitle}</p> : null}
            </div>
            <button
              type="button"
              className="rounded-md border border-[var(--border-dim)] px-2 py-1 text-xs text-[var(--text-dim)] hover:border-[var(--accent-cyan)]"
              onClick={onClose}
            >
              Close
            </button>
          </div>
          {children}
        </motion.section>
      )}
    </AnimatePresence>
  );
}