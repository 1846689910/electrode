const setup = require("../../../lib/start");

describe("start", () => {
  it("should return the subapp start", () => {
    const start = setup().process();
    expect(start).to.equal("\n<!-- subapp start -->\n");
  });
});
