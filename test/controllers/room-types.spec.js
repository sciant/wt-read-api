/* eslint-env mocha */
const { expect } = require('chai');
const web3 = require('web3');
const request = require('supertest');
const sinon = require('sinon');
const wtJsLibsWrapper = require('../../src/services/wt-js-libs');
const {
  deployIndex,
  deployFullHotel,
} = require('../../scripts/local-network');
const {
  HOTEL_DESCRIPTION,
  RATE_PLANS,
  AVAILABILITY,
} = require('../utils/test-data');
const {
  FakeHotelWithBadOffChainData,
} = require('../utils/fake-hotels');

describe('Room types', function () {
  let server;
  let wtLibsInstance;
  let address, indexContract;

  beforeEach(async () => {
    server = require('../../src/index');
    const config = require('../../src/config');
    wtLibsInstance = wtJsLibsWrapper.getInstance();
    indexContract = await deployIndex();
    config.wtIndexAddress = indexContract.address;
    address = web3.utils.toChecksumAddress(await deployFullHotel(await wtLibsInstance.getOffChainDataClient('in-memory'), indexContract, HOTEL_DESCRIPTION, RATE_PLANS, AVAILABILITY));
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

    it('should include availability if fields is present', async () => {
      await request(server)
        .get(`/hotels/${address}/roomTypes?fields=availability`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          expect(res.body).to.eql(HOTEL_DESCRIPTION.roomTypes);
          for (let roomType in res.body) {
            expect(res.body[roomType]).to.have.property('id');
            expect(res.body[roomType]).to.have.property('availability');
          }
          console.log(res.body);
        });
    });

    it('should return 404 for non existing hotel', async () => {
      await request(server)
        .get('/hotels/0x0Fd60495d705F4Fb86e1b36Be396757689FbE8B3/roomTypes/room-type-0000')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(404);
    });

    it('should return bad gateway for inaccessible data', async () => {
      sinon.stub(wtJsLibsWrapper, 'getWTIndex').resolves({
        getHotel: sinon.stub().resolves(new FakeHotelWithBadOffChainData()),
      });
      await request(server)
        .get(`/hotels/${address}/roomTypes`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          expect(res.status).to.be.eql(502);
          wtJsLibsWrapper.getWTIndex.restore();
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

    it('should include availability if fields is present', async () => {
      await request(server)
        .get(`/hotels/${address}/roomTypes/room-type-1111?fields=availability`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          expect(res.body).to.have.property('id', 'room-type-1111');
          expect(res.body).to.have.property('availability');
          expect(res.body.availability).to.have.property('updatedAt');
          expect(res.body.availability).to.have.nested.property('availability.room-type-1111');
          expect(res.body.availability.availability['room-type-1111'].length).to.be.eql(9);
        });
    });

    it('should return 404 for non existing room type', async () => {
      await request(server)
        .get(`/hotels/${address}/roomTypes/room-type-0000`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(404);
    });

    it('should return bad gateway for inaccessible data', async () => {
      sinon.stub(wtJsLibsWrapper, 'getWTIndex').resolves({
        getHotel: sinon.stub().resolves(new FakeHotelWithBadOffChainData()),
      });
      await request(server)
        .get(`/hotels/${address}/roomTypes/room-type-1111`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          expect(res.status).to.be.eql(502);
          wtJsLibsWrapper.getWTIndex.restore();
        });
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

    it('should return 404 for non existing hotel', async () => {
      await request(server)
        .get('/hotels/0x0Fd60495d705F4Fb86e1b36Be396757689FbE8B3/roomTypes/room-type-2222/ratePlans')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(404);
    });

    it('should return 404 for non existing room type', async () => {
      await request(server)
        .get(`/hotels/${address}/roomTypes/room-type-0000/ratePlans`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(404);
    });

    it('should return 404 for a hotel without rate plans', async () => {
      const hotel = web3.utils.toChecksumAddress(await deployFullHotel(await wtLibsInstance.getOffChainDataClient('in-memory'), indexContract, HOTEL_DESCRIPTION));
      await request(server)
        .get(`/hotels/${hotel}/roomTypes/room-type-2222/ratePlans`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(404);
    });

    it('should return bad gateway for inaccessible data', async () => {
      sinon.stub(wtJsLibsWrapper, 'getWTIndex').resolves({
        getHotel: sinon.stub().resolves(new FakeHotelWithBadOffChainData()),
      });
      await request(server)
        .get(`/hotels/${address}/roomTypes/room-type-2222/ratePlans`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          expect(res.status).to.be.eql(502);
          wtJsLibsWrapper.getWTIndex.restore();
        });
    });
  });

  describe('GET /hotels/:hotelAddress/roomTypes/:roomTypeId/availability', () => {
    it('should return availability data', async () => {
      await request(server)
        .get(`/hotels/${address}/roomTypes/room-type-1111/availability`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          expect(res.body).to.have.property('updatedAt');
          expect(res.body).to.have.nested.property('availability.room-type-1111');
          expect(res.body.availability['room-type-1111'].length).to.be.eql(9);
        });
    });

    it('should return empty object if no availability is associated', async () => {
      await request(server)
        .get(`/hotels/${address}/roomTypes/room-type-3333/availability`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(200)
        .expect((res) => {
          expect(res.body).to.have.property('updatedAt');
          expect(res.body).to.have.nested.property('availability.room-type-3333');
          expect(res.body.availability['room-type-3333'].length).to.be.eql(0);
        });
    });

    it('should return 404 for non existing hotel', async () => {
      await request(server)
        .get('/hotels/0x0Fd60495d705F4Fb86e1b36Be396757689FbE8B3/roomTypes/room-type-2222/availability')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(404);
    });

    it('should return 404 for non existing room type', async () => {
      await request(server)
        .get(`/hotels/${address}/roomTypes/room-type-0000/availability`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(404);
    });

    it('should return 404 for a hotel without availability', async () => {
      const hotel = web3.utils.toChecksumAddress(await deployFullHotel(await wtLibsInstance.getOffChainDataClient('in-memory'), indexContract, HOTEL_DESCRIPTION, RATE_PLANS));
      await request(server)
        .get(`/hotels/${hotel}/roomTypes/room-type-2222/availability`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(404);
    });

    it('should return bad gateway for inaccessible data', async () => {
      sinon.stub(wtJsLibsWrapper, 'getWTIndex').resolves({
        getHotel: sinon.stub().resolves(new FakeHotelWithBadOffChainData()),
      });
      await request(server)
        .get(`/hotels/${address}/roomTypes/room-type-2222/availability`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          expect(res.status).to.be.eql(502);
          wtJsLibsWrapper.getWTIndex.restore();
        });
    });
  });
});
