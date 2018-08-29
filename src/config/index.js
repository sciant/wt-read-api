const winston = require('winston');

const env = process.env.WT_CONFIG || 'dev';

module.exports = Object.assign({
  logger: winston.createLogger({
    level: 'info',
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ],
  }),
  // Allow the 502 status code to be overridden with a custom
  // one as emitting this code is sometimes problematic (e.g.
  // behind cloudflare's servers).
  badGatewayStatus: process.env.WT_BAD_GATEWAY_CODE || 502,
}, require(`./${env}`));
