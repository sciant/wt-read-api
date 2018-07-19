/* eslint-env mocha */
const { expect } = require('chai');
const web3 = require('web3');
const request = require('supertest');
const wtJsLibs = require('../../src/services/wt-js-libs');
const {
  deployIndex,
  deployFullHotel,
} = require('../../scripts/local-network');
const {
  HOTEL_DESCRIPTION,
  RATE_PLAN,
} = require('../utils/test-data');

describe('Room types', function () {
  let server;
  let wtLibsInstance;
  let address, indexContract;

  beforeEach(async () => {
    server = require('../../src/index');
    const config = require('../../src/config');
    wtLibsInstance = wtJsLibs.getInstance();
    indexContract = await deployIndex();
    config.wtIndexAddress = indexContract.address;
    address = web3.utils.toChecksumAddress(await deployFullHotel(await wtLibsInstance.getOffChainDataClient('json'), indexContract, HOTEL_DESCRIPTION, RATE_PLAN));
  });

  afterEach(() => {
    server.close();
  });

  describe('GET /hotels/:hotelAddress/roomTypes', () => {
    it('should return room types', async () => {
      await request(server)
        .get(`/hotels/${address}/roomTypes`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          expect(res.body).to.eql(HOTEL_DESCRIPTION.roomTypes);
          for (let roomType in res.body) {
            expect(res.body[roomType]).to.have.property('id');
          }
        });
    });
  });

  describe('GET /hotels/:hotelAddress/roomTypes/:roomTypeId', () => {
    it('should return a room type ', async () => {
      await request(server)
        .get(`/hotels/${address}/roomTypes/room-type-1111`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          expect(res.body).to.have.property('id', 'room-type-1111');
        });
    });

    it('should return 404', async () => {
      await request(server)
        .get(`/hotels/${address}/roomTypes/room-type-0000}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(404);
    });
  });
});
