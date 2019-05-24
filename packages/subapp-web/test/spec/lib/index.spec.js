"use strict";

const subAppWeb = require("../../..");

describe("subapp-web", function() {
  it("should export module", () => {
    expect(subAppWeb).to.exist;
  });

  it("dynamicLoadSubApp should return undefined", () => {
    expect(subAppWeb.dynamicLoadSubApp()).to.not.exist;
  });

  it("getBrowserHistory should return undefined", () => {
    expect(subAppWeb.getBrowserHistory()).to.not.exist;
  });
});
