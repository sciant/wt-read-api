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
  RATE_PLANS,
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
    address = web3.utils.toChecksumAddress(await deployFullHotel(await wtLibsInstance.getOffChainDataClient('in-memory'), indexContract, HOTEL_DESCRIPTION, RATE_PLANS));
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

    it('should include ratePlans if fields is present', async () => {
      await request(server)
        .get(`/hotels/${address}/roomTypes?fields=ratePlans`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          expect(res.body).to.eql(HOTEL_DESCRIPTION.roomTypes);
          for (let roomType in res.body) {
            expect(res.body[roomType]).to.have.property('id');
            expect(res.body[roomType]).to.have.property('ratePlans');
          }
        });
    });

    it('should return 404 for non existing hotel', async () => {
      await request(server)
        .get(`/hotels/${address}/roomTypes/room-type-0000`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(404);
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

    it('should include ratePlans if fields is present', async () => {
      await request(server)
        .get(`/hotels/${address}/roomTypes/room-type-1111?fields=ratePlans`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          expect(res.body).to.have.property('id', 'room-type-1111');
          expect(res.body).to.have.property('ratePlans');
          expect(Object.values(res.body.ratePlans).length).to.be.eql(1);
        });
    });

    it('should return 404 for non existing room type', async () => {
      await request(server)
        .get(`/hotels/${address}/roomTypes/room-type-0000`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(404);
    });
  });

  describe('GET /hotels/:hotelAddress/roomTypes/:roomTypeId/ratePlans', () => {
    it('should return all appropriate rate plans', async () => {
      await request(server)
        .get(`/hotels/${address}/roomTypes/room-type-1111/ratePlans`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          const ratePlans = Object.values(res.body);
          expect(ratePlans.length).to.be.eql(1);
          expect(ratePlans[0]).to.have.property('id', 'rate-plan-1');
        });
    });

    it('should return empty object if no rate plans are associated', async () => {
      await request(server)
        .get(`/hotels/${address}/roomTypes/room-type-2222/ratePlans`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(200)
        .expect((res) => {
          const ratePlans = Object.values(res.body);
          expect(ratePlans.length).to.be.eql(0);
        });
    });
  });
});
