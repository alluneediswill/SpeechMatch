import { expect } from "chai";
import "mocha";
import { WordsPronunciationConverter } from "./words_pronunciation_converter";

describe("Pronunciations retrieval", () => {
  let converter: WordsPronunciationConverter;

  before(() => {
    const dictionary = new Map<string, string[][]>();
    dictionary.set("AB", [["a", "b"]]);
    dictionary.set("CD", [["c", "d"]]);
    dictionary.set("EF/GH", [["e", "f"], ["g", "h"]]);
    dictionary.set("IJ/KL", [["i", "j"], ["k", "l"]]);
    converter = new WordsPronunciationConverter(dictionary);
  });

  it("combines pronunciations for 2 words with 1 pronunciation", () => {
    const pronunciations = converter.convert(["AB", "CD"]);
    expect(pronunciations).to.deep.equal([["a", "b", "/", "c", "d"]]);
  });

  it("combines pronunciations of 1 word with 1 pronunciation and 1 word with 2", () => {
    let pronunciations = converter.convert(["AB", "EF/GH"]);
    expect(pronunciations).to.deep.equal([
      ["a", "b", "/", "e", "f"],
      ["a", "b", "/", "g", "h"]
    ]);

    pronunciations = converter.convert(["EF/GH", "AB"]);
    expect(pronunciations).to.deep.equal([
      ["e", "f", "/", "a", "b"],
      ["g", "h", "/", "a", "b"]
    ]);
  });

  it("combines pronunciations of 2 word with 2 pronunciations", () => {
    const pronunciations = converter.convert(["EF/GH", "IJ/KL"]);
    expect(pronunciations).to.deep.equal([
      ["e", "f", "/", "i", "j"],
      ["e", "f", "/", "k", "l"],
      ["g", "h", "/", "i", "j"],
      ["g", "h", "/", "k", "l"]
    ]);
  });

  it("combines pronunciations of word with no pronunciation and word with 1 pronunciation", () => {
    let pronunciations = converter.convert(["AB", "unknown"]);
    expect(pronunciations).to.deep.equal([["a", "b"]]);

    pronunciations = converter.convert(["unknown", "AB"]);
    expect(pronunciations).to.deep.equal([["a", "b"]]);
  });

  it("combines pronunciations of word with no pronunciation and word with 2 pronunciation", () => {
    let pronunciations = converter.convert(["EF/GH", "unknown"]);
    expect(pronunciations).to.deep.equal([["e", "f"], ["g", "h"]]);

    pronunciations = converter.convert(["unknown", "EF/GH"]);
    expect(pronunciations).to.deep.equal([["e", "f"], ["g", "h"]]);
  });

  it("combines pronunciations of word with no pronunciation, 1 word with 1 pronunciation and 1 with 2", () => {
    let pronunciations = converter.convert(["AB", "unknown", "EF/GH"]);
    expect(pronunciations).to.deep.equal([
      ["a", "b", "/", "e", "f"],
      ["a", "b", "/", "g", "h"]
    ]);

    pronunciations = converter.convert(["AB", "EF/GH", "unknown"]);
    expect(pronunciations).to.deep.equal([
      ["a", "b", "/", "e", "f"],
      ["a", "b", "/", "g", "h"]
    ]);

    pronunciations = converter.convert(["unknown", "AB", "EF/GH"]);
    expect(pronunciations).to.deep.equal([
      ["a", "b", "/", "e", "f"],
      ["a", "b", "/", "g", "h"]
    ]);

    pronunciations = converter.convert(["EF/GH", "unknown", "AB"]);
    expect(pronunciations).to.deep.equal([
      ["e", "f", "/", "a", "b"],
      ["g", "h", "/", "a", "b"]
    ]);

    pronunciations = converter.convert(["EF/GH", "AB", "unknown"]);
    expect(pronunciations).to.deep.equal([
      ["e", "f", "/", "a", "b"],
      ["g", "h", "/", "a", "b"]
    ]);

    pronunciations = converter.convert(["unknown", "EF/GH", "AB"]);
    expect(pronunciations).to.deep.equal([
      ["e", "f", "/", "a", "b"],
      ["g", "h", "/", "a", "b"]
    ]);
  });

  it("combines pronunciations of word with no pronunciation and 2 word with 2 pronunciations", () => {
    let pronunciations = converter.convert(["EF/GH", "unknown", "IJ/KL"]);
    expect(pronunciations).to.deep.equal([
      ["e", "f", "/", "i", "j"],
      ["e", "f", "/", "k", "l"],
      ["g", "h", "/", "i", "j"],
      ["g", "h", "/", "k", "l"]
    ]);

    pronunciations = converter.convert(["unknown", "EF/GH", "IJ/KL"]);
    expect(pronunciations).to.deep.equal([
      ["e", "f", "/", "i", "j"],
      ["e", "f", "/", "k", "l"],
      ["g", "h", "/", "i", "j"],
      ["g", "h", "/", "k", "l"]
    ]);

    pronunciations = converter.convert(["EF/GH", "IJ/KL", "unknown"]);
    expect(pronunciations).to.deep.equal([
      ["e", "f", "/", "i", "j"],
      ["e", "f", "/", "k", "l"],
      ["g", "h", "/", "i", "j"],
      ["g", "h", "/", "k", "l"]
    ]);
  });
});
