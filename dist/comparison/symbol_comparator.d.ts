export declare const DEFAULT_STRESS_WEIGHT = 1;
export declare const DEFAULT_TYPE_MATCH = 0.75;
export declare class SymbolComparator {
    private symbolTypes;
    symbolWeight: {
        [t: string]: number;
    };
    stressWeight: number;
    typeMatchValue: number;
    constructor(symbolTypes: Map<string, string>, symbolWeight?: {
        [t: string]: number;
    }, stressWeight?: number, typeMatchValue?: number);
    compare(symbol1: string, symbol2: string): number;
    characterDiff(symbol1: string, symbol2: string): number;
    symbolCost(symbol: string): number;
}
