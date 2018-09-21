const { Http404Error } = require('../errors');

const detectRatePlans = (roomTypeId, ratePlansObject) => {
  for (let ratePlanId in ratePlansObject) {
    ratePlansObject[ratePlanId].id = ratePlanId;
  }
  return Object.values(ratePlansObject)
    .filter((rp) => rp.roomTypeIds && rp.roomTypeIds.indexOf(roomTypeId) > -1)
    .reduce((result, plan) => {
      result[plan.id] = plan;
      return result;
    }, {});
};

const detectAvailability = (roomTypeId, availabilityObject) => {
  let availability = availabilityObject && availabilityObject.latestSnapshot.availability[roomTypeId];
  return {
    updatedAt: availabilityObject && availabilityObject.latestSnapshot.updatedAt,
    availability: {
      [roomTypeId]: availability || [],
    },
  };
};

const getPlainHotel = async (hotel, fieldsQuery) => {
  fieldsQuery = fieldsQuery.filter((x) => !!x);
  const resolvedFields = ['descriptionUri.roomTypes'];
  if (fieldsQuery.indexOf('ratePlans') > -1) {
    resolvedFields.push('ratePlansUri');
  }
  if (fieldsQuery.indexOf('availability') > -1) {
    resolvedFields.push('availabilityUri');
  }
  return hotel.toPlainObject(resolvedFields);
};

const findAll = async (req, res, next) => {
  const fieldsQuery = (req.query.fields && req.query.fields.split(',')) || [];
  try {
    const plainHotel = await getPlainHotel(res.locals.wt.hotel, fieldsQuery);
    let roomTypes = plainHotel.dataUri.contents.descriptionUri.contents.roomTypes;
    for (let roomTypeId in roomTypes) {
      roomTypes[roomTypeId].id = roomTypeId;
      if (fieldsQuery.indexOf('ratePlans') > -1) {
        roomTypes[roomTypeId].ratePlans = detectRatePlans(roomTypeId, plainHotel.dataUri.contents.ratePlansUri.contents);
      }
      if (fieldsQuery.indexOf('availability') > -1) {
        roomTypes[roomTypeId].availability = detectAvailability(roomTypeId, plainHotel.dataUri.contents.availabilityUri.contents);
      }
    }
    res.status(200).json(roomTypes);
  } catch (e) {
    next(e);
  }
};

const find = async (req, res, next) => {
  let { roomTypeId } = req.params;
  const fieldsQuery = (req.query.fields && req.query.fields.split(',')) || [];
  try {
    const plainHotel = await getPlainHotel(res.locals.wt.hotel, fieldsQuery);
    let roomTypes = plainHotel.dataUri.contents.descriptionUri.contents.roomTypes;
    let roomType = roomTypes[roomTypeId];
    if (!roomType) {
      return next(new Http404Error('roomTypeNotFound', 'Room type not found'));
    }
    roomType.id = roomTypeId;
    if (fieldsQuery.indexOf('ratePlans') > -1) {
      roomType.ratePlans = detectRatePlans(roomTypeId, plainHotel.dataUri.contents.ratePlansUri.contents);
    }
    if (fieldsQuery.indexOf('availability') > -1) {
      roomType.availability = detectAvailability(roomTypeId, plainHotel.dataUri.contents.availabilityUri.contents);
    }
    res.status(200).json(roomType);
  } catch (e) {
    next(e);
  }
};

const findRatePlans = async (req, res, next) => {
  let { roomTypeId } = req.params;
  try {
    let plainHotel = await getPlainHotel(res.locals.wt.hotel, ['ratePlans']);
    
    let roomTypes = plainHotel.dataUri.contents.descriptionUri.contents.roomTypes;
    let roomType = roomTypes[roomTypeId];
    if (!roomType) {
      return next(new Http404Error('roomTypeNotFound', 'Room type not found'));
    }
    if (!plainHotel.dataUri.contents.ratePlansUri) {
      return next(new Http404Error('noRatePlans', 'No ratePlansUri specified.'));
    }
    const ratePlans = detectRatePlans(roomTypeId, plainHotel.dataUri.contents.ratePlansUri.contents);
    res.status(200).json(ratePlans);
  } catch (e) {
    next(e);
  }
};

const findAvailability = async (req, res, next) => {
  let { roomTypeId } = req.params;
  try {
    let plainHotel = await getPlainHotel(res.locals.wt.hotel, ['availability']);
    
    let roomTypes = plainHotel.dataUri.contents.descriptionUri.contents.roomTypes;
    let roomType = roomTypes[roomTypeId];
    if (!roomType) {
      return next(new Http404Error('roomTypeNotFound', 'Room type not found'));
    }
    if (!plainHotel.dataUri.contents.availabilityUri) {
      return next(new Http404Error('noAvailability', 'No availabilityUri specified.'));
    }
    res.status(200).json(detectAvailability(roomTypeId, plainHotel.dataUri.contents.availabilityUri.contents));
  } catch (e) {
    next(e);
  }
};

module.exports = {
  findAll,
  find,
  findRatePlans,
  findAvailability,
};
