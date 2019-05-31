const init = require("../../../lib/init");
const Fs = require("fs");
const Path = require("path");
const sinon = require("sinon");
const setupContext1 = require("../../data/setup-context1.json");
const setupContext2 = require("../../data/setup-context2.json");
const subappUtil = require("subapp-util");

describe("init", () => {
  afterEach(() => {
    this.stubPathJoin.restore();
  });
  after(() => {
    delete process.env.NODE_ENV;
  });
  it("should generate initial scripts for web page", () => {
    const stubManifest = sinon
      .stub(subappUtil, "getAllSubAppManifest")
      .callsFake(() => ({ server1: {}, server2: {} }));
    const stubLoad = sinon
      .stub(subappUtil, "loadSubAppServerByName")
      .callsFake(name => ({ name, initialize: () => {} }));
    this.stubPathJoin = sinon
      .stub(Path, "join")
      .callsFake(() => Path.resolve("./src/subapp-web.js"));
    const pkg = init(setupContext1);
    const content = Fs.readFileSync(Path.resolve("./src/subapp-web.js"));
    const initContent = pkg.process();
    expect(initContent).to.include(`<script id="bundleAssets" type="application/json">`);
    expect(initContent).to.include(content);
    stubLoad.restore();
    stubManifest.restore();
  });

  it("should use dist/subapp-web.js if NODE_ENV=production", () => {
    process.env.NODE_ENV = "production";
    this.stubPathJoin = sinon
      .stub(Path, "join")
      .callsFake(() => Path.resolve("./src/subapp-web.js"));
    const content = Fs.readFileSync(Path.resolve("./src/subapp-web.js"));
    const pkg = init(setupContext2);
    expect(pkg.process()).to.include(content);
  });
});
