import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { FloatingPanel } from './components/Layout/FloatingPanel';
import { Navbar } from './components/Layout/Navbar';
import { Sidebar } from './components/Layout/Sidebar';
import { KeyboardShortcuts } from './components/UI/KeyboardShortcuts';
import { Toast } from './components/UI/Toast';
import { useKeyboard } from './hooks/useKeyboard';
import { ErrorLab } from './pages/ErrorLab';
import { Home } from './pages/Home';
import { Lab2D } from './pages/Lab2D';
import { Lab3D } from './pages/Lab3D';
import { useUIStore } from './store/uiStore';
import { ErrorBoundary } from './components/UI/ErrorBoundary';

function AppLayout() {
  const activePanel = useUIStore((state) => state.activePanel);
  const setActivePanel = useUIStore((state) => state.setActivePanel);
  const location = useLocation();

  useKeyboard();
  const toast = useUIStore((state) => state.toast);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');

    if (redirect) {
      window.history.replaceState({}, '', redirect);
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-void)] text-[var(--text-primary)]">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="relative flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <div className="absolute bottom-6 right-6 z-10 hidden lg:block">
          <FloatingPanel
            title="Panel System"
            subtitle="Phase shell"
            open={activePanel !== null}
            onClose={() => setActivePanel(null)}
          >
            <p className="text-sm text-[var(--text-dim)]">
              Floating analysis and control modules mount here.
            </p>
          </FloatingPanel>
        </div>
      </div>
      <KeyboardShortcuts />
      <Toast message={toast} />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="lab-2d" element={<Lab2D />} />
          <Route path="lab-3d" element={<Lab3D />} />
          <Route path="error-lab" element={<ErrorLab />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;