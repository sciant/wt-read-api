const WtJsLibs = require('@windingtree/wt-js-libs');
const SwarmAdapter = require('@windingtree/off-chain-adapter-swarm');
const HttpAdapter = require('@windingtree/off-chain-adapter-http');
const winston = require('winston');

module.exports = {
  wtIndexAddress: '0x407f550023eb6ad8a4797844489e17c5ced17e06',
  port: 3000,
  baseUrl: process.env.BASE_URL || 'https://demo-api.windingtree.com',
  wtLibs: WtJsLibs.createInstance({
    dataModelOptions: {
      provider: 'https://ropsten.infura.io/WKNyJ0kClh8Ao5LdmO7z',
    },
    offChainDataOptions: {
      adapters: {
        'bzz-raw': {
          options: {
            swarmProviderUrl: 'https://swarm-gateways.net/',
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
  whiteList: [],
  logHttpTraffic: true,
  logger: winston.createLogger({
    level: 'debug',
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ],
  }),
};
