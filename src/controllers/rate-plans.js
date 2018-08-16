const { Http404Error } = require('../errors');

const findAll = async (req, res, next) => {
  try {
    let plainHotel = await res.locals.wt.hotel.toPlainObject(['ratePlansUri']);
    let ratePlans = plainHotel.dataUri.contents.ratePlansUri.contents.ratePlans;
    for (let ratePlanId in ratePlans) {
      ratePlans[ratePlanId].id = ratePlanId;
    }
    res.status(200).json(ratePlans);
  } catch (e) {
    next(e);
  }
};

const find = async (req, res, next) => {
  let { ratePlanId } = req.params;
  try {
    let plainHotel = await res.locals.wt.hotel.toPlainObject(['ratePlansUri']);
    const ratePlans = plainHotel.dataUri.contents.ratePlansUri.contents.ratePlans;
    let ratePlan = ratePlans[ratePlanId];
    if (!ratePlan) {
      return next(new Http404Error('ratePlanNotFound', 'Rate plan not found'));
    }
    ratePlan.id = ratePlanId;
    res.status(200).json(ratePlan);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  findAll,
  find,
};
