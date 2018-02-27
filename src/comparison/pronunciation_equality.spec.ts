import { expect } from "chai";
import "mocha";
import { PronunciationEquality } from "./pronunciation_equality";
import { MatcherFactory } from "../factory/matcher_factory";
import { SymbolComparator } from "./symbol_comparator";

describe("Equal comparator", () => {
  let comparator: PronunciationEquality;

  before(() => {
    return MatcherFactory.getInstance().then(factory => {
      comparator = new PronunciationEquality(
        new SymbolComparator(factory.symbols)
      );
      return comparator;
    });
  });

  it("calculates same pronunciation difference as 0", () => {
    const pronunciation1 = ["K", "AO1", "R", "N"];
    const pronunciation2 = ["K", "AO1", "R", "N"];
    expect(comparator.compare(pronunciation1, pronunciation2)).to.equal(0);
  });

  it("calculates pronunciations with 1 less symbol difference as 1", () => {
    const pronunciation1 = ["K", "AO1", "R", "N"];
    const pronunciation2 = ["K", "AO1", "N"];
    expect(comparator.compare(pronunciation1, pronunciation2)).to.equal(1);
    expect(comparator.compare(pronunciation2, pronunciation1)).to.equal(1);
  });

  it("calculates pronunciations with 1 different symbol difference as 1", () => {
    const pronunciation1 = ["K", "AO1", "R", "N"];
    const pronunciation2 = ["K", "AO1", "K", "N"];
    expect(comparator.compare(pronunciation1, pronunciation2)).to.equal(1);
  });
});
