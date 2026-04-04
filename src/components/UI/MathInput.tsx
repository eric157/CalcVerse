import katex from 'katex';
import { useMemo } from 'react';

type MathInputProps = {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  isValid: boolean;
  error?: string;
  onSubmitCombo?: () => void;
};

export function MathInput({
  value,
  onChange,
  placeholder,
  isValid,
  error,
  onSubmitCombo,
}: MathInputProps) {
  const renderedLatex = useMemo(() => {
    if (!value.trim()) {
      return '';
    }

    try {
      return katex.renderToString(value, {
        throwOnError: false,
        displayMode: false,
        output: 'html',
      });
    } catch {
      return '';
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        onKeyDown={(event) => {
          if ((event.ctrlKey || event.shiftKey) && event.key === 'Enter') {
            event.preventDefault();
            onSubmitCombo?.();
          }
        }}
        className={`w-full rounded-md border bg-[var(--bg-surface)] px-3 py-2 font-mono text-sm text-[var(--text-primary)] outline-none ${
          isValid ? 'border-emerald-500/60' : 'border-red-500/60'
        }`}
      />
      <div className="rounded-md border border-[var(--border-dim)] bg-black/20 px-2 py-1.5">
        {renderedLatex ? (
          <div className="min-h-6 text-sm" dangerouslySetInnerHTML={{ __html: renderedLatex }} />
        ) : (
          <p className="text-xs text-[var(--text-dim)]">LaTeX preview</p>
        )}
      </div>
      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  );
}