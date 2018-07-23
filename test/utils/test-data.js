const HOTEL_DESCRIPTION = {
  'location': {
    'latitude': 35.89421911,
    'longitude': 139.94637467,
  },
  'name': 'string',
  'description': 'string',
  'roomTypes': {
    'room-type-1111': {
      'name': 'string',
      'description': 'string',
      'totalQuantity': 0,
      'occupancy': {
        'min': 1,
        'max': 3,
      },
      'amenities': [
        'TV',
      ],
      'images': [
        'string',
      ],
      'updatedAt': '2018-06-19T13:19:58.190Z',
      'properties': {
        'nonSmoking': 'some',
      },
    },
    'room-type-2222': {
      'name': 'string',
      'description': 'string',
      'totalQuantity': 0,
      'occupancy': {
        'min': 1,
        'max': 3,
      },
      'amenities': [
        'TV',
      ],
      'images': [
        'string',
      ],
      'updatedAt': '2018-06-19T13:19:58.190Z',
      'properties': {
        'nonSmoking': 'some',
      },
    },
    'room-type-3333': {
      'name': 'string',
      'description': 'string',
      'totalQuantity': 0,
      'occupancy': {
        'min': 1,
        'max': 3,
      },
      'amenities': [
        'TV',
      ],
      'images': [
        'string',
      ],
      'updatedAt': '2018-06-19T13:19:58.190Z',
      'properties': {
        'nonSmoking': 'some',
      },
    },

  },
  'contacts': {
    'general': {
      'email': 'joseph.urban@example.com',
      'phone': 44123456789,
      'url': 'string',
      'ethereum': 'string',
      'additionalContacts': [
        {
          'title': 'string',
          'value': 'string',
        },
      ],
    },
  },
  'address': {
    'line1': 'string',
    'line2': 'string',
    'postalCode': 'string',
    'city': 'string',
    'state': 'string',
    'country': 'string',
  },
  'timezone': 'string',
  'currency': 'string',
  'images': [
    'string',
  ],
  'amenities': [
    'WiFi',
  ],
  'updatedAt': '2018-06-19T13:19:58.190Z',
};

const RATE_PLAN = {
  'id': 'rate-plan-1111',
  'name': 'string',
  'description': 'string',
  'currency': 'string',
  'roomTypeIds': [
    'room-type-123',
  ],
  'updatedAt': '2018-07-09T09:22:54.548Z',
  'availableForReservation': {
    'start': '2018-07-09T09:22:54.548Z',
    'end': '2018-07-09T09:22:54.548Z',
  },
  'availableForTravel': {
    'start': '2018-07-09T09:22:54.548Z',
    'end': '2018-07-09T09:22:54.548Z',
  },
  'pricing': {
    'base': {
      'maxOccupancyLimit': 0,
      'rates': [
        {
          'amount': 0,
          'minLengthOfStay': 0,
          'maxAge': 0,
        },
      ],
    },
    'additional': {
      'maxOccupancyLimit': 0,
      'rates': {},
    },
  },
  'restrictions': {
    'bookingCutOff': {
      'min': 0,
      'max': 0,
    },
    'lengthOfStay': {
      'min': 0,
      'max': 0,
    },
  },
};

module.exports = {
  HOTEL_DESCRIPTION,
  RATE_PLAN,
};
