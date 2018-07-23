const wtJsLibs = require('../services/wt-js-libs');
const { handleApplicationError } = require('../errors');
const config = require('../config');

const injectWtLibs = async (req, res, next) => {
  if (res.locals.wt) {
    next();
  }
  const wtLibsInstance = wtJsLibs.getInstance();
  res.locals.wt = {
    instance: wtLibsInstance,
    index: await wtJsLibs.getWTIndex(),
  };
  next();
};

const validateIPWhiteList = function (req, res, next) {
  const whiteList = config.whiteList;
  if (!whiteList.length) {
    return next();
  }
  let ip = req.ip ||
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

  if (ip.substr(0, 7) === '::ffff:') {
    ip = ip.substr(7);
  }
  if (whiteList.indexOf(ip) === -1) {
    return next(handleApplicationError('whiteList', new Error()));
  }
  next();
};

const validateHotelAddress = (req, res, next) => {
  const { hotelAddress } = req.params;
  const { wt } = res.locals;
  if (!wt.instance.dataModel.web3Instance.utils.checkAddressChecksum(hotelAddress)) {
    return next(handleApplicationError('hotelChecksum'));
  }

  next();
};

module.exports = {
  injectWtLibs,
  validateIPWhiteList,
  validateHotelAddress,
};
