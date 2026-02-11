import { ExpressionParser, ExpressionEvaluator } from './expressionParser';

export interface Rule {
    id: string;
    description: string;
    severity: "ERROR" | "WARNING" | "INFO";
    appliesTo: {
        series: string[];
        estabTypes?: string[];
        requires?: {
            hasAmbulance?: boolean;
        };
    };
    assert: Assertion[];
}

export interface Assertion {
    test: string;
    messageTemplate: string;
}

export interface Finding {
    ruleId: string;
    severity: "ERROR" | "WARNING" | "INFO";
    description: string;
    message: string;
    sheet?: string;
    cell?: string;
    actual?: any;
    expected?: any;
}

export interface WorkbookData {
    fileName: string;
    series: string; // e.g., 'A', 'D', 'P'
    meta: {
        estabType?: string; // 'Posta', 'CESFAM', etc.
        hasAmbulance?: boolean;
        [key: string]: any;
    };
    sheets: { [sheetName: string]: { [cellRef: string]: any } };
}

export class RuleEngine {
    private rules: Rule[] = [];
    private parser: ExpressionParser;

    constructor(rules: Rule[]) {
        this.rules = rules;
        this.parser = new ExpressionParser();
    }

    evaluate(workbook: WorkbookData): Finding[] {
        const findings: Finding[] = [];
        const applicableRules = this.filterRules(workbook);

        for (const rule of applicableRules) {
            for (const assertion of rule.assert) {
                try {
                    const ast = this.parser.parse(assertion.test);

                    // Identify dependencies / cells needed? 
                    // For now, we just pass a context that can resolve them.

                    const context = {
                        getCellValue: (sheet: string, cell: string) => {
                            // Handle mapping if necessary. For now direct lookup.
                            // Assuming sheet names in workbook match rule references (e.g. A03)
                            // Or if rule uses generic names? 
                            // The user example was A03!L20, usually specific to the file structure.
                            if (workbook.sheets[sheet] && workbook.sheets[sheet][cell] !== undefined) {
                                return workbook.sheets[sheet][cell];
                            }
                            // Return 0 or null if not found? 
                            // Excel treats empty as 0 in math usually.
                            return 0;
                        },
                        getRangeValues: (sheet: string, start: string, end: string) => {
                            // Implementation for range TODO
                            return [];
                        }
                    };

                    const evaluator = new ExpressionEvaluator(context);
                    const result = evaluator.evaluate(ast);

                    // If result is false (or falsy), the assertion FAILED.
                    // Wait, usually "assert: test" means if test is true, it passes?
                    // "Assert A > 10". If A is 5, it fails.
                    // So if result is FALSE, we generate a finding.

                    if (result === false) {
                        findings.push({
                            ruleId: rule.id,
                            severity: rule.severity,
                            description: rule.description,
                            message: this.formatMessage(assertion.messageTemplate, {}, workbook),
                            // We might want to capture what actual values were used... logic for that is complex without tracing.
                        });
                    }

                } catch (error: any) {
                    findings.push({
                        ruleId: rule.id,
                        severity: "ERROR",
                        description: "Runtime Error",
                        message: `Error evaluating rule: ${error.message}`
                    });
                }
            }
        }
        return findings;
    }

    private filterRules(workbook: WorkbookData): Rule[] {
        return this.rules.filter(rule => {
            // Check Series
            // If rule applies to "A", and workbook is "A01", does it match?
            // User said: "mapped... if file is Serie A (A01/A02/etc.)"
            // We assume workbook.series is normalized to "A" or we check startsWith?
            // Let's assume workbook.series is the specific one "A01" and rule says "A".
            // Or workbook.series is "A" derived from filename. 
            // Let's support both exact and mapped.
            const seriesMatch = rule.appliesTo.series.some(s =>
                workbook.series === s || workbook.series.startsWith(s)
            );
            if (!seriesMatch) return false;

            // Check EstabType
            if (rule.appliesTo.estabTypes && workbook.meta.estabType) {
                if (!rule.appliesTo.estabTypes.includes(workbook.meta.estabType)) {
                    return false;
                }
            }

            // Check Requirements
            if (rule.appliesTo.requires) {
                if (rule.appliesTo.requires.hasAmbulance !== undefined) {
                    if (workbook.meta.hasAmbulance !== rule.appliesTo.requires.hasAmbulance) {
                        return false;
                    }
                }
            }

            return true;
        });
    }

    private formatMessage(template: string, values: any, workbook: WorkbookData): string {
        // Basic substitution
        let msg = template;
        // We could add context values here if we had them from the evaluator
        return msg;
    }
}
