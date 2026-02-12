
export type TokenType =
    | 'NUMBER' | 'STRING' | 'BOOLEAN'
    | 'IDENTIFIER' | 'CELL_REF' | 'RANGE_REF'
    | 'PLUS' | 'MINUS' | 'MULTIPLY' | 'DIVIDE'
    | 'EQ' | 'NEQ' | 'GT' | 'LT' | 'GTE' | 'LTE'
    | 'LPAREN' | 'RPAREN' | 'COMMA' | 'EOF';

export interface Token {
    type: TokenType;
    value: string;
    position: number;
}

export type ASTNode =
    | { type: 'Literal', value: any }
    | { type: 'Identifier', name: string }
    | { type: 'CellReference', sheet: string, cell: string }
    | { type: 'RangeReference', sheet: string, start: string, end: string }
    | { type: 'BinaryOp', left: ASTNode, operator: string, right: ASTNode }
    | { type: 'FunctionCall', name: string, args: ASTNode[] };

export class ExpressionParser {
    private tokens: Token[] = [];
    private current: number = 0;

    tokenize(input: string): Token[] {
        const tokens: Token[] = [];
        let i = 0;

        while (i < input.length) {
            const char = input[i];

            if (/\s/.test(char)) {
                i++;
                continue;
            }

            if (/[0-9]/.test(char)) {
                let value = '';
                while (i < input.length && /[0-9.]/.test(input[i])) {
                    value += input[i];
                    i++;
                }
                tokens.push({ type: 'NUMBER', value, position: i - value.length });
                continue;
            }

            if (char === '"' || char === "'") {
                const quote = char;
                let value = '';
                i++; // skip open quote
                while (i < input.length && input[i] !== quote) {
                    value += input[i];
                    i++;
                }
                i++; // skip close quote
                tokens.push({ type: 'STRING', value, position: i - value.length - 2 });
                continue;
            }

            // Cell Ref (Sheet!Cell) or Range (Sheet!Cell:Sheet!Cell)
            // Actually, let's catch identifiers/cell-refs here.
            // Standard identifier: [A-Za-z_][A-Za-z0-9_]*
            // Sheet names might be complex, but for this DSL we assume standard naming or simple identifiers for now.
            // E.g. A03!L20 or just SUM
            if (/[A-Za-z0-9_]/.test(char)) {
                let value = '';
                const start = i;
                while (i < input.length && /[A-Za-z0-9_!]/.test(input[i])) {
                    value += input[i];
                    i++;
                }

                // check for Range: Sheet!Cell:Sheet!Cell ?
                // Or simple range: A1:B2 (within same sheet?)
                // The prompt says "A03!L20".
                // Let's handle generic identifiers and refine in parser or more complex regex.

                // If it contains '!', it's likely a cell ref.
                if (value.includes('!')) {
                    // Check if it's a range?
                    if (i < input.length && input[i] === ':') {
                        // It is potentially a range if followed by another cell ref
                        // We will handle specific range parsing logic in the parser or improved tokenizer?
                        // Let's keep it simple: identifiers can contain '!' for now, distinct ranges with ':' as token?
                        // If we have A03!L20, it's one token?
                    }
                    tokens.push({ type: 'CELL_REF', value, position: start });
                } else if (value === 'TRUE' || value === 'FALSE') {
                    tokens.push({ type: 'BOOLEAN', value, position: start });
                } else {
                    tokens.push({ type: 'IDENTIFIER', value, position: start });
                }
                continue;
            }

            switch (char) {
                case '+': tokens.push({ type: 'PLUS', value: '+', position: i }); break;
                case '-': tokens.push({ type: 'MINUS', value: '-', position: i }); break;
                case '*': tokens.push({ type: 'MULTIPLY', value: '*', position: i }); break;
                case '/': tokens.push({ type: 'DIVIDE', value: '/', position: i }); break;
                case '(': tokens.push({ type: 'LPAREN', value: '(', position: i }); break;
                case ')': tokens.push({ type: 'RPAREN', value: ')', position: i }); break;
                case ',': tokens.push({ type: 'COMMA', value: ',', position: i }); break; // argument separator
                case ':':
                    // Range operator?
                    // If previous was CELL_REF, this might be a range.
                    // Let's treat ':' as a token.
                    // implementation detail: simplified logic
                    break;
                case '=':
                    if (input[i + 1] === '=') { tokens.push({ type: 'EQ', value: '==', position: i }); i++; }
                    break;
                case '!':
                    if (input[i + 1] === '=') { tokens.push({ type: 'NEQ', value: '!=', position: i }); i++; }
                    break;
                case '>':
                    if (input[i + 1] === '=') { tokens.push({ type: 'GTE', value: '>=', position: i }); i++; }
                    else { tokens.push({ type: 'GT', value: '>', position: i }); }
                    break;
                case '<':
                    if (input[i + 1] === '=') { tokens.push({ type: 'LTE', value: '<=', position: i }); i++; }
                    else { tokens.push({ type: 'LT', value: '<', position: i }); }
                    break;
                default:
                    throw new Error(`Unknown character: ${char} at position ${i}`);
            }
            i++;
        }
        tokens.push({ type: 'EOF', value: '', position: i });
        return tokens;
    }

    parse(input: string): ASTNode {
        this.tokens = this.tokenize(input);
        this.current = 0;
        return this.parseExpression();
    }

    private parseExpression(): ASTNode {
        return this.parseComparison();
    }

    private parseComparison(): ASTNode {
        let left = this.parseAdditive();

        while (this.match('EQ', 'NEQ', 'GT', 'LT', 'GTE', 'LTE')) {
            const operator = this.previous().value;
            const right = this.parseAdditive();
            left = { type: 'BinaryOp', left, operator, right };
        }
        return left;
    }

    private parseAdditive(): ASTNode {
        let left = this.parseMultiplicative();

        while (this.match('PLUS', 'MINUS')) {
            const operator = this.previous().value;
            const right = this.parseMultiplicative();
            left = { type: 'BinaryOp', left, operator, right };
        }
        return left;
    }

    private parseMultiplicative(): ASTNode {
        let left = this.parsePrimary();

        while (this.match('MULTIPLY', 'DIVIDE')) {
            const operator = this.previous().value;
            const right = this.parsePrimary();
            left = { type: 'BinaryOp', left, operator, right };
        }
        return left;
    }

    private parsePrimary(): ASTNode {
        if (this.match('NUMBER')) return { type: 'Literal', value: parseFloat(this.previous().value) };
        if (this.match('STRING')) return { type: 'Literal', value: this.previous().value };
        if (this.match('BOOLEAN')) return { type: 'Literal', value: this.previous().value === 'TRUE' };

        if (this.match('CELL_REF')) {
            // Check if it's a range (followed by : and another ref?)
            // Simplification: Let's handle ranges in arguments or explicit syntax?
            // For now, treat CELL_REF as simple value.
            // A03!L20 -> { sheet: "A03", cell: "L20" }
            const parts = this.previous().value.split('!');
            return { type: 'CellReference', sheet: parts[0], cell: parts[1] };
        }

        if (this.match('IDENTIFIER')) {
            const name = this.previous().value;
            if (this.match('LPAREN')) {
                const args: ASTNode[] = [];
                if (!this.check('RPAREN')) {
                    do {
                        args.push(this.parseExpression());
                    } while (this.match('COMMA'));
                }
                this.consume('RPAREN', "Expect ')' after function arguments.");
                return { type: 'FunctionCall', name, args };
            }
            return { type: 'Identifier', name }; // Variables or errors
        }

        if (this.match('LPAREN')) {
            const expr = this.parseExpression();
            this.consume('RPAREN', "Expect ')' after expression.");
            return expr;
        }

        throw new Error(`Unexpected token: ${this.peek().type} at position ${this.peek().position}`);
    }

    private match(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    private check(type: TokenType): boolean {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    private advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    private isAtEnd(): boolean {
        return this.peek().type === 'EOF';
    }

    private peek(): Token {
        return this.tokens[this.current];
    }

    private previous(): Token {
        return this.tokens[this.current - 1];
    }

    private consume(type: TokenType, message: string): Token {
        if (this.check(type)) return this.advance();
        throw new Error(message);
    }
}

// Basic Evaluator Context
export interface EvaluationContext {
    getCellValue(sheet: string, cell: string): any;
    getRangeValues(sheet: string, start: string, end: string): any[];
}

export class ExpressionEvaluator {
    constructor(private context: EvaluationContext) { }

    evaluate(node: ASTNode): any {
        switch (node.type) {
            case 'Literal': return node.value;
            case 'CellReference': return this.context.getCellValue(node.sheet, node.cell);
            // RangeReference usually only valid inside generic context or specific functions?
            // For now, treat as array?
            case 'BinaryOp':
                const left = this.evaluate(node.left);
                const right = this.evaluate(node.right);
                switch (node.operator) {
                    case '+': return left + right;
                    case '-': return left - right;
                    case '*': return left * right;
                    case '/': return left / right;
                    case '==': return left == right;
                    case '!=': return left != right;
                    case '>': return left > right;
                    case '<': return left < right;
                    case '>=': return left >= right;
                    case '<=': return left <= right;
                    default: throw new Error(`Unknown operator ${node.operator}`);
                }
            case 'FunctionCall':
                const args = node.args.map(arg => this.evaluate(arg));
                return this.callFunction(node.name, args);
            default:
                throw new Error(`Unknown node type ${node}`); // Should not happen with well-formed AST
        }
    }

    private callFunction(name: string, args: any[]): any {
        switch (name.toUpperCase()) {
            case 'SUM':
                // Expects array or list of numbers
                return args.reduce((acc, val) => acc + (Number(val) || 0), 0);
            case 'UPPER':
                return String(args[0]).toUpperCase();
            case 'IF':
                return args[0] ? args[1] : args[2];
            default:
                throw new Error(`Unknown function: ${name}`);
        }
    }
}
