import { useEffect, useMemo, useState } from 'react';
import { validateExpression } from '../../engine/FunctionParser';
import { MathInput } from '../UI/MathInput';

type FunctionInputProps = {
  id: string;
  expression: string;
  color: string;
  selected?: boolean;
  onChange: (id: string, expression: string) => void;
  onAdd: () => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  visible: boolean;
};

const suggestions = [
  'sin(x)',
  'cos(x)',
  'exp(-x^2)',
  'sqrt(x)',
  'log(x, 10)',
  'floor(x)',
  'abs(x)',
  'sin(x - t)',
];

export function FunctionInput({
  id,
  expression,
  color,
  selected = false,
  onChange,
  onAdd,
  onToggle,
  onRemove,
  visible,
}: FunctionInputProps) {
  const [localValue, setLocalValue] = useState(expression);
  const [menuOpen, setMenuOpen] = useState(false);

  // Sync internal state if the prop changes from outside (e.g., suggestions or undo)
  useEffect(() => {
    setLocalValue(expression);
  }, [expression]);

  // Debounced update to the store
  useEffect(() => {
    if (localValue === expression) return;
    const timer = setTimeout(() => {
      onChange(id, localValue);
    }, 240); // Standard human-speed debounce
    return () => clearTimeout(timer);
  }, [id, localValue, onChange, expression]);

  const validation = useMemo(() => validateExpression(localValue), [localValue]);

  return (
    <div
      className={`rounded-xl border bg-[var(--bg-panel)] p-3 ${
        selected ? 'border-[var(--accent-cyan)] shadow-[var(--glow-cyan)]' : 'border-[var(--border-dim)]'
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: color }} />
          <span className="text-xs text-[var(--text-dim)]">{id.toUpperCase()}</span>
          <span className="text-xs font-medium space-x-1">
            <span className={validation.isValid ? 'text-emerald-400' : 'text-red-400'}>
              {validation.isValid ? '✓' : '✗'}
            </span>
            <span className="text-xs text-[var(--text-dim)]">{validation.isValid ? 'READY' : 'INVALID'}</span>
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => onToggle(id)}
            className="rounded border border-[var(--border-dim)] px-2 py-1 hover:border-[var(--accent-cyan)] transition-colors"
          >
            {visible ? 'Hide' : 'Show'}
          </button>
          <button
            type="button"
            onClick={() => onRemove(id)}
            className="rounded border border-[var(--border-dim)] px-2 py-1 hover:border-red-400 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>

      <MathInput
        value={localValue}
        onChange={setLocalValue}
        placeholder="Enter f(x)..."
        isValid={validation.isValid}
        error={validation.errorMessage}
        onSubmitCombo={onAdd}
      />

      <div className="mt-2">
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-xs text-[var(--accent-cyan)]"
        >
          Autocomplete suggestions
        </button>
        {menuOpen ? (
          <div className="mt-1 flex flex-wrap gap-1">
            {suggestions.map((suggestion) => (
              <button
                type="button"
                key={suggestion}
                onClick={() => onChange(id, suggestion)}
                className="rounded border border-[var(--border-dim)] px-2 py-1 text-xs hover:border-[var(--accent-violet)]"
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
