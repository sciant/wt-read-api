const wtJsLibs = require('../services/wt-js-libs');
const { handleApplicationError } = require('../errors');

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
  validateHotelAddress,
};
