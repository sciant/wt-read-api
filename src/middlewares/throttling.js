const RateLimit = require('express-rate-limit');
const { handleApplicationError } = require('../errors');

let isThrottlingOff = false;

const turnOffThrottling = () => {
  isThrottlingOff = true;
};

const turnOnThrottling = () => {
  isThrottlingOff = false;
};

const handler = (req, res, next) => {
  next(handleApplicationError('rateLimit'));
};

const createThrottlingInstance = ({ windowMs = 60000, delayAfter = 2, delayMs = 1000, max = 5 } = {}) => {
  return new RateLimit({
    windowMs: windowMs,
    delayAfter: delayAfter,
    delayMs: delayMs,
    max: max,
    handler,
    skip: (req, res) => isThrottlingOff,
  });
};

module.exports = {
  createThrottlingInstance,
  turnOffThrottling,
  turnOnThrottling,
};
