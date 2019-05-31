// require("@babel/register")({
//   ignore: [/(node_modules)/],
//   presets: ["@babel/preset-env"],
//   plugins: ["@babel/plugin-proposal-class-properties"]
// });
// require("core-js");
// require("regenerator-runtime/runtime");
// const { defaultRenderStart, loadSubApp } = require("../../../src");
// const sinon = require("sinon");
// const ReactDOM = require("react-dom");

// describe("subapp-web", () => {
//   describe("defaultRenderStart", () => {
//     let component;

//     before(() => {
//       this.stubHydrate = sinon.stub(ReactDOM, "hydrate").callsFake(() => {
//         component = "hydrate";
//       });
//       this.stubRender = sinon.stub(ReactDOM, "render").callsFake(() => {
//         component = "render";
//       });
//     });

//     after(() => {
//       component = "";
//       this.stubHydrate.restore();
//       this.stubRender.restore();
//     });

//     it("should render component if not serverSideRendering", () => {
//       defaultRenderStart("div", false, "div");
//       expect(component).to.equal("render");
//     });

//     it("should hydrate component if serverSideRendering", () => {
//       defaultRenderStart("div", true, "div");
//       expect(component).to.equal("hydrate");
//     });
//   });

//   describe("loadSubApp", () => {
//     it("should load subapp", () => {
//       loadSubApp({ name: "subapp1" });
//     });
//   });
// });
