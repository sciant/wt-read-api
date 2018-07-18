[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
# WT Read API
API written in nodejs to fetch information from the Winding Tree platform.

## Requirements
- Nodejs 10.3.0

### Getting stared
In order to install and run tests, we must:
```
git clone git@github.com:windingtree/wt-read-api.git
nvm install
npm install
npm test
```

### Running dev mode
With all the dependencies installed, you can start the dev server.
First step is starting Ganache (local Ethereum network node). You can skip this
step if you have a different network already running.
```bash
npm run dev-net
```

Now we can run our dev server.
```bash
npm run dev
```
When `ETH_NETWORK=local` we run internally a script to deploy WT Index. It is not immediate,
so you might experience some errors in a first few seconds. And that's the reason why
it is not used in the same manner in tests.

You can then visit [http://localhost:3000/docs/](http://localhost:3000/docs/) to interact
with the live server. An [OAS](https://github.com/OAI/OpenAPI-Specification) description is published there.

You cna tweak with the configuration in `src/config/`.

## Examples
### Get list of hotels

Calling `GET /hotels` will retrieve an array of hotels. By default fields are `id`, `name` and `location`, which
means that at least some off-chain stored data is retrieved.

You can use a query attribute `fields` to specify which fields you want to be included in the response.
Hotel ID is included by default in every request. Ex. `GET /hotels?fields=name`. You can also choose to include
only ids (e. g. `GET /hotels?fields=id`) which will *not* fetch any off-chain data, so the response will be much faster.

```javascript
items: [
    ...
    { 
      id: '0x585c0771Fe960f99aBdba8dc77e5d31Be2Ada74d',
      name: 'WT Hotel',
    },
    ...
]
```

If an error is produced for a hotel, the response will look like this
```javascript
items: [
    ...
    { 
      id: '0x585c0771Fe960f99aBdba8dc77e5d31Be2Ada74d',
      error: 'Unsupported data storage type: ipfs' 
    },
    ...
]
```


### Get a hotel

Request to `/hotels/:address` can fetch off-chain data in a single request. By default, included fields are `id`, `location`, 
`name`, `description`, `contacts`, `address`, `currency`, `images`, `amenities`, `updatedAt`.


```javascript
{ 
  id: '0x417C3DDae54aB2f5BCd8d5A1750487a1f765a94a',
  location: { latitude: 35.89421911, longitude: 139.94637467 },
  name: 'Winding Tree Hotel',
  description: 'string',
  contacts: 
   { 
    general: 
      { 
        email: 'joseph.urban@example.com',
        phone: 44123456789,
        url: 'string',
        ethereum: 'string',
        additionalContacts: [Array] 
      } 
    },
  roomTypes: {
    room-type-1111: {
      id: 'room-type-1111',
      name: 'Room with windows',
      description: 'some fancy room type description',
      totalQuantity: 0,
      occupancy: {
        min: 1,
        max: 3,
      },
      amenities: [
        'TV',
      ],
      images: [
        'https://example.com/room-image.jpg',
      ],
      updatedAt: '2018-06-19T13:19:58.190Z',
      properties: {
        nonSmoking: 'some',
      },
    }
  },
  address: 
   { 
     line1: 'string',
     line2: 'string',
     postalCode: 'string',
     city: 'string',
     state: 'string',
     country: 'string' 
   },
  currency: 'string',
  images: [ 'string' ],
  amenities: [ 'WiFi' ],
  updatedAt: '2018-06-19T13:19:58.190Z'
 }

```
