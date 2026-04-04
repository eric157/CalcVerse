import { MathNode, create, all, MathJsStatic, EvalFunction, MathType } from 'mathjs';

export type Scope = Record<string, number | ((...args: number[]) => number)>;

type FunctionDefinition = {
  args: string[];
  compiled: EvalFunction;
};

const math = create(all) as MathJsStatic;

function normalizeAbsolute(expression: string): string {
  const absPattern = /\|([^|]+)\|/g;
  let normalized = expression;
  let previous = '';

  while (normalized !== previous) {
    previous = normalized;
    normalized = normalized.replace(absPattern, 'abs($1)');
  }

  return normalized;
}

function parseDefinition(expression: string): { name: string; args: string[]; body: string } | null {
  const trimmed = expression.trim();
  const match = /^([a-zA-Z]\w*)\s*\(([^)]*)\)\s*=\s*(.+)$/.exec(trimmed);
  if (!match) {
    return null;
  }

  const [, name, rawArgs, body] = match;
  const args = rawArgs
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  return { name, args, body };
}

export class MathEngine {
  private readonly nodeCache = new Map<string, MathNode>();
  private readonly compilationCache = new Map<string, EvalFunction>();
  private readonly namedFunctions = new Map<string, FunctionDefinition>();

  private getCompiledExpression(expression: string): EvalFunction | null {
    const normalized = normalizeAbsolute(expression.trim());
    if (!normalized) return null;

    const cached = this.compilationCache.get(normalized);
    if (cached) return cached;

    try {
      const parsed = math.parse(normalized);
      const compiled = parsed.compile();
      this.compilationCache.set(normalized, compiled);
      this.nodeCache.set(normalized, parsed);
      return compiled;
    } catch {
      return null;
    }
  }

  private parseExpression(expression: string): MathNode | null {
    const normalized = normalizeAbsolute(expression.trim());
    if (!normalized) return null;

    const cached = this.nodeCache.get(normalized);
    if (cached) return cached;

    try {
      const parsed = math.parse(normalized);
      this.nodeCache.set(normalized, parsed);
      return parsed;
    } catch {
      return null;
    }
  }

  private resolveScope(inputScope: Scope): Scope {
    const scope: Scope = { ...inputScope };

    this.namedFunctions.forEach((definition, name) => {
      scope[name] = (...values: number[]) => {
        const localScope: Record<string, MathType> = {};
        definition.args.forEach((argName, index) => {
          localScope[argName] = values[index] ?? 0;
        });
        try {
          return Number(definition.compiled.evaluate(localScope));
        } catch {
          return Number.NaN;
        }
      };
    });

    return scope;
  }

  public evaluate(expression: string, scope: Scope = {}): number {
    if (!expression.trim()) {
      return Number.NaN;
    }

    const definition = parseDefinition(expression);
    if (definition) {
      const parsed = this.parseExpression(definition.body);
      if (parsed) {
        this.namedFunctions.set(definition.name, {
          args: definition.args,
          compiled: parsed.compile(),
        });
      }
      return Number.NaN;
    }

    const compiled = this.getCompiledExpression(expression);
    if (!compiled) {
      return Number.NaN;
    }

    try {
      const resolvedScope = this.resolveScope(scope) as Record<string, MathType>;
      const result = compiled.evaluate(resolvedScope);

      if (typeof result === 'number') {
        return result;
      }

      return Number(result);
    } catch {
      return Number.NaN;
    }
  }

  public derivative(expression: string, variable: string): string {
    const normalized = normalizeAbsolute(expression.trim());
    if (!normalized) {
      return '0';
    }
    try {
      return math.derivative(normalized, variable).toString();
    } catch {
      return '0';
    }
  }

  public clearCache(): void {
    this.nodeCache.clear();
    this.compilationCache.clear();
  }

  public hasTimeVariable(expression: string): boolean {
    const node = this.parseExpression(expression);
    if (!node) {
      return false;
    }
    return node.filter((child) => child.type === 'SymbolNode' && 'name' in child && child.name === 't').length > 0;
  }
}

export const mathEngine = new MathEngine();
