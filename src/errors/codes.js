module.exports = {
  genericError: {
    status: 500,
    short: 'Something went wrong.',
    long: 'Something went wrong. Please contact the administrator.',
  },
  unreachableChain: {
    status: 500,
    short: 'Ethereum network seems unreachable.',
    long: 'Please contact the administrator.',
  },
  hotelNotFound: {
    status: 404,
    short: 'Hotel not found',
  },
  hotelNotAccessible: {
    status: 502,
    short: 'Hotel data is not accessible',
  },
  rateLimit: {
    status: 429,
    short: 'API rate Limit Exceeded',
    long: 'The rate limit was exceeded. Please try later.',
  },
  hotelChecksum: {
    status: 422,
    short: 'Checksum failed for hotel address.',
    long: 'Given hotel address is not a valid Ethereum address. Must be a valid checksum address.',
  },
  paginationLimitError: {
    status: 422,
    short: 'Bad limit parameter.',
    long: 'Limit must be a natural number greater than 0.',
  },
  paginationStartWithError: {
    status: 404,
    short: 'startWith does not exist.',
    long: 'Cannot find startWith in hotel collection.',
  },
  roomTypeNotFound: {
    status: 404,
    short: 'Room type not found',
  },
};
