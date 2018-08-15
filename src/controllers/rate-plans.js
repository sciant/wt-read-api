const { Http404Error } = require('../errors');

// TODO use toPlainObject
const findAll = async (req, res, next) => {
  let { hotelAddress } = req.params;
  const { wt } = res.locals;

  try {
    let hotel = await wt.index.getHotel(hotelAddress);
    const indexRow = (await hotel.dataIndex).contents;
    const ratePlansDocument = (await indexRow.ratePlansUri).contents;
    let ratePlans = await ratePlansDocument.ratePlans;
    for (let ratePlanId in ratePlans) {
      ratePlans[ratePlanId].id = ratePlanId;
    }
    res.status(200).json(ratePlans);
  } catch (e) {
    next(e);
  }
};

// TODO use toPlainObject
const find = async (req, res, next) => {
  let { hotelAddress, ratePlanId } = req.params;
  const { wt } = res.locals;
  try {
    let WTHotel = await wt.index.getHotel(hotelAddress);
    const indexRow = (await WTHotel.dataIndex).contents;
    const ratePlansDocument = (await indexRow.ratePlansUri).contents;
    let ratePlan = (await ratePlansDocument.ratePlans)[ratePlanId];
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
