export type Matrix2 = {
  a11: number;
  a12: number;
  a21: number;
  a22: number;
};

export type EigenInfo =
  | {
      kind: 'real';
      lambda1: number;
      lambda2: number;
    }
  | {
      kind: 'complex';
      real: number;
      imaginary: number;
    };

export function matrixDeterminant(matrix: Matrix2): number {
  return matrix.a11 * matrix.a22 - matrix.a12 * matrix.a21;
}

export function matrixTrace(matrix: Matrix2): number {
  return matrix.a11 + matrix.a22;
}

export function eigenvalues2x2(matrix: Matrix2): EigenInfo {
  const trace = matrixTrace(matrix);
  const determinant = matrixDeterminant(matrix);
  const discriminant = trace * trace - 4 * determinant;

  if (discriminant >= 0) {
    const root = Math.sqrt(discriminant);
    return {
      kind: 'real',
      lambda1: (trace + root) / 2,
      lambda2: (trace - root) / 2,
    };
  }

  const imag = Math.sqrt(-discriminant) / 2;
  return {
    kind: 'complex',
    real: trace / 2,
    imaginary: imag,
  };
}

export function applyMatrix(matrix: Matrix2, vector: [number, number]): [number, number] {
  const [x, y] = vector;
  return [matrix.a11 * x + matrix.a12 * y, matrix.a21 * x + matrix.a22 * y];
}

export function interpolateWithIdentity(matrix: Matrix2, t: number): Matrix2 {
  return {
    a11: 1 + (matrix.a11 - 1) * t,
    a12: matrix.a12 * t,
    a21: matrix.a21 * t,
    a22: 1 + (matrix.a22 - 1) * t,
  };
}