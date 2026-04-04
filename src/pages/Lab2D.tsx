import { DomainControls } from '../components/Graph2D/DomainControls';
import { GraphCanvas } from '../components/Graph2D/GraphCanvas';
import { MultiOverlay } from '../components/Graph2D/MultiOverlay';
import { SecantAnimation } from '../components/Calculus/SecantAnimation';
import { TangentLine } from '../components/Calculus/TangentLine';
import { useGraphStore } from '../store/graphStore';
import { useCalcStore } from '../store/calcStore';

export function Lab2D() {
  const functions = useGraphStore((state) => state.functions);
  const expression = functions[0]?.expression ?? 'sin(x)';
  const x0 = useCalcStore((state) => state.x0);

  return (
    <section className="mx-auto grid max-w-[1600px] gap-4 p-4 xl:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <GraphCanvas />
        <SecantAnimation expression={expression} />
      </div>
      <aside className="space-y-3">
        <DomainControls />
        <TangentLine expression={expression} x0={x0} />
        <MultiOverlay />
      </aside>
    </section>
  );
}