/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const fetch = require('node-fetch');
const config = require('../../../config.js');
const { AfterEach,
  BeforeEach,
  Before } = require('../../hooks.js');

describe('Hotels', function () {
  AfterEach();
  BeforeEach();
  Before();
  const imageUrl = 'test.jpg';
  it('POST /hotels. Expect 200', async () => {
    const hotelName = 'Test Hotel';
    const hotelDesc = 'Natural and charming atmosphere';
    const body = JSON.stringify({
      'password': config.get('password'),
      'description': hotelDesc,
      'name': hotelName,
    });
    let response = await fetch('http://localhost:3000/hotels', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });
    expect(response).to.have.property('status', 200);

    response = await fetch('http://localhost:3000/hotels', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
      body,
    });

    const hotels = await response.json();
    let hotelAddresses = Object.keys(hotels);
    const hotel = hotels[hotelAddresses[hotelAddresses.length - 1]];
    expect(hotel).to.have.property('name', hotelName);
    expect(hotel).to.have.property('description', hotelDesc);
  });
  it('POST /hotels. Expect 400 #missingPassword', async () => {
    const body = JSON.stringify({
      'name': 'string',
      'description': 'string',
    });
    let response = await fetch('http://localhost:3000/hotels', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 400);
    const res = await response.json();
    expect(res).to.have.property('code', '#missingPassword');
  });
  it('POST /hotels. Expect 400 #missingName', async () => {
    const body = JSON.stringify({
      'password': config.get('password'),
      'description': 'string',
    });

    let response = await fetch('http://localhost:3000/hotels', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 400);
    const res = await response.json();
    expect(res).to.have.property('code', '#missingName');
  });
  it('POST /hotels. Expect 400 #missingDescription', async () => {
    const body = JSON.stringify({
      'password': config.get('password'),
      'name': 'string',
    });

    let response = await fetch('http://localhost:3000/hotels', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 400);
    const res = await response.json();
    expect(res).to.have.property('code', '#missingDescription');
  });
  it('GET /hotels. Expect 200', async () => {
    const body = JSON.stringify({
      'password': config.get('password'),
      'description': 'string',
      'name': 'name',
    });

    let response = await fetch('http://localhost:3000/hotels', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
      body,
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 200);
  });
  it('GET /hotels/:hotelAddress. Expect 200', async () => {
    const response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 200);
    const { hotel } = await response.json();
    expect(hotel).to.have.property('name', 'Test Hotel');
    expect(hotel).to.have.property('description', 'Test Hotel desccription');
  });
  it('PUT /hotels/:hotelAddress. Expect 200 ', async () => {
    const name = 'WT Hotel';
    const description = 'Best hotel for developers.';

    let body = JSON.stringify({
      password: config.get('password'),
      name,
      description,
    });

    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 200);
    body = JSON.stringify({
      password: config.get('password'),
    });
    response = await fetch('http://localhost:3000/hotels', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
      body,
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 200);
    const hotels = await response.json();
    let hotelAddresses = Object.keys(hotels);
    const hotel = hotels[hotelAddresses[hotelAddresses.length - 1]];
    expect(hotel).to.have.property('name', name);
    expect(hotel).to.have.property('description', description);
  });
  it('PUT /hotels/:hotelAddress. Expect 400 #missingPassword', async () => {
    const name = 'WT Hotel';
    const description = 'Best hotel for developers.';

    let body = JSON.stringify({
      name,
      description,
    });

    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 400);
    const res = await response.json();
    expect(res).to.have.property('code', '#missingPassword');
  });
  it('PUT /hotels/:hotelAddress. Expect 400 #missingName', async () => {
    const description = 'Best hotel for developers.';

    let body = JSON.stringify({
      password: config.get('password'),
      description,
    });

    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 400);
    const res = await response.json();
    expect(res).to.have.property('code', '#missingName');
  });
  it('PUT /hotels/:hotelAddress . Expect 400 #missingDescription', async () => {
    const name = 'WT Hotel';

    let body = JSON.stringify({
      password: config.get('password'),
      name,
    });

    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 400);
    const res = await response.json();
    expect(res).to.have.property('code', '#missingDescription');
  });
  it('DELETE /hotels/:hotelAddress. Expect 204', async () => {
    const body = JSON.stringify({
      password: config.get('password'),
    });
    let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 204);
    response = await fetch('http://localhost:3000/hotels', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
      body,
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 200);
    const hotels = await response.json();
    expect(hotels).to.be.null;
  });
  it('DELETE /hotels/:hotelAddress. Expect 400 #missingPassword', async () => {
    const body = JSON.stringify({});
    const response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });
    expect(response).to.be.ok;
    expect(response).to.have.property('status', 400);
    const res = await response.json();
    expect(res).to.have.property('code', '#missingPassword');
  });
  describe('Hotel location', function () {
    const lineOne = 'Address';
    const lineTwo = 'State, city and address';
    const zipCode = 'c1414';
    const country = 'AR';
    const timezone = 'America/Argentina/Buenos_Aires';
    const latitude = 38.002281;
    const longitude = 57.557541;
    it('PUT /hotels/:hotelAddress/location. Expect 200 ', async () => {
      let body = JSON.stringify({
        password: config.get('password'),
        lineOne,
        lineTwo,
        zipCode,
        country,
        timezone,
        latitude,
        longitude,
      });

      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/location`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.be.ok;
      expect(response).to.have.property('status', 200);
      body = JSON.stringify({
        password: config.get('password'),
      });
      response = await fetch('http://localhost:3000/hotels', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        body,
      });
      expect(response).to.be.ok;
      expect(response).to.have.property('status', 200);
      const hotels = await response.json();
      let hotelAddresses = Object.keys(hotels);
      const hotel = hotels[hotelAddresses[hotelAddresses.length - 1]];
      expect(hotel).to.have.property('lineOne', lineOne);
      expect(hotel).to.have.property('lineTwo', lineTwo);
      expect(hotel).to.have.property('zip', zipCode);
      expect(hotel).to.have.property('country', country);
      expect(hotel).to.have.property('timezone', timezone);
      expect(hotel).to.have.property('latitude', latitude.toString());
      expect(hotel).to.have.property('longitude', longitude.toString());
    });
    it('PUT /hotels/:hotelAddress/location. Expect 400 #missingPassword', async () => {
      let body = JSON.stringify({
        lineOne,
        lineTwo,
        zipCode,
        country,
      });

      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/location`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.be.ok;
      expect(response).to.have.property('status', 400);
      const res = await response.json();
      expect(res).to.have.property('code', '#missingPassword');
    });
    it('PUT /hotels/:hotelAddress/location. Expect 400 #missingLineOne', async () => {
      let body = JSON.stringify({
        password: config.get('password'),
        lineTwo,
        zipCode,
        country,
      });

      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/location`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.be.ok;
      expect(response).to.have.property('status', 400);
      const res = await response.json();
      expect(res).to.have.property('code', '#missingLineOne');
    });
    it('PUT /hotels/:hotelAddress/location. Expect 400 #missingLineTwo', async () => {
      let body = JSON.stringify({
        password: config.get('password'),
        lineOne,
        zipCode,
        country,
      });

      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/location`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.be.ok;
      expect(response).to.have.property('status', 400);
      const res = await response.json();
      expect(res).to.have.property('code', '#missingLineTwo');
    });
    it('PUT /hotels/:hotelAddress/location. Expect 400 #missingZipCode', async () => {
      let body = JSON.stringify({
        password: config.get('password'),
        lineOne,
        lineTwo,
        country,
      });

      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/location`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.be.ok;
      expect(response).to.have.property('status', 400);
      const res = await response.json();
      expect(res).to.have.property('code', '#missingZipCode');
    });
    it('PUT /hotels/:hotelAddress/location. Expect 400 #missingCountry ', async () => {
      let body = JSON.stringify({
        password: config.get('password'),
        lineOne,
        lineTwo,
        zipCode,
      });

      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/location`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.be.ok;
      expect(response).to.have.property('status', 400);
      const res = await response.json();
      expect(res).to.have.property('code', '#missingCountry');
    });
    it('PUT /hotels/:hotelAddress/location. Expect 400 #missingTimezone ', async () => {
      let body = JSON.stringify({
        password: config.get('password'),
        lineOne,
        lineTwo,
        zipCode,
        country,
      });

      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/location`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.be.ok;
      expect(response).to.have.property('status', 400);
      const res = await response.json();
      expect(res).to.have.property('code', '#missingTimezone');
    });
    it('PUT /hotels/:hotelAddress/location. Expect 400 #missingLatitude ', async () => {
      let body = JSON.stringify({
        password: config.get('password'),
        lineOne,
        lineTwo,
        zipCode,
        country,
        timezone,
        longitude,
      });

      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/location`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.be.ok;
      expect(response).to.have.property('status', 400);
      const res = await response.json();
      expect(res).to.have.property('code', '#missingLatitude');
    });
    it('PUT /hotels/:hotelAddress/location. Expect 400 #missingTimezone ', async () => {
      let body = JSON.stringify({
        password: config.get('password'),
        lineOne,
        lineTwo,
        zipCode,
        country,
        timezone,
        longitude,
      });

      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/location`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.be.ok;
      expect(response).to.have.property('status', 400);
      const res = await response.json();
      expect(res).to.have.property('code', '#missingLatitude');
    });
  });
  describe('Hotel images', function () {
    it('POST /hotels/:hotelAddress/images. Expect 200', async () => {
      const body = JSON.stringify({
        'password': config.get('password'),
        'url': imageUrl,
      });
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/images`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.have.property('status', 200);
      response = await fetch('http://localhost:3000/hotels', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        body,
      });

      const hotels = await response.json();
      const hotel = hotels[config.get('testAddress')];
      expect(hotel.images).to.include(imageUrl);
    });
    it('POST /hotels/:hotelAddress/images. Expect 400 #missingPassword', async () => {
      const body = JSON.stringify({
        'url': 'http://images.com/123',
      });

      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/images`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.be.ok;
      const res = await response.json();
      expect(response).to.have.property('status', 400);
      expect(res).to.have.property('code', '#missingPassword');
    });
    it('POST /hotels/:hotelAddress/images. Expect 400 #missingUrl', async () => {
      const body = JSON.stringify({
        'password': config.get('password'),
      });

      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/images`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.be.ok;
      const res = await response.json();
      expect(response).to.have.property('status', 400);
      expect(res).to.have.property('code', '#missingUrl');
    });
    it('DELETE /hotels/:hotelAddress/images/:id. Expect 200', async () => {
      const body = JSON.stringify({
        'password': config.get('password'),
      });
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/images/0`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.be.ok;
      expect(response).to.have.property('status', 204);

      response = await fetch('http://localhost:3000/hotels', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        body,
      });

      const hotels = await response.json();
      const hotel = hotels[config.get('testAddress')];
      expect(hotel.images).to.not.include(imageUrl);
    });
    it('DELETE /hotels/:hotelAddress/images/:id/0. Expect 400 #missingPassword', async () => {
      const body = JSON.stringify({});

      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/images/0`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      expect(response).to.be.ok;
      const res = await response.json();
      expect(response).to.have.property('status', 400);
      expect(res).to.have.property('code', '#missingPassword');
    });
  });
});
