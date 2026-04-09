import { MatrixTransformAnimator } from '../components/Matrix/MatrixTransformAnimator';

export function MatrixLab() {
  return (
    <section className="mx-auto max-w-[1700px] p-4">
      <h1 className="mb-1 text-2xl font-semibold">Matrix Transformation Lab</h1>
      <p className="mb-4 text-sm text-[var(--text-dim)]">
        Visualize 2x2 linear transforms, animate identity-to-matrix blending, and compute determinant/trace/eigenvalues.
      </p>
      <MatrixTransformAnimator />
    </section>
  );
}