import { useMemo, useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);

  const validation = useMemo(() => validateExpression(expression), [expression]);

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
          <span className="text-xs">{validation.isValid ? 'OK' : 'ERR'}</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => onToggle(id)}
            className="rounded border border-[var(--border-dim)] px-2 py-1 hover:border-[var(--accent-cyan)]"
          >
            {visible ? 'Hide' : 'Show'}
          </button>
          <button
            type="button"
            onClick={() => onRemove(id)}
            className="rounded border border-[var(--border-dim)] px-2 py-1 hover:border-red-400"
          >
            Remove
          </button>
        </div>
      </div>

      <MathInput
        value={expression}
        onChange={(next) => onChange(id, next)}
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
