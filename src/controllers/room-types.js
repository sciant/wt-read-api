const { handleApplicationError } = require('../errors');

const findAll = async (req, res, next) => {
  let { hotelAddress } = req.params;
  const { wt } = res.locals;

  try {
    let hotel = await wt.index.getHotel(hotelAddress);
    const indexRow = (await hotel.dataIndex).contents;
    const description = (await indexRow.descriptionUri).contents;
    let roomTypes = await description.roomTypes;
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
    let WTHotel = await wt.index.getHotel(hotelAddress);
    const indexRow = (await WTHotel.dataIndex).contents;
    const description = (await indexRow.descriptionUri).contents;
    let roomType = (await description.roomTypes)[roomTypeId];
    if (!roomType) {
      return next(handleApplicationError('roomTypeNotFound'));
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
