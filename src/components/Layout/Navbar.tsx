import { NavLink } from 'react-router-dom';
import { CalcVerseLogo } from '../Logo/CalcVerseLogo';
import { useUIStore } from '../../store/uiStore';

export function Navbar() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <header className="border-b border-[var(--border-dim)] bg-[var(--bg-panel)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1800px] items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleSidebar}
            className="rounded-md border border-[var(--border-dim)] px-2 py-1 text-xs text-[var(--text-dim)] transition hover:border-[var(--accent-cyan)] hover:text-[var(--text-primary)]"
          >
            Menu
          </button>
          <NavLink to="/" className="inline-flex items-center">
            <CalcVerseLogo size={40} variant="wordmark" />
          </NavLink>
        </div>

        <nav className="flex items-center gap-2 text-sm">
          <NavLink className="nav-pill" to="/lab-2d">
            2D Lab
          </NavLink>
          <NavLink className="nav-pill" to="/lab-3d">
            3D Lab
          </NavLink>
          <NavLink className="nav-pill" to="/error-lab">
            Error Lab
          </NavLink>
        </nav>
      </div>
    </header>
  );
}