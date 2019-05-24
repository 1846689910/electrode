const setup = require("../../../lib/load");
const setupContext3 = require("../../data/setup-context3.json");
const Fs = require("fs");
const sinon = require("sinon");
const Path = require("path");
const conf1 = require("../../data/subapp1/src/subapp-conf");
const conf2 = require("../../data/subapp2/src/subapp-conf");

describe("setup", () => {
  process.env.APP_SRC_DIR = "test/data";
  const path = Path.resolve("dist/js/subapp1.bundle.js");
  const path2 = Path.resolve("dist/js/subapp2.bundle.js");
  const SUBAPP_CONTAINER_SYM = Symbol.for("Electrode SubApps Container");
  const context = {
    user: {
      request: {
        app: {
          webpackDev: {
            compileTime: 100
          }
        },
        url: {
          path: "/api"
        }
      }
    },
    output: {
      reserve: () => ({ add() {}, close() {} })
    }
  };
  const getToken = token => {
    const props = Object.assign(
      {},
      {
        name: "subapp1",
        async: true,
        inlineScript: "always",
        streaming: true,
        hydrateServerData: {},
        timestamp: Date.now(),
        serverSideRendering: true
      },
      token
    );
    return { props };
  };

  const setSubApp = (name, basicConf, conf) => {
    global[SUBAPP_CONTAINER_SYM] = {
      [name]: {
        ...basicConf,
        ...conf
      }
    };
  };

  let stubFsReadFileSync;
  let stubRequest;
  let stubReactCreateElement;
  beforeEach(() => {
    stubFsReadFileSync = sinon.stub(Fs, "readFileSync");
    Fs.readFileSync.withArgs(path).callsFake(() => "var vendors = 123");
    Fs.readFileSync.withArgs(path2).callsFake(() => "var vendors = 123");
    stubFsReadFileSync.callThrough();

    stubRequest = sinon.stub(require("request"), "get");
  });

  afterEach(() => {
    if (stubFsReadFileSync) stubFsReadFileSync.restore();
    global[SUBAPP_CONTAINER_SYM] = {};
    if (stubRequest) stubRequest.restore();
    if (stubReactCreateElement) stubReactCreateElement.restore();
  });

  after(() => {
    delete process.env.APP_SRC_DIR;
  });

  it("should load subapp", () => {
    stubRequest.onCall(0).yields(null, {}, JSON.stringify({ data: "abc" }));
    setSubApp("subapp1", conf1, { useReactRouter: true, reduxCreateStore: true });
    const init = setup(setupContext3, getToken({ elementId: "123" }));
    init.process(context);
    expect(init).to.exist;
  });

  it("should load subapp with WEBPACK_DEV = false", () => {
    process.env.WEBPACK_DEV = "false";
    const init = setup(setupContext3, getToken({ streaming: false }));
    init.process(context);
    process.env.WEBPACK_DEV = "true";
    expect(init).to.exist;
  });

  it("should load subapp with WEBPACK_DEV = false", () => {
    stubRequest.onCall(0).yields(null, {}, JSON.stringify({ data: "abc" }));
    stubReactCreateElement = sinon
      .stub(require("react"), "createElement")
      .onCall(0)
      .throws();
    process.env.WEBPACK_DEV = "false";
    const init = setup(setupContext3, getToken({ streaming: false }));
    init.process(context);
    process.env.WEBPACK_DEV = "true";
    expect(init).to.exist;
  });

  it("should load subapp in production mode", () => {
    stubRequest.onCall(0).yields(null, {}, JSON.stringify({ data: "abc" }));
    process.env.WEBPACK_DEV = "false";
    process.env.NODE_ENV = "production";
    const init = setup(
      setupContext3,
      getToken({ streaming: false, inlineScript: true, async: false, defer: true, timestamp: null })
    );
    init.process(context);
    process.env.WEBPACK_DEV = "true";
    delete process.env.NODE_ENV;
    expect(init).to.exist;
  });

  it("should load subapp without hydrateServerData", () => {
    stubRequest.onCall(0).yields(new Error());
    const init = setup(setupContext3, getToken({ hydrateServerData: false }));
    init.process(context);
    expect(init).to.exist;
  });

  it("should load subapp without streaming", () => {
    stubRequest.onCall(0).yields(null, {}, JSON.stringify({ data: "abc" }));
    const init = setup(setupContext3, getToken({ streaming: false, hydrateServerData: false }));
    init.process(context);
    expect(init).to.exist;
  });

  it("should load subapp without serversiderendering", () => {
    stubRequest.onCall(0).yields(null, {}, JSON.stringify({ data: "abc" }));
    const init = setup(
      setupContext3,
      getToken({ hydrateServerData: false, serverSideRendering: false })
    );
    init.process(context);
    expect(init).to.exist;
  });

  it("should load subapp with reduxCreateStore", () => {
    stubRequest.onCall(0).yields(null, {}, JSON.stringify({ data: "abc" }));
    setSubApp("subapp1", conf1, { reduxCreateStore: true });
    const init = setup(setupContext3, getToken({ inlineScript: false }));
    init.process(context);
    expect(init).to.exist;
  });

  it("should load subapp without timestamp setup", () => {
    stubRequest.onCall(0).yields(null, {}, JSON.stringify({ data: "abc" }));
    const init = setup(setupContext3, getToken({ timestamp: null }));
    const context1 = { ...context };
    delete context1.user.request.app.webpackDev;
    init.process(context1);
    expect(init).to.exist;
  });

  it("should load subapp if it cannot request assets", () => {
    stubRequest.onCall(0).yields(null, {}, JSON.stringify({ data: "abc" }));
    process.env.WEBPACK_DEV = "false";
    const init = setup(setupContext3, getToken());
    init.process(context);
    process.env.WEBPACK_DEV = "true";
    expect(init).to.exist;
  });

  it("should load subapp if subapp server does not have StartComponent", () => {
    stubRequest.onCall(0).yields(null, {}, JSON.stringify({ data: "abc" }));

    setSubApp("subapp2", conf2, { useReactRouter: true, reduxCreateStore: true });
    const init = setup(
      setupContext3,
      getToken({ name: "subapp2", elementId: "123", hydrateServerData: false })
    );
    init.process(context);
    expect(init).to.exist;
  });

  it("should load subapp if CreateElement throws", () => {
    stubRequest.onCall(0).yields(null, {}, JSON.stringify({ data: "abc" }));

    process.env.WEBPACK_DEV = "false";
    setSubApp("subapp1", conf1, { Component: null });
    const init = setup(setupContext3, getToken());
    init.process(context);
    process.env.WEBPACK_DEV = "true";
  });
});
