import { useEffect, useState, useMemo } from 'react';
import { validateExpression } from '../../engine/FunctionParser';
import { MathInput } from '../UI/MathInput';

type SurfaceInputProps = {
  expression: string;
  onChange: (next: string) => void;
};

const suggestions = [
  'sin(x)*cos(y)',
  'x^2 - y^2',
  'sin(sqrt(x^2+y^2)) / sqrt(x^2+y^2)',
  'exp(-x^2-y^2)',
  'sin(x*y)',
  'sin(x - t)*cos(y)',
  'abs(x) + abs(y)',
];

export function SurfaceInput({ expression, onChange }: SurfaceInputProps): JSX.Element {
  const [localValue, setLocalValue] = useState(expression);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLocalValue(expression);
  }, [expression]);

  useEffect(() => {
    if (localValue === expression) return;
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 280);
    return () => clearTimeout(timer);
  }, [localValue, onChange, expression]);

  const validation = useMemo(() => validateExpression(localValue), [localValue]);

  return (
    <div className="space-y-3 rounded-xl border border-[var(--border-dim)] bg-black/30 p-3 transition-colors hover:border-[var(--accent-cyan)]/50 shadow-[var(--glow-cyan)]">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--accent-cyan)]">Surface Input f(x, y)</h3>
        <span className={`text-[10px] font-bold ${validation.isValid ? 'text-emerald-400' : 'text-red-400'}`}>
          {validation.isValid ? 'VALID' : 'INVALID'}
        </span>
      </div>

      <MathInput
        value={localValue}
        onChange={setLocalValue}
        placeholder="Enter f(x, y)..."
        isValid={validation.isValid}
        error={validation.errorMessage}
      />

      <div>
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-[10px] text-[var(--accent-cyan)] hover:underline"
        >
          Surface samples
        </button>
        {menuOpen ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {suggestions.map((suggestion) => (
              <button
                type="button"
                key={suggestion}
                onClick={() => onChange(suggestion)}
                className="rounded border border-[var(--border-dim)] bg-[var(--bg-surface)] px-2 py-1 text-[10px] text-[var(--text-dim)] hover:border-[var(--accent-cyan)] hover:text-[var(--text-primary)] transition"
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
