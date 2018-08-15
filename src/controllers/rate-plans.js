const { Http404Error } = require('../errors');

const findAll = async (req, res, next) => {
  let { hotelAddress } = req.params;
  const { wt } = res.locals;

  try {
    let hotel = await wt.index.getHotel(hotelAddress);
    let plainHotel = await hotel.toPlainObject(['ratePlansUri']);
    let ratePlans = plainHotel.dataUri.contents.ratePlansUri.contents;
    for (let ratePlanId in ratePlans) {
      ratePlans[ratePlanId].id = ratePlanId;
    }
    res.status(200).json(ratePlans);
  } catch (e) {
    next(e);
  }
};

const find = async (req, res, next) => {
  let { hotelAddress, ratePlanId } = req.params;
  const { wt } = res.locals;
  try {
    let hotel = await wt.index.getHotel(hotelAddress);
    let plainHotel = await hotel.toPlainObject(['ratePlansUri']);
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
