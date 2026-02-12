import { ExpressionParser, ExpressionEvaluator } from './expressionParser';
import { RuleEngine, Rule, WorkbookData } from './ruleEngine';
import sampleRules from '../rules/rules.sample.json';

// --- Simple Test Framework ---
function describe(name: string, fn: () => void) {
    console.log(`\n📦 ${name}`);
    fn();
}

function it(name: string, fn: () => void) {
    try {
        fn();
        console.log(`  ✅ ${name}`);
    } catch (e: any) {
        console.error(`  ❌ ${name}`);
        console.error(`     ${e.message}`);
    }
}

function expect(actual: any) {
    return {
        toBe: (expected: any) => {
            if (actual !== expected) throw new Error(`Expected ${expected}, got ${actual}`);
        },
        toEqual: (expected: any) => {
            const actualStr = JSON.stringify(actual);
            const expectedStr = JSON.stringify(expected);
            if (actualStr !== expectedStr) throw new Error(`Expected ${expectedStr}, got ${actualStr}`);
        },
        toBeGreaterThan: (expected: number) => {
            if (!(actual > expected)) throw new Error(`Expected ${actual} > ${expected}`);
        },
        toBeLength: (expected: number) => {
            if (actual.length !== expected) throw new Error(`Expected length ${expected}, got ${actual.length}`);
        }
    };
}

// --- Tests ---

describe('Expression Parser', () => {
    const parser = new ExpressionParser();
    const context = {
        getCellValue: (sheet: string, cell: string) => {
            if (sheet === 'A01' && cell === 'C01') return 10;
            if (sheet === 'A01' && cell === 'C02') return 20;
            return 0;
        },
        getRangeValues: () => []
    };
    const evaluator = new ExpressionEvaluator(context);

    it('should evaluate arithmetic 1 + 2', () => {
        const ast = parser.parse('1 + 2');
        const result = evaluator.evaluate(ast);
        expect(result).toBe(3);
    });

    it('should evaluate cell references', () => {
        const ast = parser.parse('A01!C01 + 5');
        const result = evaluator.evaluate(ast);
        expect(result).toBe(15);
    });

    it('should evaluate comparison', () => {
        const ast1 = parser.parse('10 > 5');
        expect(evaluator.evaluate(ast1)).toBe(true);
        const ast2 = parser.parse('10 < 5');
        expect(evaluator.evaluate(ast2)).toBe(false);
    });

    it('should evaluate logic with functions', () => {
        // SUM not fully implemented in context mock above logic-wise unless we pass array? 
        // Logic in evaluator: SUM(args...) -> checks args. 
        // Parser: SUM(1, 2, 3) -> valid.
        const ast = parser.parse('SUM(1, 2, 3)');
        expect(evaluator.evaluate(ast)).toBe(6);
    });

    it('should evaluate IF statements', () => {
        const ast = parser.parse('IF(TRUE, "Yes", "No")');
        expect(evaluator.evaluate(ast)).toBe("Yes");
        const ast2 = parser.parse('IF(1 > 10, "Yes", "No")');
        expect(evaluator.evaluate(ast2)).toBe("No");
    });

    it('should evaluate complex expression with cell refs', () => {
        // A01!C01 = 10, A01!C02 = 20
        // 10 + 20 == 30
        const ast = parser.parse('A01!C01 + A01!C02 == 30');
        expect(evaluator.evaluate(ast)).toBe(true);
    });
});

describe('Rule Engine - Series A', () => {
    // Mock Data for Series A
    const workbookA: WorkbookData = {
        fileName: 'A01_2026.xlsx',
        series: 'A',
        meta: {
            estabType: 'CESFAM',
            hasAmbulance: false
        },
        sheets: {
            'A01': {
                'C01': 100, // Male
                'C02': 200, // Female
                'C03': 300, // Total (Matches)
                'A01': 'Unknown' // Supervisor name
            },
            'A02': {
                'C10': 300 // Matches A01!C03
            },
            'A03': {
                'D10': 6000 // > 5000, should trigger WARNING/INFO
            },
            'A20': {
                'Z01': 5 // hasAmbulance is false, should Error
            }
        }
    };

    const engine = new RuleEngine(sampleRules as Rule[]);

    it('should evaluate rules for Series A', () => {
        const findings = engine.evaluate(workbookA);

        // A-R001: Total match. 100+200 == 300. Should Pass.

        // A-R002: Positive. C01=100. Pass.

        // A-R003: Pregnant > 5000. D10=6000. Should Fail (Info/Warning).
        const r003 = findings.find(f => f.ruleId === 'A-R003');
        expect(!!r003).toBe(true);
        if (r003) expect(r003.severity).toBe('INFO');

        // A-R004: Cross sheet. A01!C03(300) == A02!C10(300). Pass.

        // A-R005: Ambulance. hasAmbulance=false, but A20!Z01=5 (!=0). Should Fail.
        const r005 = findings.find(f => f.ruleId === 'A-R005');
        expect(!!r005).toBe(true);
        if (r005) expect(r005.severity).toBe('ERROR');

        // A-R006: Supervisor name. A01!A01 is 'Unknown'. Test: UPPER(...) != 'UNKNOWN'. 'UNKNOWN' != 'UNKNOWN' is False. Should Fail.
        // Wait, test is UPPER(A01!A01) != 'UNKNOWN'.
        // If it IS 'Unknown', then 'UNKNOWN' != 'UNKNOWN' is False.
        // So validation fails -> Finding created.
        const r006 = findings.find(f => f.ruleId === 'A-R006');
        expect(!!r006).toBe(true);
    });
});

describe('Rule Engine - Series AX', () => {
    const workbookAX: WorkbookData = {
        fileName: 'AX01_2026.xlsx',
        series: 'AX',
        meta: {},
        sheets: {
            'AX01': {
                'B05': 10,  // > 0 Pass
                'C20': 500, // < 1M Pass
                'E05': 0,
                'D05': 50,  // IF check: 50 > 100? False. Then TRUE. Pass.
                'A01': 'VALID' // UPPER == VALID. Pass.
            },
            'AX02': {
                'A01': 0, 'A02': 0, 'A03': 0, 'A04': 0, 'A05': 0 // SUM = 0. Test > 0. Fail.
            },
            'AX05': {
                'F10': 101 // <= 100. Fail.
            }
        }
    };

    const engine = new RuleEngine(sampleRules as Rule[]);

    it('should evaluate rules for Series AX', () => {
        const findings = engine.evaluate(workbookAX);

        // AX-R004: SUM > 0. Data is all 0. Should Fail.
        const r004 = findings.find(f => f.ruleId === 'AX-R004');
        expect(!!r004).toBe(true);

        // AX-R006: <= 100. Val is 101. Should Fail.
        const r006 = findings.find(f => f.ruleId === 'AX-R006');
        expect(!!r006).toBe(true);
    });
});
