import { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type GlowButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    tone?: 'violet' | 'cyan';
  }
>;

export function GlowButton({ tone = 'violet', className = '', children, ...props }: GlowButtonProps) {
  const glowClass = tone === 'violet' ? 'glow-violet' : 'glow-cyan';

  return (
    <button
      {...props}
      className={`rounded-md border border-[var(--border-glow)] bg-[var(--bg-panel)] px-3 py-1.5 text-sm text-[var(--text-primary)] transition hover:scale-[1.02] ${glowClass} ${className}`}
    >
      {children}
    </button>
  );
}