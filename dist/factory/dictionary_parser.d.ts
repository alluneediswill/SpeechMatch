export declare class DictionaryParser {
    wordPronunciations: Map<string, string[][]>;
    parseNext(line: string): void;
    addWord(word: string, newPronunciation: string[], expectedNum: number): void;
    getResult(): Map<string, string[][]>;
}
