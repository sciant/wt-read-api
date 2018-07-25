const WtJsLibs = require('@windingtree/wt-js-libs');
const InMemoryAdapter = require('@windingtree/off-chain-adapter-in-memory');
const SwarmAdapter = require('@windingtree/off-chain-adapter-swarm');
const HttpAdapter = require('@windingtree/off-chain-adapter-http');
const { deployIndex } = require('../../scripts/local-network');

const winston = require('winston');

const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
      handleExceptions: true,
    }),
  ],
});

module.exports = {
  port: 3000,
  baseUrl: 'http://localhost:3000',
  wtIndexAddress: 'will-be-set-during-init',
  wtLibs: WtJsLibs.createInstance({
    dataModelOptions: {
      provider: 'http://localhost:8545',
    },
    offChainDataOptions: {
      adapters: {
        json: {
          create: (options) => {
            return new InMemoryAdapter(options);
          },
        },
        'bzz-raw': {
          options: {
            swarmProviderUrl: 'http://localhost:8500',
          },
          create: (options) => {
            return new SwarmAdapter(options);
          },
        },
        https: {
          create: () => {
            return new HttpAdapter();
          },
        },
      },
    },
  }),
  networkSetup: async (currentConfig) => {
    currentConfig.wtIndexAddress = (await deployIndex()).address;
    logger.info(`Winding Tree index deployed to ${currentConfig.wtIndexAddress}`);
  },
  logHttpTraffic: true,
  logger: logger,
};
