const init = require("../../../lib/init");
const Fs = require("fs");
const Path = require("path");
const sinon = require("sinon");
const setupContext1 = require("../../data/setup-context1.json");
const setupContext2 = require("../../data/setup-context2.json");

describe("init", () => {
  it("should generate initial scripts for web page", () => {
    const stubManifest = sinon
      .stub(require("subapp-util"), "getAllSubAppManifest")
      .callsFake(() => ({ server1: {}, server2: {} }));
    const stubLoad = sinon
      .stub(require("subapp-util"), "loadSubAppServerByName")
      .callsFake(name => ({ name, initialize: () => {} }));
    const pkg = init(setupContext1);
    const content = Fs.readFileSync(Path.resolve("./browser/subapp-web.js"));
    const initContent = pkg.process();
    expect(initContent).to.include(`<script id="bundleAssets" type="application/json">`);
    expect(initContent).to.include(content);
    stubLoad.restore();
    stubManifest.restore();
  });

  it("should use dist/subapp-web.js if NODE_ENV=production", () => {
    process.env.NODE_ENV = "production";
    const content = Fs.readFileSync(Path.resolve("./dist/subapp-web.js"));
    const pkg = init(setupContext2);
    expect(pkg.process()).to.include(content);
    delete process.env.NODE_ENV;
  });
});
