import { CalcVerseLogo } from './components/Logo/CalcVerseLogo';

function App() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <CalcVerseLogo size={48} variant="wordmark" />
        <p style={{ marginTop: '1.5rem', color: '#94a3b8' }}>Mathematical Universe Engine initializing…</p>
      </div>
    </main>
  );
}

export default App;