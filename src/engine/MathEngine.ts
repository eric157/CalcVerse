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
  private readonly cache = new Map<string, MathNode>();
  private readonly namedFunctions = new Map<string, FunctionDefinition>();

  private parseExpression(expression: string): MathNode {
    const normalized = normalizeAbsolute(expression);
    const cached = this.cache.get(normalized);
    if (cached) {
      return cached;
    }
    const parsed = math.parse(normalized);
    this.cache.set(normalized, parsed);
    return parsed;
  }

  private resolveScope(inputScope: Scope): Scope {
    const scope: Scope = { ...inputScope };

    this.namedFunctions.forEach((definition, name) => {
      scope[name] = (...values: number[]) => {
        const localScope: Record<string, MathType> = {};
        definition.args.forEach((argName, index) => {
          localScope[argName] = values[index] ?? 0;
        });
        return Number(definition.compiled.evaluate(localScope));
      };
    });

    return scope;
  }

  public evaluate(expression: string, scope: Scope = {}): number {
    const definition = parseDefinition(expression);
    if (definition) {
      const parsed = this.parseExpression(definition.body);
      this.namedFunctions.set(definition.name, {
        args: definition.args,
        compiled: parsed.compile(),
      });
      return Number.NaN;
    }

    const parsed = this.parseExpression(expression);
    const resolvedScope = this.resolveScope(scope) as Record<string, MathType>;
    const result = parsed.compile().evaluate(resolvedScope);

    if (typeof result === 'number') {
      return result;
    }

    return Number(result);
  }

  public derivative(expression: string, variable: string): string {
    const normalized = normalizeAbsolute(expression);
    return math.derivative(normalized, variable).toString();
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public hasTimeVariable(expression: string): boolean {
    const node = this.parseExpression(expression);
    return node.filter((child) => child.type === 'SymbolNode' && 'name' in child && child.name === 't').length > 0;
  }
}

export const mathEngine = new MathEngine();
