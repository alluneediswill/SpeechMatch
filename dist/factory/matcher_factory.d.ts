/// <reference types="node" />
import * as fs from "fs";
import { SpeechMatch } from "../speech_match";
import { DictionaryParser } from "./dictionary_parser";
export declare class MatcherFactory {
    static singleton: MatcherFactory;
    static getInstance(): Promise<MatcherFactory>;
    dictionaryParser: DictionaryParser;
    symbols: Map<string, string>;
    create(): SpeechMatch;
    initialize(): Promise<boolean[]>;
    loadPronunciationFile(filePath: fs.PathLike): Promise<boolean>;
    loadSymbol(): Promise<boolean>;
}
