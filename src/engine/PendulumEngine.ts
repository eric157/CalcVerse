export type PendulumParams = {
  lengths: number[];
  masses: number[];
  gravity: number;
  damping: number;
};

export type PendulumState = {
  theta: number[];
  omega: number[];
};

export type PendulumEnergy = {
  kinetic: number;
  potential: number;
  total: number;
};

export type Point2 = {
  x: number;
  y: number;
};

function cumulativeMasses(masses: number[]): number[] {
  const n = masses.length;
  const cumulative = new Array<number>(n).fill(0);
  let sum = 0;
  for (let i = n - 1; i >= 0; i -= 1) {
    sum += masses[i];
    cumulative[i] = sum;
  }
  return cumulative;
}

function gaussianSolve(matrix: number[][], rhs: number[]): number[] {
  const n = rhs.length;
  const a = matrix.map((row) => row.slice());
  const b = rhs.slice();

  for (let col = 0; col < n; col += 1) {
    let pivot = col;
    for (let row = col + 1; row < n; row += 1) {
      if (Math.abs(a[row][col]) > Math.abs(a[pivot][col])) {
        pivot = row;
      }
    }

    if (pivot !== col) {
      [a[col], a[pivot]] = [a[pivot], a[col]];
      [b[col], b[pivot]] = [b[pivot], b[col]];
    }

    const pivotValue = a[col][col];
    if (Math.abs(pivotValue) < 1e-9) {
      return new Array<number>(n).fill(0);
    }

    for (let row = col + 1; row < n; row += 1) {
      const factor = a[row][col] / pivotValue;
      for (let k = col; k < n; k += 1) {
        a[row][k] -= factor * a[col][k];
      }
      b[row] -= factor * b[col];
    }
  }

  const x = new Array<number>(n).fill(0);
  for (let row = n - 1; row >= 0; row -= 1) {
    let total = b[row];
    for (let col = row + 1; col < n; col += 1) {
      total -= a[row][col] * x[col];
    }
    x[row] = total / a[row][row];
  }

  return x;
}

function accelerations(state: PendulumState, params: PendulumParams): number[] {
  const n = state.theta.length;
  const massesBelow = cumulativeMasses(params.masses);
  const m = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  const rhs = new Array<number>(n).fill(0);

  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      const c = massesBelow[Math.max(i, j)];
      const li = params.lengths[i];
      const lj = params.lengths[j];
      const delta = state.theta[i] - state.theta[j];
      m[i][j] = c * li * lj * Math.cos(delta);
    }
  }

  for (let i = 0; i < n; i += 1) {
    let value = -massesBelow[i] * params.gravity * params.lengths[i] * Math.sin(state.theta[i]);
    for (let j = 0; j < n; j += 1) {
      const c = massesBelow[Math.max(i, j)];
      const li = params.lengths[i];
      const lj = params.lengths[j];
      const delta = state.theta[i] - state.theta[j];
      value -= c * li * lj * Math.sin(delta) * state.omega[j] * state.omega[j];
    }
    value -= params.damping * state.omega[i];
    rhs[i] = value;
  }

  return gaussianSolve(m, rhs);
}

function derive(state: PendulumState, params: PendulumParams): PendulumState {
  return {
    theta: state.omega.slice(),
    omega: accelerations(state, params),
  };
}

function combine(state: PendulumState, delta: PendulumState, scale: number): PendulumState {
  return {
    theta: state.theta.map((value, index) => value + delta.theta[index] * scale),
    omega: state.omega.map((value, index) => value + delta.omega[index] * scale),
  };
}

export function rk4Step(state: PendulumState, params: PendulumParams, dt: number): PendulumState {
  const k1 = derive(state, params);
  const k2 = derive(combine(state, k1, dt * 0.5), params);
  const k3 = derive(combine(state, k2, dt * 0.5), params);
  const k4 = derive(combine(state, k3, dt), params);

  return {
    theta: state.theta.map(
      (value, index) =>
        value +
        (dt / 6) *
          (k1.theta[index] + 2 * k2.theta[index] + 2 * k3.theta[index] + k4.theta[index]),
    ),
    omega: state.omega.map(
      (value, index) =>
        value +
        (dt / 6) *
          (k1.omega[index] + 2 * k2.omega[index] + 2 * k3.omega[index] + k4.omega[index]),
    ),
  };
}

export function createInitialPendulumState(links: number): PendulumState {
  return {
    theta: Array.from({ length: links }, (_, index) => Math.PI / 2 + index * 0.08),
    omega: Array.from({ length: links }, () => 0),
  };
}

export function pendulumPositions(state: PendulumState, lengths: number[]): Point2[] {
  const points: Point2[] = [{ x: 0, y: 0 }];
  let x = 0;
  let y = 0;

  for (let i = 0; i < state.theta.length; i += 1) {
    x += lengths[i] * Math.sin(state.theta[i]);
    y += lengths[i] * Math.cos(state.theta[i]);
    points.push({ x, y });
  }

  return points;
}

export function pendulumEnergy(state: PendulumState, params: PendulumParams): PendulumEnergy {
  const n = state.theta.length;
  const massesBelow = cumulativeMasses(params.masses);

  let kinetic = 0;
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      const c = massesBelow[Math.max(i, j)];
      const li = params.lengths[i];
      const lj = params.lengths[j];
      const delta = state.theta[i] - state.theta[j];
      kinetic += 0.5 * c * li * lj * Math.cos(delta) * state.omega[i] * state.omega[j];
    }
  }

  let potential = 0;
  for (let i = 0; i < n; i += 1) {
    potential -= massesBelow[i] * params.gravity * params.lengths[i] * Math.cos(state.theta[i]);
  }

  return {
    kinetic,
    potential,
    total: kinetic + potential,
  };
}