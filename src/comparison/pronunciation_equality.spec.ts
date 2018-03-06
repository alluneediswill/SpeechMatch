import { expect } from "chai";
import "mocha";
import { PronunciationEquality } from "./pronunciation_equality";
import { MatcherFactory } from "../factory/matcher_factory";
import { SymbolComparator } from "./symbol_comparator";

describe("Equal comparator", () => {
  let comparator: PronunciationEquality;
  let symbolComparator: SymbolComparator;

  before(() => {
    return MatcherFactory.getInstance().then(factory => {
      symbolComparator = new SymbolComparator(factory.symbols);
      comparator = new PronunciationEquality(symbolComparator);
      return comparator;
    });
  });

  it("calculates same pronunciation difference as 0", () => {
    const pronunciation1 = [
      "K",
      "AO1",
      "R",
      "N",
      "/",
      "B",
      "EY1",
      "W",
      "AA0",
      "CH"
    ];
    expect(comparator.compare(pronunciation1, pronunciation1)).to.equal(0);
  });

  it("calculates the deletion/insertion cost to be the symbol cost of the symbol (R liquid)", () => {
    const pronunciation1 = ["K", "AO1", "R", "N"];
    const pronunciation2 = ["K", "AO1", "N"];
    const rDiff = symbolComparator.symbolCost("R");
    expect(comparator.compare(pronunciation1, pronunciation2)).to.equal(rDiff);
    expect(comparator.compare(pronunciation2, pronunciation1)).to.equal(rDiff);
  });

  it("calculates the deletion/insertion cost to be the symbol cost of the symbol (AO1 vowel)", () => {
    const pronunciation1 = ["K", "AO1", "R", "N"];
    const pronunciation2 = ["K", "R", "N"];
    const rDiff = symbolComparator.symbolCost("AO1");
    expect(comparator.compare(pronunciation1, pronunciation2)).to.equal(rDiff);
    expect(comparator.compare(pronunciation2, pronunciation1)).to.equal(rDiff);
  });

  it("calculates the deletion/insertion cost of 2 symbols to be combination of their cost(B AA0)", () => {
    const pronunciation1 = ["B", "EY1", "W", "AA0", "CH"];
    const pronunciation2 = ["EY1", "W", "CH"];
    const rDiff =
      symbolComparator.symbolCost("B") + symbolComparator.symbolCost("AA0");
    expect(comparator.compare(pronunciation1, pronunciation2)).to.equal(rDiff);
    expect(comparator.compare(pronunciation2, pronunciation1)).to.equal(rDiff);
    expect(
      comparator.compare(pronunciation1.reverse(), pronunciation2.reverse())
    ).to.equal(rDiff);
  });

  it("calculates the substitution cost to be the comparison between old and new symbol", () => {
    const pronunciation1 = ["B", "EY1", "W", "AA0", "CH"];
    const pronunciation2 = ["B", "EY1", "Y", "AA0", "CH"];
    const rDiff = symbolComparator.compare("W", "Y");
    expect(comparator.compare(pronunciation1, pronunciation2)).to.equal(rDiff);
    expect(comparator.compare(pronunciation2, pronunciation1)).to.equal(rDiff);
  });

  it("combines the substitution cost and deletion/insertion cost", () => {
    const pronunciation1 = ["B", "EY1", "W", "AA0", "CH"];
    const pronunciation2 = ["B", "W", "AA0", "JH"];
    const rDiff =
      symbolComparator.compare("CH", "JH") + symbolComparator.symbolCost("EY1");
    expect(comparator.compare(pronunciation1, pronunciation2)).to.equal(rDiff);
    expect(comparator.compare(pronunciation2, pronunciation1)).to.equal(rDiff);
    expect(
      comparator.compare(pronunciation1.reverse(), pronunciation2.reverse())
    ).to.equal(rDiff);
    expect(
      comparator.compare(pronunciation2.reverse(), pronunciation1.reverse())
    ).to.equal(rDiff);
  });
});
