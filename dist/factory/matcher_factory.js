"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline");
const fs = require("fs");
const path = require("path");
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
        if (MatcherFactory.loadingSingleton) {
            return MatcherFactory.loadingSingleton;
        }
        MatcherFactory.loadingSingleton = new MatcherFactory().initialize();
        return MatcherFactory.loadingSingleton;
    }
    create() {
        const pronunciationConverter = new words_pronunciation_converter_1.WordsPronunciationConverter(this.dictionaryParser.getResult());
        const symbolComparator = new symbol_comparator_1.SymbolComparator(this.symbols);
        return new speech_match_1.SpeechMatch(pronunciationConverter, symbolComparator);
    }
    initialize() {
        return Promise.all([
            this.loadPronunciationFile(path.join(__dirname, "../../cmudict/cmudict-0.7b")),
            this.loadSymbol(path.join(__dirname, "../../cmudict/cmudict.phones.txt"))
        ]).then(() => this);
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
                resolve();
            });
        });
    }
    loadSymbol(filePath) {
        this.symbols.set("/", "/");
        return new Promise((resolve, reject) => {
            const lineReader = readline.createInterface({
                input: fs.createReadStream(filePath)
            });
            lineReader.on("line", function (line) {
                const parseLine = line.split("\t");
                if (parseLine.length < 2)
                    return;
                this.symbols.set(parseLine[0], parseLine[1]);
            }.bind(this));
            lineReader.on("close", function () {
                resolve();
            });
        });
    }
}
exports.MatcherFactory = MatcherFactory;
//# sourceMappingURL=matcher_factory.js.map