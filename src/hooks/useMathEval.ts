import { useMemo } from 'react';
import { differentiate } from '../engine/Differentiator';
import { mathEngine } from '../engine/MathEngine';
import { validateExpression } from '../engine/FunctionParser';

export function useMathEval(expression: string, x: number) {
  return useMemo(() => {
    const validation = validateExpression(expression);
    if (!validation.isValid) {
      return {
        value: Number.NaN,
        derivative: null,
        valid: false,
        error: validation.errorMessage,
      };
    }

    const value = mathEngine.evaluate(validation.normalized, { x });
    const derivative = differentiate(validation.normalized, x, 1e-5, 'central');

    return {
      value,
      derivative,
      valid: true,
      error: undefined,
    };
  }, [expression, x]);
}