import { AnimatePresence, motion } from 'framer-motion';

type ToastProps = {
  message: string | null;
};

export function Toast({ message }: ToastProps) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-md border border-[var(--border-dim)] bg-[var(--bg-panel)] px-4 py-2 text-xs text-[var(--text-primary)] shadow-[var(--glow-cyan)]"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}