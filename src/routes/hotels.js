const express = require('express');
const {
  injectWtLibs,
  validateHotelAddress,
  handleOnChainErrors,
} = require('../middlewares');
const hotelsController = require('../controllers/hotels');
const roomTypesController = require('../controllers/room-types');
const ratePlansController = require('../controllers/rate-plans');

const hotelsRouter = express.Router();

hotelsRouter.get('/hotels', injectWtLibs, hotelsController.findAll, handleOnChainErrors);
hotelsRouter.get('/hotels/:hotelAddress', injectWtLibs, validateHotelAddress, hotelsController.find, handleOnChainErrors);

hotelsRouter.get('/hotels/:hotelAddress/roomTypes', injectWtLibs, validateHotelAddress, roomTypesController.findAll, handleOnChainErrors);
hotelsRouter.get('/hotels/:hotelAddress/roomTypes/:roomTypeId', injectWtLibs, validateHotelAddress, roomTypesController.find, handleOnChainErrors);
// TODO
// hotelsRouter.get('/hotels/:hotelAddress/roomTypes/:roomTypeId/ratePlans', injectWtLibs, validateHotelAddress, roomTypesController.findRatePlans, handleOnChainErrors);

hotelsRouter.get('/hotels/:hotelAddress/ratePlans', injectWtLibs, validateHotelAddress, ratePlansController.findAll, handleOnChainErrors);
hotelsRouter.get('/hotels/:hotelAddress/ratePlans/:ratePlanId', injectWtLibs, validateHotelAddress, ratePlansController.find, handleOnChainErrors);

module.exports = {
  hotelsRouter,
};
