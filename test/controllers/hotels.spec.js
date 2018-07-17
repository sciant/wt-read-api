/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const sinon = require('sinon');
const request = require('supertest');
const wtJsLibs = require('@windingtree/wt-js-libs');
const wtJsLibsWrapper = require('../../src/services/wt-js-libs');
const {
  deployIndex,
  deployFullHotel,
} = require('../../scripts/local-network');
const {
  HOTEL_DESCRIPTION,
  RATE_PLAN,
} = require('../utils/test-data');

const web3 = require('web3');

let fakeHotelCounter = 1;

class FakeNiceHotel {
  constructor () {
    this.address = `nice-hotel-${fakeHotelCounter++}`;
  }
  get dataIndex () {
    return Promise.resolve({
      contents: {
        get descriptionUri () {
          return Promise.resolve({
            contents: {
              name: 'nice hotel',
            },
          });
        },
      },
    });
  }
}
      
class FakeHotelWithBadOnChainData {
  constructor () {
    this.address = `fake-hotel-on-chain-${fakeHotelCounter++}`;
  }
  get dataIndex () {
    throw new wtJsLibs.errors.RemoteDataReadError('something');
  }
}
      
class FakeHotelWithBadOffChainData {
  constructor () {
    this.address = `fake-hotel-off-chain-${fakeHotelCounter++}`;
  }
  get dataIndex () {
    throw new wtJsLibs.errors.StoragePointerError('something');
  }
}

describe('Hotels', function () {
  let server;
  let wtLibsInstance, indexContract;
  let hotel0address, hotel1address;
  beforeEach(async () => {
    server = require('../../src/index');
    const config = require('../../src/config');
    wtLibsInstance = wtJsLibsWrapper.getInstance();
    indexContract = await deployIndex();
    config.wtIndexAddress = indexContract.address;
  });

  afterEach(() => {
    server.close();
  });

  describe('GET /hotels', () => {
    beforeEach(async () => {
      hotel0address = await deployFullHotel(await wtLibsInstance.getOffChainDataClient('json'), indexContract, HOTEL_DESCRIPTION, RATE_PLAN);
      hotel1address = await deployFullHotel(await wtLibsInstance.getOffChainDataClient('json'), indexContract, HOTEL_DESCRIPTION, RATE_PLAN);
    });

    it('should return default fields for hotels', async () => {
      await request(server)
        .get('/hotels')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(200)
        .expect((res) => {
          const { items, errors } = res.body;
          expect(items.length).to.be.eql(2);
          expect(errors.length).to.be.eql(0);
          expect(items[0]).to.have.property('id', hotel0address);
          expect(items[0]).to.have.property('name');
          expect(items[0]).to.have.property('location');
          expect(items[1]).to.have.property('id', hotel1address);
          expect(items[1]).to.have.property('name');
          expect(items[1]).to.have.property('location');
        });
    });

    it('should return errors if they happen to individual hotels', async () => {
      sinon.stub(wtJsLibsWrapper, 'getWTIndex').resolves({
        getAllHotels: sinon.stub().resolves([new FakeNiceHotel(), new FakeHotelWithBadOnChainData()]),
      });
      await request(server)
        .get('/hotels')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(200)
        .expect((res) => {
          const { items, errors } = res.body;
          expect(items.length).to.be.eql(1);
          expect(errors.length).to.be.eql(1);
          wtJsLibsWrapper.getWTIndex.restore();
        });
    });

    xit('should try to fullfill the requested limit of valid hotels', async () => {
      sinon.stub(wtJsLibsWrapper, 'getWTIndex').resolves({
        getAllHotels: sinon.stub().resolves([new FakeHotelWithBadOnChainData(), new FakeHotelWithBadOffChainData(), new FakeNiceHotel()]),
      });
      await request(server)
        .get('/hotels?limit=1')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(200)
        .expect((res) => {
          const { items, errors } = res.body;
          expect(items.length).to.be.eql(1);
          expect(errors.length).to.be.eql(2);
          wtJsLibsWrapper.getWTIndex.restore();
        });
    });

    it('should return all fields that a client asks for', async () => {
      const fields = [
        'managerAddress',
        'id',
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
      const query = `fields=${fields.join()}`;

      await request(server)
        .get(`/hotels?${query}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(200)
        .expect((res) => {
          const { items } = res.body;
          expect(items.length).to.be.eql(2);
          items.forEach(hotel => {
            expect(hotel).to.have.all.keys(fields);
            for (let roomType in hotel.roomTypes) {
              expect(hotel.roomTypes[roomType]).to.have.property('id');
            }
          });
        });
    });

    it('should apply limit', async () => {
      await request(server)
        .get('/hotels?limit=1')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          const { items, next } = res.body;
          expect(items.length).to.be.eql(1);
          expect(next).to.be.eql(`http://example.com/hotels?limit=1&startWith=${hotel1address}`);

          items.forEach(hotel => {
            expect(hotel).to.have.property('id');
            expect(hotel).to.have.property('name');
            expect(hotel).to.have.property('location');
          });
        });
    });

    it('should paginate', async () => {
      await request(server)
        .get(`/hotels?limit=1&startWith=${hotel1address}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          const { items, next } = res.body;
          expect(items.length).to.be.eql(1);
          expect(next).to.be.undefined;
          items.forEach(hotel => {
            expect(hotel).to.have.property('id');
            expect(hotel).to.have.property('name');
            expect(hotel).to.have.property('location');
          });
        });
    });

    it('should return 422 #paginationLimitError on negative limit', async () => {
      const pagination = 'limit=-500';
      await request(server)
        .get(`/hotels?${pagination}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          expect(res.body).to.have.property('code', '#paginationLimitError');
        })
        .expect(422);
    });

    it('should return 404 #paginationStartWithError if the startWith does not exist', async () => {
      const pagination = 'limit=1&startWith=random-hotel-address';
      await request(server)
        .get(`/hotels?${pagination}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          expect(res.body).to.have.property('code', '#paginationStartWithError');
        })
        .expect(404);
    });
  });

  describe('GET /hotels/:hotelAddress', () => {
    let address;
    beforeEach(async () => {
      address = await deployFullHotel(await wtLibsInstance.getOffChainDataClient('json'), indexContract, HOTEL_DESCRIPTION, RATE_PLAN);
      address = web3.utils.toChecksumAddress(address);
    });

    it('should return default fields', async () => {
      const defaultHotelFields = [
        'id',
        'location',
        'name',
        'description',
        'contacts',
        'address',
        'currency',
        'images',
        'amenities',
        'updatedAt',
      ];
      await request(server)
        .get(`/hotels/${address}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          expect(res.body).to.have.all.keys(defaultHotelFields);
        })
        .expect(200);
    });

    it('should return all fields that a client asks for', async () => {
      const fields = ['name', 'location'];
      const query = `fields=${fields.join()}`;

      await request(server)
        .get(`/hotels/${address}?${query}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          expect(res.body).to.have.all.keys([...fields, 'id']);
        })
        .expect(200);
    });

    it('should return all fields that a client asks for', async () => {
      const fields = ['managerAddress'];
      const query = `fields=${fields.join()}`;

      await request(server)
        .get(`/hotels/${address}?${query}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          expect(res.body).to.have.all.keys([...fields, 'id']);
        })
        .expect(200);
    });

    it('should return 502 when on-chain data is inaccessible', async () => {
      sinon.stub(wtJsLibsWrapper, 'getWTIndex').resolves({
        getHotel: sinon.stub().resolves(new FakeHotelWithBadOnChainData()),
      });

      await request(server)
        .get(`/hotels/${address}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(502)
        .expect((res) => {
          wtJsLibsWrapper.getWTIndex.restore();
        });
    });

    it('should return 502 when off-chain data is inaccessible', async () => {
      sinon.stub(wtJsLibsWrapper, 'getWTIndex').resolves({
        getHotel: sinon.stub().resolves(new FakeHotelWithBadOffChainData()),
      });

      await request(server)
        .get(`/hotels/${address}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(502)
        .expect((res) => {
          wtJsLibsWrapper.getWTIndex.restore();
        });
    });

    it('should not return any non-existent fields even if a client asks for them', async () => {
      const fields = ['managerAddress', 'name'];
      const invalidFields = ['invalid', 'invalidField'];
      const query = `fields=${fields.join()},${invalidFields.join()}`;

      await request(server)
        .get(`/hotels/${address}?${query}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          expect(res.body).to.have.all.keys([...fields, 'id']);
          expect(res.body).to.not.have.all.keys(invalidFields);
        })
        .expect(200);
    });

    it('should return a 404 for a non-existent address', async () => {
      await request(server)
        .get('/hotels/0x7135422D4633901AE0D2469886da96A8a72CB264')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(404);
    });

    it('should not work for an address in a badly checksummed format', async () => {
      await request(server)
        .get(`/hotels/${address.toUpperCase()}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          expect(res.body).to.have.property('code', '#hotelChecksum');
        })
        .expect(422);
    });
  });
});
