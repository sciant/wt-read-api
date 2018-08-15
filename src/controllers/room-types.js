const { Http404Error } = require('../errors');

const findAll = async (req, res, next) => {
  let { hotelAddress } = req.params;
  const { wt } = res.locals;

  try {
    let hotel = await wt.index.getHotel(hotelAddress);
    let plainHotel = await hotel.toPlainObject(['descriptionUri.roomTypes']);
    let roomTypes = plainHotel.dataUri.contents.descriptionUri.contents.roomTypes;
    for (let roomTypeId in roomTypes) {
      roomTypes[roomTypeId].id = roomTypeId;
    }
    res.status(200).json(roomTypes);
  } catch (e) {
    next(e);
  }
};

const find = async (req, res, next) => {
  let { hotelAddress, roomTypeId } = req.params;
  const { wt } = res.locals;
  try {
    let hotel = await wt.index.getHotel(hotelAddress);
    let plainHotel = await hotel.toPlainObject(['descriptionUri.roomTypes']);
    let roomTypes = plainHotel.dataUri.contents.descriptionUri.contents.roomTypes;
    let roomType = roomTypes[roomTypeId];
    if (!roomType) {
      return next(new Http404Error('roomTypeNotFound', 'Room type not found'));
    }
    roomType.id = roomTypeId;
    res.status(200).json(roomType);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  findAll,
  find,
};
