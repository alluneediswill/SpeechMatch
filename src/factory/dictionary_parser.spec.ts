import { expect } from "chai";
import "mocha";
import { DictionaryParser } from "./dictionary_parser";

describe("Dictionary parser", () => {
  let parser: DictionaryParser;

  beforeEach(() => {
    parser = new DictionaryParser();
  });

  it("should create an instance", () => {
    expect(parser).to.be.ok;
  });

  it("should parse ARENA as word and the rest as pronunciation: ARENA  ER0 IY1 N AH0", () => {
    parser.parseNext("ARENA  ER0 IY1 N AH0");
    expect(parser.getResult().size).to.equal(1);
    expect(parser.getResult().has("ARENA")).to.be.true;
    const pronunciations = parser.getResult().get("ARENA");
    expect(pronunciations.length).to.equal(1);
    expect(pronunciations[0]).to.have.ordered.members([
      "ER0",
      "IY1",
      "N",
      "AH0"
    ]);
  });

  it("should handle hypen in MEI-LING  M EY1 L IH1 NG", () => {
    parser.parseNext("MEI-LING  M EY1 L IH1 NG");
    expect(parser.getResult().size).to.equal(1);
    expect(parser.getResult().has("MEI-LING")).to.be.true;
    const pronunciations = parser.getResult().get("MEI-LING");
    expect(pronunciations.length).to.equal(1);
    expect(pronunciations[0]).to.have.ordered.members([
      "M",
      "EY1",
      "L",
      "IH1",
      "NG"
    ]);
  });

  it("should handle punctuation pronunciation )RIGHT-PAREN  R AY1 T P EH2 R AH0 N", () => {
    parser.parseNext(")RIGHT-PAREN  R AY1 T P EH2 R AH0 N");
    expect(parser.getResult().size).to.equal(1);
    expect(parser.getResult().has(")RIGHT-PAREN")).to.be.true;
    const pronunciations = parser.getResult().get(")RIGHT-PAREN");
    expect(pronunciations.length).to.equal(1);
    expect(pronunciations[0]).to.have.ordered.members([
      "R",
      "AY1",
      "T",
      "P",
      "EH2",
      "R",
      "AH0",
      "N"
    ]);
  });

  it("should parse repeated entries of 3 into 3 pronunciations", () => {
    parser.parseNext("MEDIEVAL  M IH0 D IY1 V AH0 L");
    parser.parseNext("MEDIEVAL(1)  M IY0 D IY1 V AH0 L");
    parser.parseNext("MEDIEVAL(2)  M IH0 D Y IY1 V AH0 L");
    expect(parser.getResult().size).to.equal(1);
    expect(parser.getResult().has("MEDIEVAL")).to.be.true;
    const pronunciations = parser.getResult().get("MEDIEVAL");
    expect(pronunciations.length).to.equal(3);
    expect(pronunciations[0]).to.have.ordered.members([
      "M",
      "IH0",
      "D",
      "IY1",
      "V",
      "AH0",
      "L"
    ]);
    expect(pronunciations[1]).to.have.ordered.members([
      "M",
      "IY0",
      "D",
      "IY1",
      "V",
      "AH0",
      "L"
    ]);
    expect(pronunciations[2]).to.have.ordered.members([
      "M",
      "IH0",
      "D",
      "Y",
      "IY1",
      "V",
      "AH0",
      "L"
    ]);
  });

  it("should parse 2 words MEDIN and MEDINA as seperate entries ", () => {
    parser.parseNext("MEDIN  M EY0 D IY1 N");
    parser.parseNext("MEDINA  M AH0 D AY1 N AH0");
    parser.parseNext("MEDINA(1)  M AH0 D IY1 N AH0");
    expect(parser.getResult().size).to.equal(2);
    expect(parser.getResult().has("MEDIN")).to.be.true;
    expect(parser.getResult().has("MEDINA")).to.be.true;
    const medin_pronunciation = parser.getResult().get("MEDIN");
    expect(medin_pronunciation.length).to.equal(1);
    expect(medin_pronunciation[0]).to.have.ordered.members([
      "M",
      "EY0",
      "D",
      "IY1",
      "N"
    ]);
    const medina_pronunciation = parser.getResult().get("MEDINA");
    expect(medina_pronunciation.length).to.equal(2);
    expect(medina_pronunciation[0]).to.have.ordered.members([
      "M",
      "AH0",
      "D",
      "AY1",
      "N",
      "AH0"
    ]);
    expect(medina_pronunciation[1]).to.have.ordered.members([
      "M",
      "AH0",
      "D",
      "IY1",
      "N",
      "AH0"
    ]);
  });
});
