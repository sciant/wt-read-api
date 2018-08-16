const DEFAULT_HOTEL_FIELDS = 'id,location,name,description,contacts,address,currency,images,amenities,updatedAt';
const DEFAULT_HOTELS_FIELDS = 'id,location,name';

const HOTEL_FIELDS = [
  'manager',
];

const DESCRIPTION_FIELDS = [
  'name',
  'description',
  'location',
  'contacts',
  'address',
  'roomTypes',
  'timezone',
  'currency',
  'images',
  'amenities',
  'updatedAt',
  'cancellationPolicies',
];

const RATE_PLANS_FIELDS = [
  'ratePlans',
];

const DEFAULT_PAGE_SIZE = 30;
const MAX_PAGE_SIZE = 300;

module.exports = {
  DESCRIPTION_FIELDS,
  HOTEL_FIELDS,
  RATE_PLANS_FIELDS,
  DEFAULT_HOTELS_FIELDS,
  DEFAULT_HOTEL_FIELDS,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
};
