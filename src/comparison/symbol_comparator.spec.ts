import { expect } from "chai";
import "mocha";
import { MatcherFactory } from "../factory/matcher_factory";
import { SymbolComparator } from "./symbol_comparator";

describe("Equal comparator", () => {
  let comparator: SymbolComparator;

  before(() => {
    return MatcherFactory.getInstance().then(factory => {
      comparator = new SymbolComparator(factory.symbols);
      return comparator;
    });
  });

  it("calculates same character as 0", () => {
    expect(comparator.compare("F", "F")).to.equal(0);
  });

  it("calculates vowel difference with one shared character as 0.2", () => {
    expect(comparator.compare("AO1", "OY1")).to.equal(0.2);
  });
});
