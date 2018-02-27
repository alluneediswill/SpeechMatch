export class DictionaryParser {
  wordPronunciations: Map<string, string[][]> = new Map<string, string[][]>();

  parseNext(line: string) {
    if (line.startsWith(";;;")) {
      return;
    }
    const parseLine = line.split(" ");
    const word = parseLine.shift();
    if (!word || parseLine.length < 1) {
      return;
    }
    if (parseLine[0].length < 1) {
      parseLine.shift();
    }
    if (parseLine.length < 1) {
      return;
    }

    const wordRegex = /(.+)\((\d)\)/;
    const result = wordRegex.exec(word);
    if (result && result.length >= 3) {
      this.addWord(result[1], parseLine, parseInt(result[2]));
    } else {
      this.addWord(word, parseLine, 0);
    }
  }

  addWord(word: string, newPronunciation: string[], expectedNum: number) {
    let existing = this.wordPronunciations.get(word);
    if (!existing) {
      existing = new Array<string[]>();
      this.wordPronunciations.set(word, existing);
    }
    if (existing.length !== expectedNum) {
      console.warn("Parsing dictionary: word is not in sequence as expected");
    }
    existing.push(newPronunciation);
  }

  getResult() {
    return this.wordPronunciations;
  }
}
