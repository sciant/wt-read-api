const express = require('express');
const {
  injectWtLibs,
  validateHotelAddress,
} = require('../middlewares');
const hotelsController = require('../controllers/hotels');
const roomTypesController = require('../controllers/room-types');

const HOTEL_ROUTE = '/hotels/:hotelAddress';
const HOTELS_ROUTE = '/hotels';
const ROOM_TYPES_ROUTE = '/hotels/:hotelAddress/roomTypes';
const ROOM_TYPE_ROUTE = '/hotels/:hotelAddress/roomTypes/:roomTypeId';

const hotelsRouter = express.Router();

hotelsRouter.get(HOTELS_ROUTE, injectWtLibs, hotelsController.findAll);
hotelsRouter.get(HOTEL_ROUTE, injectWtLibs, validateHotelAddress, hotelsController.find);

hotelsRouter.get(ROOM_TYPES_ROUTE, injectWtLibs, validateHotelAddress, roomTypesController.findAll);
hotelsRouter.get(ROOM_TYPE_ROUTE, injectWtLibs, validateHotelAddress, roomTypesController.find);

module.exports = {
  hotelsRouter,
};
