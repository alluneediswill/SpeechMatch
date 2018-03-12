export declare class WordsPronunciationConverter {
    private arpabetsDictionary;
    constructor(arpabetsDictionary: Map<string, string[][]>);
    convert(words: string[], unknownWords?: Set<string>): string[][];
}
