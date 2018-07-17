const _ = require('lodash');
const wtJsLibs = require('@windingtree/wt-js-libs');
const { handleApplicationError } = require('../errors');
const {
  DEFAULT_HOTELS_FIELDS,
  DEFAULT_HOTEL_FIELDS,
  OBLIGATORY_FIELDS,
  HOTEL_FIELDS,
  DESCRIPTION_FIELDS,
} = require('../constants');
const {
  mapHotelObjectToResponse,
  mapHotelFieldsFromQuery,
} = require('../services/property-mapping');
const {
  paginate,
  LimitValidationError,
  MissingStartWithError,
} = require('../services/pagination');

// Helpers

const VALID_FIELDS = _.union(HOTEL_FIELDS, DESCRIPTION_FIELDS);

const pickAndResolveFields = (contents, fields) => {
  return fields.reduce(async (plainContent, field) => {
    plainContent = await plainContent;
    plainContent[field] = await contents[field];
    if (field === 'roomTypes') {
      for (let roomTypeId in plainContent[field]) {
        plainContent[field][roomTypeId].id = roomTypeId;
      }
    }
    return plainContent;
  }, {});
};

const resolveHotelObject = async (hotel, fields) => {
  let indexProperties;
  let descriptionProperties;
  const indexFields = _.intersection(fields, HOTEL_FIELDS);
  if (indexFields.length) {
    indexProperties = pickAndResolveFields(hotel, indexFields);
  }
  try {
    const descriptionFields = _.intersection(fields, DESCRIPTION_FIELDS);
    if (descriptionFields.length) {
      const indexContents = (await hotel.dataIndex).contents;
      const description = (await indexContents.descriptionUri).contents;
      descriptionProperties = pickAndResolveFields(description, descriptionFields);
    }
  } catch (e) {
    let message = 'Cannot get hotel data';
    if (e instanceof wtJsLibs.errors.RemoteDataReadError) {
      message = 'Cannot access on-chain data, maybe the deployed smart contract is broken';
    }
    if (e instanceof wtJsLibs.errors.StoragePointerError) {
      message = 'Cannot access off-chain data';
    }
    return {
      id: hotel.address,
      error: message,
      data: {
        originalMessage: e.message,
      },
    };
  }

  return mapHotelObjectToResponse({
    ...(await indexProperties),
    ...(await descriptionProperties),
    id: hotel.address,
  });
};

const calculateFields = (fieldsQuery) => {
  const fieldsArray = fieldsQuery.split(',');
  const mappedFields = mapHotelFieldsFromQuery(fieldsArray);
  return _.intersection(
    VALID_FIELDS,
    _.union(OBLIGATORY_FIELDS, mappedFields)
  );
};

// Actual controllers

const findAll = async (req, res, next) => {
  const { limit, startWith } = req.query;
  const fieldsQuery = req.query.fields || DEFAULT_HOTELS_FIELDS;
  const fields = calculateFields(fieldsQuery);

  try {
    let hotels = await res.locals.wt.index.getAllHotels();
    let { items, next } = paginate(req.path, hotels, limit, startWith, 'address');
    let rawHotels = [];
    for (let hotel of items) {
      rawHotels.push(resolveHotelObject(hotel, fields));
    }
    items = await Promise.all(rawHotels);
    res.status(200).json({ items, next });
  } catch (e) {
    if (e instanceof LimitValidationError) {
      return next(handleApplicationError('paginationLimitError', e));
    }
    if (e instanceof MissingStartWithError) {
      return next(handleApplicationError('paginationStartWithError', e));
    }
    next(e);
  }
};

const find = async (req, res, next) => {
  let { hotelAddress } = req.params;
  const fieldsQuery = req.query.fields || DEFAULT_HOTEL_FIELDS;
  const { wt } = res.locals;
  const fields = calculateFields(fieldsQuery);
  let hotel;
  try {
    hotel = await wt.index.getHotel(hotelAddress);
  } catch (e) {
    return next(handleApplicationError('hotelNotFound', e));
  }
  if (!hotel) {
    return next(handleApplicationError('hotelNotFound'));
  }

  try {
    const resolvedHotel = await resolveHotelObject(hotel, fields);
    if (resolvedHotel.error) {
      return next(handleApplicationError('hotelNotAccessible', {
        message: resolvedHotel.error,
      }));
    }
    return res.status(200).json(resolvedHotel);
  } catch (e) {
    return next(handleApplicationError('hotelNotAccessible', e));
  }
};

module.exports = {
  find,
  findAll,
};
