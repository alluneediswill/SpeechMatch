/// <reference types="node" />
import * as fs from "fs";
import { SpeechMatch } from "../speech_match";
import { DictionaryParser } from "./dictionary_parser";
export declare class MatcherFactory {
    static loadingSingleton: Promise<MatcherFactory>;
    static getInstance(): Promise<MatcherFactory>;
    dictionaryParser: DictionaryParser;
    symbols: Map<string, string>;
    create(): SpeechMatch;
    initialize(): Promise<MatcherFactory>;
    loadPronunciationFile(filePath: fs.PathLike): Promise<void>;
    loadSymbol(filePath: fs.PathLike): Promise<void>;
}
