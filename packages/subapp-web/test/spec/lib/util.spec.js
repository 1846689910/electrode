const {
  getVendorBundles,
  getSubAppBundle,
  getBundleBase,
  mapCdnAssets
} = require("../../../lib/util");
const setupContext1 = require("../../data/setup-context1.json");
const cdnAssets = require("../../data/assets.json");

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

  describe("mapCdnAssets", () => {
    it("should map with cdn objects if assetsFile does not exists", () => {
      const cdnBundles = mapCdnAssets({
        bundle1: "bundle1.js"
      });
      expect(cdnBundles.bundle1).to.equal("bundle1.js");
    });

    it("should map with cdn objects", () => {
      Object.keys(require.cache).forEach(key => delete require.cache[key]);
      const { mapCdnAssets: mapFn } = require("../../../lib/util");
      const cdnBundles = mapFn(
        {
          bundle1: "bundle1.js",
          bundle2: "bundle2.js"
        },
        "",
        "./test/data/assets.json"
      );
      expect(cdnBundles.bundle1).to.equal(
        cdnAssets[Object.keys(cdnAssets).find(x => x.endsWith("bundle1.js"))]
      );
    });
  });

  describe("getCdnJsBundles", () => {
    it("should get cdn js bundles", () => {
      const routeData = setupContext1.routeOptions.__internals;
      const cdnJsBundles = require("../../../lib/util").getCdnJsBundles(
        routeData.assets.byChunkName,
        setupContext1.routeOptions
      );
      expect(cdnJsBundles).to.have.all.keys("main", "vendors-123", "vendors-abc");
    });
  });
});
