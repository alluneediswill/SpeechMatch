import * as readline from "readline";
import * as fs from "fs";
import { SpeechMatch } from "../speech_match";
import { DictionaryParser } from "./dictionary_parser";
import { WordsPronunciationConverter } from "../comparison/words_pronunciation_converter";
import { SymbolComparator } from "../comparison/symbol_comparator";

export class MatcherFactory {
  static singleton: MatcherFactory;

  static getInstance(): Promise<MatcherFactory> {
    if (MatcherFactory.singleton) {
      return Promise.resolve(MatcherFactory.singleton);
    }
    const factory = new MatcherFactory();
    return factory.initialize().then(() => {
      return factory;
    });
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

  initialize(): Promise<boolean[]> {
      return Promise.all([this.loadPronunciationFile("./cmudict/cmudict-0.7b"), this.loadSymbol()]);
  }

  loadPronunciationFile(filePath: fs.PathLike): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
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
        resolve(true);
      });
    });
  }

  loadSymbol(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const lineReader = readline.createInterface({
        input: fs.createReadStream("./cmudict/cmudict.phones.txt")
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
        resolve(true);
      });
    });
  }
}
