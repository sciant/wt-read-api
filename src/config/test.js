const WtJsLibs = require('@windingtree/wt-js-libs');
const InMemoryAdapter = require('@windingtree/off-chain-adapter-in-memory');

module.exports = {
  port: 8100,
  baseUrl: 'http://example.com',
  wtIndexAddress: 'will-be-set-during-init',
  wtLibs: WtJsLibs.createInstance({
    dataModelOptions: {
      provider: 'http://localhost:8545',
    },
    offChainDataOptions: {
      adapters: {
        json: {
          options: { },
          create: (options) => {
            return new InMemoryAdapter(options);
          },
        },
      },
    },
  }),
  logHttpTraffic: false,
};
