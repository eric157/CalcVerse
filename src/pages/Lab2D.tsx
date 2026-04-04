import { DomainControls } from '../components/Graph2D/DomainControls';
import { GraphCanvas } from '../components/Graph2D/GraphCanvas';
import { MultiOverlay } from '../components/Graph2D/MultiOverlay';

export function Lab2D() {
  return (
    <section className="mx-auto grid max-w-[1600px] gap-4 p-4 xl:grid-cols-[1fr_360px]">
      <GraphCanvas />
      <aside className="space-y-3">
        <DomainControls />
        <MultiOverlay />
      </aside>
    </section>
  );
}