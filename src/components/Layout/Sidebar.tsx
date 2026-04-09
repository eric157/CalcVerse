import { NavLink } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';

const links = [
  { to: '/lab-2d', title: '2D Calculus Lab', desc: 'Functions, tangents, integrals' },
  { to: '/lab-3d', title: '3D Surface Explorer', desc: 'Surfaces, vectors, slices' },
  { to: '/matrix-lab', title: 'Matrix Lab', desc: 'Linear transformations and eigen-analysis' },
  { to: '/pendulum-lab', title: 'N-Link Pendulum', desc: 'Chaotic coupled dynamics + energy' },
  { to: '/error-lab', title: 'Error Analytics', desc: 'Numerical stability insights' },
];

export function Sidebar() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toast = useUIStore((state) => state.toast);

  return (
    <aside
      className={`h-full border-r border-[var(--border-dim)] bg-[var(--bg-surface)] transition-all duration-300 ${
        sidebarOpen ? 'w-72 p-4' : 'w-0 overflow-hidden p-0'
      }`}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="block rounded-xl border border-[var(--border-dim)] bg-[var(--bg-panel)] p-3 transition hover:border-[var(--border-glow)] hover:shadow-[var(--glow-violet)]"
            >
              <p className="font-semibold text-[var(--text-primary)]">{link.title}</p>
              <p className="mt-1 text-xs text-[var(--text-dim)]">{link.desc}</p>
            </NavLink>
          ))}
        </div>

        {toast && sidebarOpen && (
          <div className="rounded-xl border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/5 p-4 animate-in fade-in slide-in-from-bottom-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--accent-cyan)]">Context Insight</h4>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">{toast}</p>
          </div>
        )}
      </div>
    </aside>
  );
}
