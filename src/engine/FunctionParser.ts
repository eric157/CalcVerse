import { create, all, MathJsStatic } from 'mathjs';

const math = create(all) as MathJsStatic;

function normalizeAbsolute(expression: string): string {
  let normalized = expression;
  const absPattern = /\|([^|]+)\|/g;
  while (absPattern.test(normalized)) {
    normalized = normalized.replace(absPattern, 'abs($1)');
  }
  return normalized;
}

export type ParseValidation = {
  isValid: boolean;
  normalized: string;
  errorMessage?: string;
};

export function validateExpression(expression: string): ParseValidation {
  const normalized = normalizeAbsolute(expression.trim());

  if (!normalized) {
    return {
      isValid: false,
      normalized,
      errorMessage: 'Expression is empty.',
    };
  }

  try {
    math.parse(normalized);
    return {
      isValid: true,
      normalized,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to parse expression.';
    return {
      isValid: false,
      normalized,
      errorMessage: message,
    };
  }
}