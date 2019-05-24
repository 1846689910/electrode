module.exports = {
  name: "subapp2-server",
  listen: (port = 8080) => `server is listening on port: ${port}`
  // prepare: async () => ({
  //   initialState: {},
  //   store: { subscribe() {}, getState() {}, dispatch() {} }
  // })
};
