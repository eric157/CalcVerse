import { mathEngine } from './MathEngine';

export type IntegrationMethod = 'left' | 'right' | 'midpoint' | 'trapezoid' | 'simpson';

export type Rectangle = {
  xLeft: number;
  xRight: number;
  height: number;
  area: number;
  method: IntegrationMethod;
};

export type IntegrationResult = {
  value: number;
  rectangles: Rectangle[];
  error: number;
};

function evaluate(expression: string, x: number, t = 0): number {
  return mathEngine.evaluate(expression, { x, t });
}

function leftRiemann(expression: string, a: number, b: number, n: number, t = 0): Rectangle[] {
  const dx = (b - a) / n;
  const rectangles: Rectangle[] = [];

  for (let i = 0; i < n; i += 1) {
    const xLeft = a + i * dx;
    const xRight = xLeft + dx;
    const height = evaluate(expression, xLeft, t);
    rectangles.push({ xLeft, xRight, height, area: height * dx, method: 'left' });
  }

  return rectangles;
}

function rightRiemann(expression: string, a: number, b: number, n: number, t = 0): Rectangle[] {
  const dx = (b - a) / n;
  const rectangles: Rectangle[] = [];

  for (let i = 0; i < n; i += 1) {
    const xLeft = a + i * dx;
    const xRight = xLeft + dx;
    const height = evaluate(expression, xRight, t);
    rectangles.push({ xLeft, xRight, height, area: height * dx, method: 'right' });
  }

  return rectangles;
}

function midpointRiemann(expression: string, a: number, b: number, n: number, t = 0): Rectangle[] {
  const dx = (b - a) / n;
  const rectangles: Rectangle[] = [];

  for (let i = 0; i < n; i += 1) {
    const xLeft = a + i * dx;
    const xRight = xLeft + dx;
    const mid = (xLeft + xRight) / 2;
    const height = evaluate(expression, mid, t);
    rectangles.push({ xLeft, xRight, height, area: height * dx, method: 'midpoint' });
  }

  return rectangles;
}

function trapezoidRule(expression: string, a: number, b: number, n: number, t = 0): Rectangle[] {
  const dx = (b - a) / n;
  const rectangles: Rectangle[] = [];

  for (let i = 0; i < n; i += 1) {
    const xLeft = a + i * dx;
    const xRight = xLeft + dx;
    const yLeft = evaluate(expression, xLeft, t);
    const yRight = evaluate(expression, xRight, t);
    const area = ((yLeft + yRight) / 2) * dx;
    rectangles.push({ xLeft, xRight, height: (yLeft + yRight) / 2, area, method: 'trapezoid' });
  }

  return rectangles;
}

function simpsonRule(expression: string, a: number, b: number, n: number, t = 0): Rectangle[] {
  const evenN = n % 2 === 0 ? n : n + 1;
  const dx = (b - a) / evenN;
  const rectangles: Rectangle[] = [];

  for (let i = 0; i < evenN; i += 2) {
    const xLeft = a + i * dx;
    const xMid = xLeft + dx;
    const xRight = xLeft + 2 * dx;
    const yLeft = evaluate(expression, xLeft, t);
    const yMid = evaluate(expression, xMid, t);
    const yRight = evaluate(expression, xRight, t);
    const area = (dx / 3) * (yLeft + 4 * yMid + yRight);
    rectangles.push({ xLeft, xRight, height: yMid, area, method: 'simpson' });
  }

  return rectangles;
}

export function integrate(
  expression: string,
  a: number,
  b: number,
  n: number,
  method: IntegrationMethod,
  t = 0,
): IntegrationResult {
  const safeN = Math.max(1, Math.floor(n));

  const rectangles =
    method === 'left'
      ? leftRiemann(expression, a, b, safeN, t)
      : method === 'right'
        ? rightRiemann(expression, a, b, safeN, t)
        : method === 'midpoint'
          ? midpointRiemann(expression, a, b, safeN, t)
          : method === 'trapezoid'
            ? trapezoidRule(expression, a, b, safeN, t)
            : simpsonRule(expression, a, b, safeN, t);

  const value = rectangles.reduce((acc, rectangle) => acc + rectangle.area, 0);

  return {
    value,
    rectangles,
    error: 0,
  };
}