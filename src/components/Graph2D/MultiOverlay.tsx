import { FunctionInput } from './FunctionInput';
import { useGraphStore } from '../../store/graphStore';

export function MultiOverlay() {
  const functions = useGraphStore((state) => state.functions);
  const selectedIndex = useGraphStore((state) => state.selectedIndex);
  const addFunction = useGraphStore((state) => state.addFunction);
  const updateFunction = useGraphStore((state) => state.updateFunction);
  const toggleFunction = useGraphStore((state) => state.toggleFunction);
  const removeFunction = useGraphStore((state) => state.removeFunction);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Functions</h3>
        <button
          type="button"
          onClick={addFunction}
          className="rounded-md border border-[var(--border-glow)] px-2 py-1 text-xs hover:shadow-[var(--glow-violet)]"
        >
          Add function
        </button>
      </div>

      {functions.map((fn) => (
        <FunctionInput
          key={fn.id}
          id={fn.id}
          expression={fn.expression}
          color={fn.color}
          selected={functions[selectedIndex]?.id === fn.id}
          visible={fn.visible}
          onChange={updateFunction}
          onAdd={addFunction}
          onToggle={toggleFunction}
          onRemove={removeFunction}
        />
      ))}
    </div>
  );
}
