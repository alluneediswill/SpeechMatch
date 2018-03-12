"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline");
const fs = require("fs");
const speech_match_1 = require("../speech_match");
const dictionary_parser_1 = require("./dictionary_parser");
const words_pronunciation_converter_1 = require("../comparison/words_pronunciation_converter");
const symbol_comparator_1 = require("../comparison/symbol_comparator");
class MatcherFactory {
    constructor() {
        this.dictionaryParser = new dictionary_parser_1.DictionaryParser();
        this.symbols = new Map();
    }
    static getInstance() {
        if (MatcherFactory.singleton) {
            return Promise.resolve(MatcherFactory.singleton);
        }
        const factory = new MatcherFactory();
        return factory.initialize().then(() => {
            return factory;
        });
    }
    create() {
        const pronunciationConverter = new words_pronunciation_converter_1.WordsPronunciationConverter(this.dictionaryParser.getResult());
        const symbolComparator = new symbol_comparator_1.SymbolComparator(this.symbols);
        return new speech_match_1.SpeechMatch(pronunciationConverter, symbolComparator);
    }
    initialize() {
        return Promise.all([
            this.loadPronunciationFile("./cmudict/cmudict-0.7b"),
            this.loadSymbol()
        ]);
    }
    loadPronunciationFile(filePath) {
        return new Promise((resolve, reject) => {
            const lineReader = readline.createInterface({
                input: fs.createReadStream(filePath)
            });
            lineReader.on("line", function (line) {
                this.dictionaryParser.parseNext(line);
            }.bind(this));
            lineReader.on("close", function () {
                resolve(true);
            });
        });
    }
    loadSymbol() {
        this.symbols.set("/", "/");
        return new Promise((resolve, reject) => {
            const lineReader = readline.createInterface({
                input: fs.createReadStream("./cmudict/cmudict.phones.txt")
            });
            lineReader.on("line", function (line) {
                const parseLine = line.split("\t");
                if (parseLine.length < 2)
                    return;
                this.symbols.set(parseLine[0], parseLine[1]);
            }.bind(this));
            lineReader.on("close", function () {
                resolve(true);
            });
        });
    }
}
exports.MatcherFactory = MatcherFactory;
//# sourceMappingURL=matcher_factory.js.map