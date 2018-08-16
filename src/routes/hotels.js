const express = require('express');
const {
  injectWtLibs,
  validateHotelAddress,
  resolveHotel,
  handleOnChainErrors,
} = require('../middlewares');
const hotelsController = require('../controllers/hotels');
const roomTypesController = require('../controllers/room-types');
const ratePlansController = require('../controllers/rate-plans');

const hotelsRouter = express.Router();

hotelsRouter.get('/hotels', injectWtLibs, hotelsController.findAll, handleOnChainErrors);
hotelsRouter.get('/hotels/:hotelAddress', injectWtLibs, validateHotelAddress, resolveHotel, hotelsController.find, handleOnChainErrors);

hotelsRouter.get('/hotels/:hotelAddress/roomTypes', injectWtLibs, validateHotelAddress, resolveHotel, roomTypesController.findAll, handleOnChainErrors);
hotelsRouter.get('/hotels/:hotelAddress/roomTypes/:roomTypeId', injectWtLibs, validateHotelAddress, resolveHotel, roomTypesController.find, handleOnChainErrors);
hotelsRouter.get('/hotels/:hotelAddress/roomTypes/:roomTypeId/ratePlans', injectWtLibs, validateHotelAddress, resolveHotel, roomTypesController.findRatePlans, handleOnChainErrors);

hotelsRouter.get('/hotels/:hotelAddress/ratePlans', injectWtLibs, validateHotelAddress, resolveHotel, ratePlansController.findAll, handleOnChainErrors);
hotelsRouter.get('/hotels/:hotelAddress/ratePlans/:ratePlanId', injectWtLibs, validateHotelAddress, resolveHotel, ratePlansController.find, handleOnChainErrors);

module.exports = {
  hotelsRouter,
};
