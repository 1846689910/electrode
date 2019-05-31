const { getVendorBundles, getSubAppBundle, getBundleBase } = require("../../../lib/util");
const setupContext1 = require("../../data/setup-context1.json");

describe("util", () => {
  describe("getVendorBundles", () => {
    it("should get vendor bundles", () => {
      const bundles = getVendorBundles(setupContext1.routeOptions.__internals.assets);
      expect(bundles.every(x => x.name.startsWith("vendors"))).to.be.true;
    });
  });

  describe("getSubAppBundle", () => {
    it("should get subapp bundle", () => {
      const bundle = getSubAppBundle("vendors-123", {
        js: [{ chunkNames: ["vendors-123"] }, { chunkNames: ["vendors-456"] }]
      });
      expect(bundle.chunkNames[0]).to.equal("vendors-123");
    });
  });

  describe("getBundleBase", () => {
    const routeData = {
      devBundleBase: "/",
      prodBundleBase: "/js/"
    };
    it("should get devBundleBase", () => {
      delete process.env.NODE_ENV;
      process.env.WEBPACK_DEV = "true";
      expect(getBundleBase(routeData)).to.equal(routeData.devBundleBase);
      delete process.env.WEBPACK_DEV;
    });
    it("should get prodBundleBase if NODE_ENV = production", () => {
      process.env.NODE_ENV = "production";
      expect(getBundleBase(routeData)).to.equal(routeData.prodBundleBase);
      delete process.env.NODE_ENV;
    });
    it("should get prodBundleBase if WEBPACK_DEV not true", () => {
      process.env.WEBPACK_DEV = "false";
      expect(getBundleBase(routeData)).to.equal(routeData.prodBundleBase);
      delete process.env.WEBPACK_DEV;
    });
  });
});
