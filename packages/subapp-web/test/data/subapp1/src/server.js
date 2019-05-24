module.exports = {
  name: "subapp1-server",
  listen: (port = 8080) => `server is listening on port: ${port}`,
  StartComponent: "div",
  prepare: async () => ({
    initialState: {},
    store: { subscribe() {}, getState() {}, dispatch() {} }
  })
};
