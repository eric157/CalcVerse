import { create, all, MathJsStatic } from 'mathjs';
import { mathEngine, Scope } from './MathEngine';

const math = create(all) as MathJsStatic;

export type DifferenceMethod = 'forward' | 'backward' | 'central';

export type DerivativeResult = {
  numerical: number;
  symbolic: string;
  error: number;
};

function numericalDifference(
  expression: string,
  x: number,
  h: number,
  method: DifferenceMethod,
  scope: Scope,
): number {
  const baseScope = { ...scope };

  switch (method) {
    case 'forward':
      return (
        (mathEngine.evaluate(expression, { ...baseScope, x: x + h }) -
          mathEngine.evaluate(expression, { ...baseScope, x })) /
        h
      );
    case 'backward':
      return (
        (mathEngine.evaluate(expression, { ...baseScope, x }) -
          mathEngine.evaluate(expression, { ...baseScope, x: x - h })) /
        h
      );
    case 'central':
      return (
        (mathEngine.evaluate(expression, { ...baseScope, x: x + h }) -
          mathEngine.evaluate(expression, { ...baseScope, x: x - h })) /
        (2 * h)
      );
    default:
      return Number.NaN;
  }
}

export function differentiate(
  expression: string,
  x: number,
  h = 1e-5,
  method: DifferenceMethod = 'central',
  scope: Scope = {},
): DerivativeResult {
  const symbolic = mathEngine.derivative(expression, 'x');
  const numerical = numericalDifference(expression, x, h, method, scope);

  let exact = Number.NaN;
  try {
    const exactValue = math.evaluate(symbolic, { ...scope, x });
    exact = typeof exactValue === 'number' ? exactValue : Number(exactValue);
  } catch {
    exact = Number.NaN;
  }

  return {
    numerical,
    symbolic,
    error: Number.isFinite(exact) ? Math.abs(numerical - exact) : 0,
  };
}

export function partialDerivative(
  expression: string,
  variable: 'x' | 'y',
): string {
  return mathEngine.derivative(expression, variable);
}
