import { Outlet, Route, Routes } from 'react-router-dom';
import { FloatingPanel } from './components/Layout/FloatingPanel';
import { Navbar } from './components/Layout/Navbar';
import { Sidebar } from './components/Layout/Sidebar';
import { useUIStore } from './store/uiStore';
import { ErrorLab } from './pages/ErrorLab';
import { Home } from './pages/Home';
import { Lab2D } from './pages/Lab2D';
import { Lab3D } from './pages/Lab3D';

function AppLayout() {
  const activePanel = useUIStore((state) => state.activePanel);
  const setActivePanel = useUIStore((state) => state.setActivePanel);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-void)] text-[var(--text-primary)]">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="relative flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <div className="absolute bottom-6 right-6 z-10 hidden lg:block">
          <FloatingPanel
            title="Panel System"
            subtitle="Phase 2 core shell"
            open={activePanel !== null}
            onClose={() => setActivePanel(null)}
          >
            <p className="text-sm text-[var(--text-dim)]">
              Floating analysis and control modules mount here.
            </p>
          </FloatingPanel>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="lab-2d" element={<Lab2D />} />
        <Route path="lab-3d" element={<Lab3D />} />
        <Route path="error-lab" element={<ErrorLab />} />
      </Route>
    </Routes>
  );
}

export default App;