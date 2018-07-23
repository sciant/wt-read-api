const DEFAULT_HOTEL_FIELDS = 'id,location,name,description,contacts,address,currency,images,amenities,updatedAt';
const DEFAULT_HOTELS_FIELDS = 'id,location,name';

const OBLIGATORY_FIELDS = ['id'];
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
];

const HOTEL_FIELDS = [
  'manager',
  'id',
];

const DEFAULT_PAGE_SIZE = 30;
const MAX_PAGE_SIZE = 300;

module.exports = {
  OBLIGATORY_FIELDS,
  DESCRIPTION_FIELDS,
  HOTEL_FIELDS,
  DEFAULT_HOTELS_FIELDS,
  DEFAULT_HOTEL_FIELDS,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
};
