type SliderInputProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
};

export function SliderInput({ label, value, min, max, step = 1, onChange }: SliderInputProps) {
  return (
    <label className="block space-y-1 text-xs">
      <span className="text-[var(--text-dim)]">
        {label}: <span className="font-mono text-[var(--text-primary)]">{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full"
      />
    </label>
  );
}