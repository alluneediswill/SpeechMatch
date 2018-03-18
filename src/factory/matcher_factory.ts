import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";
import { SpeechMatch } from "../speech_match";
import { DictionaryParser } from "./dictionary_parser";
import { WordsPronunciationConverter } from "../comparison/words_pronunciation_converter";
import { SymbolComparator } from "../comparison/symbol_comparator";

export class MatcherFactory {
  static loadingSingleton: Promise<MatcherFactory>;

  static getInstance(): Promise<MatcherFactory> {
    if (MatcherFactory.loadingSingleton) {
      return MatcherFactory.loadingSingleton;
    }
    MatcherFactory.loadingSingleton = new MatcherFactory().initialize();
    return MatcherFactory.loadingSingleton;
  }

  dictionaryParser: DictionaryParser = new DictionaryParser();
  symbols: Map<string, string> = new Map<string, string>();

  create(): SpeechMatch {
    const pronunciationConverter = new WordsPronunciationConverter(
      this.dictionaryParser.getResult()
    );
    const symbolComparator = new SymbolComparator(this.symbols);
    return new SpeechMatch(pronunciationConverter, symbolComparator);
  }

  initialize(): Promise<MatcherFactory> {
    return Promise.all([
      this.loadPronunciationFile(
        path.join(__dirname, "../../cmudict/cmudict-0.7b")
      ),
      this.loadSymbol(path.join(__dirname, "../../cmudict/cmudict.phones.txt"))
    ]).then(() => this);
  }

  loadPronunciationFile(filePath: fs.PathLike): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const lineReader = readline.createInterface({
        input: fs.createReadStream(filePath)
      });
      lineReader.on(
        "line",
        function(line: string) {
          this.dictionaryParser.parseNext(line);
        }.bind(this)
      );
      lineReader.on("close", function() {
        resolve();
      });
    });
  }

  loadSymbol(filePath: fs.PathLike): Promise<void> {
    this.symbols.set("/", "/");
    return new Promise<void>((resolve, reject) => {
      const lineReader = readline.createInterface({
        input: fs.createReadStream(filePath)
      });
      lineReader.on(
        "line",
        function(line: string) {
          const parseLine = line.split("\t");
          if (parseLine.length < 2) return;
          this.symbols.set(parseLine[0], parseLine[1]);
        }.bind(this)
      );
      lineReader.on("close", function() {
        resolve();
      });
    });
  }
}
