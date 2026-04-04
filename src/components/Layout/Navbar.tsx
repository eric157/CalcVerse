import { ChangeEvent } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { CalcVerseLogo } from '../Logo/CalcVerseLogo';
import { useUIStore } from '../../store/uiStore';
import { useGraphStore } from '../../store/graphStore';
import { useCalcStore } from '../../store/calcStore';

const examplePalette = ['#7c3aed', '#06b6d4', '#f59e0b', '#10b981'];

type ExampleKey =
  | 'none'
  | 'gaussian-bell'
  | 'saddle-point'
  | 'ripple-wave'
  | 'traveling-wave'
  | 'butterfly-curve'
  | 'periodic-gaussian';

export function Navbar() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const setFunctions = useGraphStore((state) => state.setFunctions);
  const setSurfaceExpression = useCalcStore((state) => state.setSurfaceExpression);
  const setPlaying = useCalcStore((state) => state.setPlaying);
  const navigate = useNavigate();

  const applyExample = (event: ChangeEvent<HTMLSelectElement>) => {
    const key = event.target.value as ExampleKey;

    if (key === 'none') {
      return;
    }

    if (key === 'gaussian-bell') {
      setFunctions([{ id: 'f1', expression: 'exp(-x^2)', color: examplePalette[0], visible: true }]);
      setPlaying(false);
      navigate('/lab-2d');
    }

    if (key === 'saddle-point') {
      setSurfaceExpression('x^2 - y^2');
      setPlaying(false);
      navigate('/lab-3d');
    }

    if (key === 'ripple-wave') {
      setSurfaceExpression('sin(sqrt(x^2+y^2)) / sqrt(x^2+y^2)');
      setPlaying(true);
      navigate('/lab-3d');
    }

    if (key === 'traveling-wave') {
      setFunctions([{ id: 'f1', expression: 'sin(x - t)', color: examplePalette[1], visible: true }]);
      setPlaying(true);
      navigate('/lab-2d');
    }

    if (key === 'butterfly-curve') {
      setFunctions([
        {
          id: 'f1',
          expression: 'exp(cos(x)) - 2*cos(4x) - sin(x/12)^5',
          color: examplePalette[2],
          visible: true,
        },
      ]);
      setPlaying(false);
      navigate('/lab-2d');
    }

    if (key === 'periodic-gaussian') {
      setFunctions([{ id: 'f1', expression: 'sin(x)*exp(-x^2/10)', color: examplePalette[3], visible: true }]);
      setPlaying(false);
      navigate('/lab-2d');
    }

    event.target.value = 'none';
  };

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
          <select
            defaultValue="none"
            onChange={applyExample}
            className="rounded-md border border-[var(--border-dim)] bg-[var(--bg-surface)] px-2 py-1 text-xs text-[var(--text-primary)]"
          >
            <option value="none">Examples</option>
            <option value="gaussian-bell">Gaussian Bell</option>
            <option value="saddle-point">Saddle Point</option>
            <option value="ripple-wave">Ripple Wave</option>
            <option value="traveling-wave">Traveling Wave</option>
            <option value="butterfly-curve">Butterfly Curve</option>
            <option value="periodic-gaussian">Periodic Gaussian</option>
          </select>
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