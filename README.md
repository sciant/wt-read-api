[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
# WT NodeJS API
API written in nodejs to interact with the Winding Tree platform, it creates an
http server with an encrypted ethereum account to send transactions to the WT
platform hosted over the ethereum network.
## Requirements
- Nodejs 8.9.x LTS

### Getting stared
In order to install and run test we must:
- git clone git@github.com:windingtree/wt-nodejs-api.git --recursive
- nvm install
- npm i
- cd wt-js-libs && npm i
- npm test

## Examples
### Wallet
The very first thing to do, is add a Wallet. This wallet is used to make
transactions with the Ethereum network. An example of encrypted keystore v3
JSON:
```javaScript
{
    version: 3,
    id: '04e9bcbb-96fa-497b-94d1-14df4cd20af6',
    address: '2c7536e3605d9c16a7a3d7b1898e529396a65c23',
    crypto: {
        ciphertext: 'a1c25da3ecde4e6a24f3697251dd15d6208520efc84ad97397e906e6df24d251',
        cipherparams: { iv: '2885df2b63f7ef247d753c82fa20038a' },
        cipher: 'aes-128-ctr',
        kdf: 'scrypt',
        kdfparams: {
            dklen: 32,
            salt: '4531b3c174cc3ff32a6a7a85d6761b410db674807b2d216d022318ceee50be10',
            n: 262144,
            r: 8,
            p: 1
        },
        mac: 'b8b010fff37f9ae5559a352a185e86f9b9c1d7f7a9f1bd4e82a5dd35468fc7f6'
    }
}
```
In order to add a new one, we must send a POST message
```bash
curl -X POST "http://localhost:3000/wallet" -H  "accept: application/json" \
  -H  "Content-Type: application/json" -d "{  \"password\": \"string\", \
  \"wallet\": {...}}"
```
```javascript
fetch('http://localhost:3000/wallet', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
    password: 'secret',
    wallet
  })
})
```
Now, we can start to manage hotels.

### Hotel manager
#### Create Hotel
Our first step with hotels is to create one. This requires an Hotel's name and
description. Don't forget the password in order to use the stored wallet.
```bash
curl -X POST "http://localhost:3000/hotels" -H  "accept: application/json" \
  -H  "Content-Type: application/json" -d "{  \"password\": \"secret\", \
  \"name\": \"WT Hotel\",  \"description\": \"Winding tree test hotel\"}"
```
```javascript
fetch('http://localhost:3000/hotels', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body : JSON.stringify({
  'password': 'secret',
  'name': 'Winding Tree Hotel',
  'description': 'WT test hotel'
})
})
```
This will return a transaction hash. After, we can check the hotels that we
manage with

```bash
curl -X GET "http://localhost:3000/hotels" -H  "accept: application/json" \
  -H  "Content-Type: application/json" -d "{  \"password\": \"secret\"}"
```

```javascript
fetch('http://localhost:3000/hotels', {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  },
  body: JSON.stringify({
  password: 'secret'
  })
})
```
The response is an JSON object where each key is the address of the Smart
Contract that holds the hotel.

#### Add image to hotel
We can add images to our hotel.

```bash
curl -X POST "http://localhost:3000/hotels/0x0...0/images" \
  -H  "accept: application/json" -H  "Content-Type: application/json" \
  -d "{  \"password\": \"secret\",  \"url\": \"imageUrl.me/front-1\"}"
```

```javascript
fetch(`http://localhost:3000/hotels/0x3...b/images`, {
  method: 'POST',
  headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
  },
  body : JSON.stringify({
    password: 'secret',
    url: 'imageUrl.me/front-1'
  })
})
```

#### Hotel address
Each hotel must have an address, this id updated with a POST message

```bash
curl -X PUT "http://localhost:3000/hotels/0x0...0/address" \
  -H  "accept: application/json" -H  "Content-Type: application/json" \
  -d "{  \"password\": \"secret\",  \"lineOne\": \"Fake street 123\", \
  \"lineTwo\": \"Springfield\",  \"zipCode\": \"C1414\", \
  \"country\": \"Greece\"}"
```

```javascript
fetch(`http://localhost:3000/hotels/0x0...1/address`, {
  method: 'PUT',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    password: 'secret',
    lineOne: 'Fake street 123',
    lineTwo: 'Springfield',
    zipCode: 'C1414',
    country: 'Greece'
  })
})
```

#### Hotel location
We can set a geo location to our Hotels.

```bash
curl -X PUT "http://localhost:3000/hotels/0x0...1/location" \
  -H  "accept: application/json" -H  "Content-Type: application/json" \
  -d "{  \"password\": \"secret\",  \"latitude\": \"38.0022800\", \
  \"longitude\": \"57.557541\",  \"timezone\": \"3\"}"
```

```javascript
fetch(`http://localhost:3000/hotels/0x0...1/location`, {
method: 'PUT',
headers: {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
},
body: JSON.stringify({
  password: 'secret',
  timezone: '3',
  latitude: '38.0022800',
  longitude: '57.5575400'
})
})
```

### Unit Types
Each hotels have different unit types, in order to crate a new type

```bash
curl -X POST "http://localhost:3000/hotels/0x0...1/unitTypes" \
  -H  "accept: application/json" -H  "Content-Type: application/json" \
  -d "{  \"password\": \"secret\",  \"type\": \"FAMILY_CABIN\"}" \
```

```javascript
fetch(`http://localhost:3000/hotels/0x0...1/unitTypes`, {
method: 'POST',
headers: {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
},
body: JSON.stringify({
  password: 'secret',
  type: 'FAMILY_CABIN'
  })
})
```

#### Unit type - Images
As we add images to our hotel, we can add images to our unit types. We must
```bash
curl -X POST "http://localhost:3000/hotels/0x0...1/unitTypes/FAMILY_CABIN/images" \
  -H  "accept: application/json" -H  "Content-Type: application/json" \
  -d "{  \"password\": \"secret\",  \"url\": \"url.to/nice-image\"}"
```
```javascript
fetch(`http://localhost:3000/hotels/0x0...1/unitTypes/FAMILY_CABIN/images`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
    'password': 'secret',
    'url': 'imageUrl.me/front-1'
  })
})
```
#### Unit type - Amenity
Now, we can add amenities identified by his numeric code
```bash
curl -X POST "http://localhost:3000/hotels/0x0...1/unitTypes/FAMILY_CABIN/amenities" \
  -H  "accept: application/json" -H  "Content-Type: application/json" \
  -d "{  \"password\": \"secret\",  \"amenity\": 23}"
```
```javascript
fetch('http://localhost:3000/hotels/0x0...1/unitTypes/FAMILY_CABIN/amenities', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
  password: 'secret',
  amenity: 23
  })
})
```

### Unit
Suppose that we have 2 `FAMILY_CABIN`. Lets create the first
```bash
curl -X POST "http://localhost:3000/hotels/0x0...1/unitTypes/FAMILY_CABIN/units" \
  -H  "accept: application/json" -H  "Content-Type: application/json" \
  -d "{  \"password\": \"secret\"}"
```
```javascript
fetch('http://localhost:3000/hotels/0x0...1/unitTypes/FAMILY_CABIN/units', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    password: 'secret'
  })
})
```
After the transaction is processed, a new smart contract is deployed. To get the
new unit address we must `GET /hotel/0x0...1`, under the key units are listed
all the available units.

#### Unit default prices
To set a default lif price, we must

```bash
curl -X PUT "http://localhost:3000/hotels/0x0...1/units/0x2...1/defaultLifPrice" \
  -H  "accept: application/json" -H  "Content-Type: application/json" \
  -d "{  \"password\": \"secret\",  \"price\": 30}"
```
```javascript
fetch(`http://localhost:3000/hotels/0x0..1/units/0x2...1/defaultLifPrice`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  body: {
      password: 'secret',
      price: 30
  }
})
```
We can set a default fiat price trough

```bash
curl -X PUT "http://localhost:3000/hotels/0x0...1/units/0x2...1/defaultPrice" \
  -H  "accept: application/json" -H  "Content-Type: application/json" \
  -d "{  \"password\": \"secret\",  \"price\": 30}"
```
```javascript
fetch(`http://localhost:3000/hotels/0x0..1/units/0x2...1/defaultPrice`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  body: {
      password: 'secret',
      price: 30
  }
})
```
Also, we need to set the currency
```curl
curl -X PUT "http://localhost:3000/hotels/0x0...1/units/0x2...1/currencyCode" \
  -H  "accept: application/json" -H  "Content-Type: application/json" \
  -d "{  \"password\": \"secret\",  \"code\": 964}"
```
```javaScript
fetch(`http://localhost:3000/hotels/0x0...1/units/0x2..1/currencyCode`, {
  method: 'PUT',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    password: 'secret',
    code: 964
  })
})
```
#### Unit special prices
Sometimes, we want an special price for our units. This can be done!
```bash
curl -X PUT "http://localhost:3000/hotels/0x0...1/units/0x2...1/specialLifPrice" \
  -H  "accept: application/json" -H  "Content-Type: application/json" \
  -d "{  \"password\": \"secret\",  \"price\": 71, \"days\": 7, \
    \"from\":\"2020-10-10T03:00:00.000Z\"}"
```
```javascript
let response = await fetch(`http://localhost:3000/hotels/0x0...1/units/0x2...1/specialLifPrice`, {
  method: 'PUT',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: {
    password: 'secret',
    price: 71,
    days: 7,
    from: new Date('10/10/2020')
  }
})
```

#### Unit - Active/Inactive
We can set an unit as inactive or inactive for a period of time.
```bash
curl -X PUT "http://localhost:3000/hotels/0x0...1/units/0x2...1/active" \
  -H  "accept: application/json" -H  "Content-Type: application/json" \
  -d "{  \"password\": \"secret\",  \"active\": false}"
```
```javascript
fetch(`http://localhost:3000/hotels/0x0..1/units/0x2...1/active`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  body: {
      password: 'secret',
      active: false
  }
})
```

### Booking
As users, we want to book a unit

```bash
curl -X POST "http://localhost:3000/hotels/0x0...1/units/0x2...1/book" \
  -H  "accept: application/json" -H  "Content-Type: application/json" \
  -d "{  \"account\": \"0x3...a\",  \"guest\": \"string\",  \"days\": 8, \
   \"from\": \"2020-10-10T03:00:00.000Z\"}"
```

```javascript
await fetch(`http://localhost:3000/hotels/0x0...1/units/0x2...1/book`, {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body : {
    account: '0x3...a',
    guest: guestData,
    days: 8,
    from: new Date('10/10/2020')
  }
})
```
When the tx is mined. Depending on the Hotel configuration. We can see the
request as a pending requests or a confirmed booking.

#### Requests and bookings
The view pending request

```bash
curl -X GET "http://localhost:3000/hotels/0x0...1/requests" \
  -H  "accept: application/json" -H  "Content-Type: application/json" \
  -d "{  \"block\": \"27\"}"
```

```javascript
fetch(`http://localhost:3000/hotels/0x0...1/requests`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  },
  body: {
    block: 27
  }
})
```
and, to confirm. We can skip this step if we had configured the hotel to
auto confirm request

```bash
curl -X POST "http://localhost:3000/hotels/0x0...1/confirmBooking" \
  -H  "accept: application/json" -H  "Content-Type: application/json" \
  -d "{  \"password\": \"secret\",  \"reservationId\": \"id_123\"}"
```
```javascript
fetch(`http://localhost:3000/hotels/0x0...1/requests`, {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  },
  body: {
    password: 'secret',
    reservationId: 'id_123'
  }
})

```
Finally, to see the confirmed booking.
```bash
curl -X GET "http://localhost:3000/hotels/0x0...1/bookings" \
  -H  "accept: application/json" -H  "Content-Type: application/json" \
  -d "{  \"block\": \"27\"}"
```
```javascript
fetch(`http://localhost:3000/hotels/0x0...1/bookings`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  },
  body: {
    block: 27
  }
})
```
