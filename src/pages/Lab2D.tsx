import { DomainControls } from '../components/Graph2D/DomainControls';
import { GraphCanvas } from '../components/Graph2D/GraphCanvas';
import { MultiOverlay } from '../components/Graph2D/MultiOverlay';
import { AnimController } from '../components/AnimationEngine/AnimController';
import { IntegralShader } from '../components/Calculus/IntegralShader';
import { RiemannSums } from '../components/Calculus/RiemannSums';
import { SecantAnimation } from '../components/Calculus/SecantAnimation';
import { TangentLine } from '../components/Calculus/TangentLine';
import { mathEngine } from '../engine/MathEngine';
import { useCalcStore } from '../store/calcStore';
import { useGraphStore } from '../store/graphStore';

export function Lab2D() {
  const functions = useGraphStore((state) => state.functions);
  const expression = functions[0]?.expression ?? 'sin(x)';
  const x0 = useCalcStore((state) => state.x0);
  const n = useCalcStore((state) => state.riemannN);
  const bounds = useCalcStore((state) => state.integralBounds);
  const t = useCalcStore((state) => state.t);

  const hasTemporal = functions.some((fn) => mathEngine.hasTimeVariable(fn.expression));
  const activeTime = hasTemporal ? t : 0;

  return (
    <section className="mx-auto grid max-w-[1600px] gap-4 p-4 xl:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <GraphCanvas time={activeTime} />
        <SecantAnimation expression={expression} />
        <RiemannSums expression={expression} />
      </div>
      <aside className="space-y-3">
        <AnimController active={hasTemporal} />
        <DomainControls />
        <TangentLine expression={expression} x0={x0} />
        <IntegralShader expression={expression} bounds={bounds} n={n} method="midpoint" />
        <MultiOverlay />
      </aside>
    </section>
  );
}