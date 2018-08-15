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
  'cancellationPolicies': [
    {
      'amount': 100,
    },
  ],
};

const RATE_PLANS = {
  'ratePlans': {
    'rate-plan-1': {
      'name': 'rate plan 1',
      'description': 'string',
      'currency': 'string',
      'price': 123,
      'roomTypeIds': [
        'room-type-1111',
      ],
      'updatedAt': '2018-07-09T09:22:54.548Z',
      'availableForReservation': {
        'from': '2018-07-09',
        'to': '2018-07-09',
      },
      'availableForTravel': {
        'from': '2018-07-09',
        'to': '2018-07-09',
      },
      'modifiers': [
        {
          'from': '2018-01-30',
          'to': '2018-02-20',
          'adjustment': -3.1,
          'conditions': {
            'minLengthOfStay': 2,
            'maxAge': 0,
          },
        },
      ],
      'restrictions': {
        'bookingCutOff': {
          'min': 0,
          'max': 5,
        },
        'lengthOfStay': {
          'min': 0,
          'max': 5,
        },
      },
    },
  },
  'rate-plan-2': {
    'name': 'rate plan 2',
    'description': 'string',
    'currency': 'string',
    'price': 123,
    'roomTypeIds': [
      'room-type-3333',
    ],
    'updatedAt': '2018-07-09T09:22:54.548Z',
    'availableForReservation': {
      'from': '2018-07-09',
      'to': '2018-07-09',
    },
    'availableForTravel': {
      'from': '2018-07-09',
      'to': '2018-07-09',
    },
    'modifiers': [
      {
        'from': '2018-01-30',
        'to': '2018-02-20',
        'adjustment': -3.1,
        'conditions': {
          'minLengthOfStay': 2,
          'maxAge': 0,
        },
      },
    ],
    'restrictions': {
      'bookingCutOff': {
        'min': 0,
        'max': 5,
      },
      'lengthOfStay': {
        'min': 0,
        'max': 5,
      },
    },
  },
};

module.exports = {
  HOTEL_DESCRIPTION,
  RATE_PLANS,
};
