import { useUIStore } from '../../store/uiStore';

const shortcuts = [
  ['Space', 'Play / Pause animation'],
  ['R', 'Reset animation to t=0'],
  ['G', 'Toggle gradient arrows'],
  ['W', 'Toggle wireframe'],
  ['C', 'Toggle contour projection'],
  ['S', 'Toggle slicing plane'],
  ['D', 'Toggle derivative overlay'],
  ['I', 'Toggle integral shading'],
  ['Tab', 'Cycle function inputs'],
  ['Escape', 'Close active panel'],
  ['Ctrl+Z', 'Undo last function edit'],
  ['Ctrl+Enter', 'Add new function'],
  ['F', 'Fullscreen canvas'],
  ['?', 'Open shortcut modal'],
] as const;

export function KeyboardShortcuts() {
  const isOpen = useUIStore((state) => state.isShortcutModalOpen);
  const setOpen = useUIStore((state) => state.setShortcutModalOpen);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
      <div
        className="w-full max-w-xl rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-panel)] p-4 shadow-[var(--glow-violet)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded border border-[var(--border-dim)] px-2 py-1 text-xs"
          >
            Close
          </button>
        </div>
        <div className="grid gap-1 text-sm">
          {shortcuts.map(([key, action]) => (
            <div key={key} className="grid grid-cols-[130px_1fr] rounded-md border border-[var(--border-dim)] px-2 py-1">
              <span className="font-mono text-[var(--accent-cyan)]">{key}</span>
              <span className="text-[var(--text-dim)]">{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}