/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const fetch = require('node-fetch')
const config = require('../config.js')
const utils = require('../wt-js-libs/libs/utils/index')
const { app } = require('../src/srv/service')
const gasMargin = 1.5
const addressZero = '0x0000000000000000000000000000000000000000000000000000000000000000'
let index
let fundingSource
let daoAccount
let ownerAccount
let server

const Before = () => (
  before(async function () {
    config.set('password', 'test123')
    config.set('web3Provider', 'http://localhost:8545')
    config.updateWeb3Provider()
    config.set('privateKeyDir', 'keys/test.json')
    const wallet = await config.get('web3').eth.accounts.wallet.create(3)
    const accounts = await config.get('web3').eth.getAccounts()
    fundingSource = accounts[0]
    ownerAccount = wallet['0'].address
    daoAccount = wallet['1'].address
    config.set('user', wallet['2'].address)
    await utils.fundAccount(fundingSource, ownerAccount, '50', config.get('web3'))
    await utils.fundAccount(fundingSource, daoAccount, '50', config.get('web3'))
    await utils.fundAccount(fundingSource, config.get('user'), '50', config.get('web3'))
  })
)
const BeforeEach = () => (
  beforeEach(async function () {
    index = await utils.deployIndex({
      owner: daoAccount,
      gasMargin: gasMargin,
      web3: config.get('web3')
    })
    expect(index._address).to.not.equal(addressZero)
    config.set('indexAddress', index._address)
    server = await app.listen(3000)
    await setUpWallet()
    await generateHotel(daoAccount)
    await deployLifContract(daoAccount, config.get('user'), index)
  })
)
const AfterEach = () => (
  afterEach(async function () {
    return server.close()
  })
)

async function generateHotel (ownerAddres) {
  let body
  let res
  let hotelAddresses
  const hotelName = 'Test Hotel'
  const hotelDesc = 'Test Hotel desccription'
  const unitTypeName = 'TYPE_000'
  const amenity = 5
  const imageUrl = 'test-image.jpeg'
  const defaultPrice = 78
  const defaultLifPrice = 2

  body = JSON.stringify({
    'password': config.get('password'),
    'description': hotelDesc,
    'name': hotelName
  })
  await fetch('http://localhost:3000/hotels', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body
  })

  body = JSON.stringify({
    'password': config.get('password')
  })
  res = await fetch('http://localhost:3000/hotels', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    },
    body
  })

  hotelAddresses = Object.keys(await res.json())
  config.set('testAddress', hotelAddresses[0])
  body = JSON.stringify({
    'password': config.get('password'),
    type: unitTypeName
  })
  res = await fetch(`http://localhost:3000/hotels/${hotelAddresses[0]}/unitTypes`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body
  })

  body = JSON.stringify({
    'password': config.get('password'),
    amenity
  })
  res = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/${unitTypeName}/amenities`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body
  })

  body = JSON.stringify({
    'password': config.get('password')
  })
  res = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/${unitTypeName}/units`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body
  })

  body = JSON.stringify({
    'password': config.get('password'),
    'url': imageUrl
  })
  res = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/${unitTypeName}/images`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body
  })
  res = await fetch('http://localhost:3000/hotels', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    },
    body
  })
  const hotels = await res.json()
  hotelAddresses = Object.keys(hotels)
  const hotel = hotels[hotelAddresses[0]]
  let unitAddresses = Object.keys(hotel.units)
  expect(hotel).to.have.property('name', hotelName)
  expect(hotel).to.have.property('description', hotelDesc)
  expect(hotel).to.have.property('unitTypeNames')
  expect(hotel.unitTypeNames).to.include(unitTypeName)
  expect(hotel.unitTypes[unitTypeName].amenities).to.include(amenity)
  const unitAdress = hotel.unitAddresses[unitAddresses.length - 1]
  config.set('unitAdress', unitAdress)
  expect(hotel.units[unitAdress]).to.have.property('unitType', unitTypeName)
  expect(hotel.unitTypes[unitTypeName].images).to.include(imageUrl)

  body = JSON.stringify({
    password: config.get('password'),
    price: defaultPrice
  })
  res = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/defaultPrice`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body
  })
  body = JSON.stringify({
    password: config.get('password'),
    price: defaultLifPrice
  })

  res = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/defaultLifPrice`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body
  })
}

async function setUpWallet () {
  const wallet = await config.get('web3').eth.accounts.wallet[0].encrypt(config.get('password'))
  const body = JSON.stringify({
    'password': config.get('password'),
    wallet
  })
  await fetch('http://localhost:3000/wallet', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body
  })
}

async function deployLifContract (daoAccount, user) {
  const web3 = config.get('web3')
  const lifContract = new web3.eth.Contract([{'constant': false, 'inputs': [{'name': '_spender', 'type': 'address'}, {'name': '_value', 'type': 'uint256'}], 'name': 'approve', 'outputs': [{'name': '', 'type': 'bool'}], 'payable': false, 'type': 'function'}, {'constant': true, 'inputs': [], 'name': 'totalSupply', 'outputs': [{'name': '', 'type': 'uint256'}], 'payable': false, 'type': 'function'}, {'constant': false, 'inputs': [{'name': '_from', 'type': 'address'}, {'name': '_to', 'type': 'address'}, {'name': '_value', 'type': 'uint256'}], 'name': 'transferFrom', 'outputs': [{'name': '', 'type': 'bool'}], 'payable': false, 'type': 'function'}, {'constant': true, 'inputs': [], 'name': 'DECIMALS', 'outputs': [{'name': '', 'type': 'uint256'}], 'payable': false, 'type': 'function'}, {'constant': false, 'inputs': [], 'name': 'unpause', 'outputs': [], 'payable': false, 'type': 'function'}, {'constant': false, 'inputs': [{'name': '_value', 'type': 'uint256'}], 'name': 'burn', 'outputs': [], 'payable': false, 'type': 'function'}, {'constant': true, 'inputs': [], 'name': 'paused', 'outputs': [{'name': '', 'type': 'bool'}], 'payable': false, 'type': 'function'}, {'constant': false, 'inputs': [{'name': '_spender', 'type': 'address'}, {'name': '_subtractedValue', 'type': 'uint256'}], 'name': 'decreaseApproval', 'outputs': [{'name': 'success', 'type': 'bool'}], 'payable': false, 'type': 'function'}, {'constant': false, 'inputs': [{'name': 'spender', 'type': 'address'}, {'name': 'value', 'type': 'uint256'}, {'name': 'data', 'type': 'bytes'}], 'name': 'approveData', 'outputs': [{'name': '', 'type': 'bool'}], 'payable': false, 'type': 'function'}, {'constant': true, 'inputs': [{'name': '_owner', 'type': 'address'}], 'name': 'balanceOf', 'outputs': [{'name': 'balance', 'type': 'uint256'}], 'payable': false, 'type': 'function'}, {'constant': false, 'inputs': [], 'name': 'pause', 'outputs': [], 'payable': false, 'type': 'function'}, {'constant': true, 'inputs': [], 'name': 'owner', 'outputs': [{'name': '', 'type': 'address'}], 'payable': false, 'type': 'function'}, {'constant': true, 'inputs': [], 'name': 'NAME', 'outputs': [{'name': '', 'type': 'string'}], 'payable': false, 'type': 'function'}, {'constant': false, 'inputs': [{'name': '_to', 'type': 'address'}, {'name': '_value', 'type': 'uint256'}], 'name': 'transfer', 'outputs': [{'name': '', 'type': 'bool'}], 'payable': false, 'type': 'function'}, {'constant': true, 'inputs': [], 'name': 'MAX_LIF_FAUCET', 'outputs': [{'name': '', 'type': 'uint256'}], 'payable': false, 'type': 'function'}, {'constant': false, 'inputs': [{'name': 'to', 'type': 'address'}, {'name': 'value', 'type': 'uint256'}, {'name': 'data', 'type': 'bytes'}], 'name': 'transferData', 'outputs': [{'name': '', 'type': 'bool'}], 'payable': false, 'type': 'function'}, {'constant': false, 'inputs': [{'name': '_spender', 'type': 'address'}, {'name': '_addedValue', 'type': 'uint256'}], 'name': 'increaseApproval', 'outputs': [{'name': 'success', 'type': 'bool'}], 'payable': false, 'type': 'function'}, {'constant': true, 'inputs': [{'name': '_owner', 'type': 'address'}, {'name': '_spender', 'type': 'address'}], 'name': 'allowance', 'outputs': [{'name': 'remaining', 'type': 'uint256'}], 'payable': false, 'type': 'function'}, {'constant': false, 'inputs': [], 'name': 'faucetLif', 'outputs': [], 'payable': false, 'type': 'function'}, {'constant': false, 'inputs': [{'name': 'from', 'type': 'address'}, {'name': 'to', 'type': 'address'}, {'name': 'value', 'type': 'uint256'}, {'name': 'data', 'type': 'bytes'}], 'name': 'transferDataFrom', 'outputs': [{'name': '', 'type': 'bool'}], 'payable': false, 'type': 'function'}, {'constant': false, 'inputs': [{'name': 'newOwner', 'type': 'address'}], 'name': 'transferOwnership', 'outputs': [], 'payable': false, 'type': 'function'}, {'constant': true, 'inputs': [], 'name': 'SYMBOL', 'outputs': [{'name': '', 'type': 'string'}], 'payable': false, 'type': 'function'}, {'anonymous': false, 'inputs': [], 'name': 'Pause', 'type': 'event'}, {'anonymous': false, 'inputs': [], 'name': 'Unpause', 'type': 'event'}, {'anonymous': false, 'inputs': [{'indexed': true, 'name': 'previousOwner', 'type': 'address'}, {'indexed': true, 'name': 'newOwner', 'type': 'address'}], 'name': 'OwnershipTransferred', 'type': 'event'}, {'anonymous': false, 'inputs': [{'indexed': true, 'name': 'burner', 'type': 'address'}, {'indexed': false, 'name': 'value', 'type': 'uint256'}], 'name': 'Burn', 'type': 'event'}, {'anonymous': false, 'inputs': [{'indexed': true, 'name': 'owner', 'type': 'address'}, {'indexed': true, 'name': 'spender', 'type': 'address'}, {'indexed': false, 'name': 'value', 'type': 'uint256'}], 'name': 'Approval', 'type': 'event'}, {'anonymous': false, 'inputs': [{'indexed': true, 'name': 'from', 'type': 'address'}, {'indexed': true, 'name': 'to', 'type': 'address'}, {'indexed': false, 'name': 'value', 'type': 'uint256'}], 'name': 'Transfer', 'type': 'event'}])
  const resp = await lifContract.deploy({
    data: '0x60606040526003805460a060020a60ff02191690555b60038054600160a060020a03191633600160a060020a03161790555b5b6112d5806100416000396000f300606060405236156101255763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663095ea7b3811461012a57806318160ddd1461016057806323b872dd146101855780632e0f2625146101c15780633f4ba83a146101e657806342966c68146101fb5780635c975abb14610213578063661884631461023a5780636ef3ef7e1461027057806370a08231146102e95780638456cb591461031a5780638da5cb5b1461032f578063a3f4df7e1461035e578063a9059cbb146103e9578063a981f56b1461041f578063c0e37b1514610444578063d73dd623146104bd578063dd62ed3e146104f3578063e1181c731461052a578063efef445b1461053f578063f2fde38b146105bf578063f76f8d78146105e0575b600080fd5b341561013557600080fd5b61014c600160a060020a036004351660243561066b565b604051901515815260200160405180910390f35b341561016b57600080fd5b610173610699565b60405190815260200160405180910390f35b341561019057600080fd5b61014c600160a060020a036004358116906024351660443561069f565b604051901515815260200160405180910390f35b34156101cc57600080fd5b6101736106cf565b60405190815260200160405180910390f35b34156101f157600080fd5b6101f96106d4565b005b341561020657600080fd5b6101f9600435610756565b005b341561021e57600080fd5b61014c6107a8565b604051901515815260200160405180910390f35b341561024557600080fd5b61014c600160a060020a03600435166024356107b8565b604051901515815260200160405180910390f35b341561027b57600080fd5b61014c60048035600160a060020a03169060248035919060649060443590810190830135806020601f820181900481020160405190810160405281815292919060208401838380828437509496506107e695505050505050565b604051901515815260200160405180910390f35b34156102f457600080fd5b610173600160a060020a0360043516610816565b60405190815260200160405180910390f35b341561032557600080fd5b6101f9610835565b005b341561033a57600080fd5b6103426108bc565b604051600160a060020a03909116815260200160405180910390f35b341561036957600080fd5b6103716108cb565b60405160208082528190810183818151815260200191508051906020019080838360005b838110156103ae5780820151818401525b602001610395565b50505050905090810190601f1680156103db5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156103f457600080fd5b61014c600160a060020a0360043516602435610902565b604051901515815260200160405180910390f35b341561042a57600080fd5b610173610930565b60405190815260200160405180910390f35b341561044f57600080fd5b61014c60048035600160a060020a03169060248035919060649060443590810190830135806020601f8201819004810201604051908101604052818152929190602084018383808284375094965061093d95505050505050565b604051901515815260200160405180910390f35b34156104c857600080fd5b61014c600160a060020a036004351660243561096d565b604051901515815260200160405180910390f35b34156104fe57600080fd5b610173600160a060020a036004358116906024351661099b565b60405190815260200160405180910390f35b341561053557600080fd5b6101f96109c8565b005b341561054a57600080fd5b61014c600160a060020a036004803582169160248035909116916044359160849060643590810190830135806020601f82018190048102016040519081016040528181529291906020840183838082843750949650610a8095505050505050565b604051901515815260200160405180910390f35b34156105ca57600080fd5b6101f9600160a060020a0360043516610ab2565b005b34156105eb57600080fd5b610371610b4b565b60405160208082528190810183818151815260200191508051906020019080838360005b838110156103ae5780820151818401525b602001610395565b50505050905090810190601f1680156103db5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60035460009060a060020a900460ff161561068557600080fd5b61068f8383610b82565b90505b5b92915050565b60005481565b60035460009060a060020a900460ff16156106b957600080fd5b6106c4848484610bef565b90505b5b9392505050565b601281565b60035433600160a060020a039081169116146106ef57600080fd5b60035460a060020a900460ff16151561070757600080fd5b6003805474ff0000000000000000000000000000000000000000191690557f7805862f689e2f13df9f062ff482ad3ad112aca9e0847911ed832e158c525b3360405160405180910390a15b5b5b565b60035460a060020a900460ff161561076d57600080fd5b61077681610d09565b600033600160a060020a031660008051602061128a8339815191528360405190815260200160405180910390a35b5b50565b60035460a060020a900460ff1681565b60035460009060a060020a900460ff16156107d257600080fd5b61068f8383610dae565b90505b5b92915050565b60035460009060a060020a900460ff161561080057600080fd5b6106c4848484610eaa565b90505b5b9392505050565b600160a060020a0381166000908152600160205260409020545b919050565b60035433600160a060020a0390811691161461085057600080fd5b60035460a060020a900460ff161561086757600080fd5b6003805474ff0000000000000000000000000000000000000000191660a060020a1790557f6985a02210a168e66602d3235cb6db0e70f92b3ba4d376a33c0f3d9434bff62560405160405180910390a15b5b5b565b600354600160a060020a031681565b60408051908101604052600481527f4cc3ad6600000000000000000000000000000000000000000000000000000000602082015281565b60035460009060a060020a900460ff161561091c57600080fd5b61068f8383610f6a565b90505b5b92915050565b6802b5e3af16b188000081565b60035460009060a060020a900460ff161561095757600080fd5b6106c484848461102f565b90505b5b9392505050565b60035460009060a060020a900460ff161561098757600080fd5b61068f83836110f0565b90505b5b92915050565b600160a060020a038083166000908152600260209081526040808320938516835292905220545b92915050565b600160a060020a0333166000908152600160205260408120546109fb906802b5e3af16b18800009063ffffffff61119516565b600054909150610a11908263ffffffff6111ac16565b6000908155600160a060020a033316815260016020526040902054610a3c908263ffffffff6111ac16565b600160a060020a03331660008181526001602052604080822093909355909160008051602061128a8339815191529084905190815260200160405180910390a35b50565b60035460009060a060020a900460ff1615610a9a57600080fd5b610aa6858585856111c6565b90505b5b949350505050565b60035433600160a060020a03908116911614610acd57600080fd5b600160a060020a0381161515610ae257600080fd5b600354600160a060020a0380831691167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a36003805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0383161790555b5b50565b60408051908101604052600381527f4c49460000000000000000000000000000000000000000000000000000000000602082015281565b600160a060020a03338116600081815260026020908152604080832094871680845294909152808220859055909291907f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259085905190815260200160405180910390a35060015b92915050565b600080600160a060020a0384161515610c0757600080fd5b50600160a060020a03808516600081815260026020908152604080832033909516835293815283822054928252600190529190912054610c4d908463ffffffff61119516565b600160a060020a038087166000908152600160205260408082209390935590861681522054610c82908463ffffffff6111ac16565b600160a060020a038516600090815260016020526040902055610cab818463ffffffff61119516565b600160a060020a038087166000818152600260209081526040808320338616845290915290819020939093559086169160008051602061128a8339815191529086905190815260200160405180910390a3600191505b509392505050565b6000808211610d1757600080fd5b5033600160a060020a038116600090815260016020526040902054610d3c9083611195565b600160a060020a03821660009081526001602052604081209190915554610d69908363ffffffff61119516565b600055600160a060020a0381167fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca58360405190815260200160405180910390a25b5050565b600160a060020a03338116600090815260026020908152604080832093861683529290529081205480831115610e0b57600160a060020a033381166000908152600260209081526040808320938816835292905290812055610e42565b610e1b818463ffffffff61119516565b600160a060020a033381166000908152600260209081526040808320938916835292905220555b600160a060020a0333811660008181526002602090815260408083209489168084529490915290819020547f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925915190815260200160405180910390a3600191505b5092915050565b600030600160a060020a031684600160a060020a031614151515610ecd57600080fd5b610ed78484610b82565b5083600160a060020a03168260405180828051906020019080838360005b83811015610f0e5780820151818401525b602001610ef5565b50505050905090810190601f168015610f3b5780820380516001836020036101000a031916815260200191505b5091505060006040518083038160008661646e5a03f19150501515610f5f57600080fd5b5060015b9392505050565b6000600160a060020a0383161515610f8157600080fd5b600160a060020a033316600090815260016020526040902054610faa908363ffffffff61119516565b600160a060020a033381166000908152600160205260408082209390935590851681522054610fdf908363ffffffff6111ac16565b600160a060020a03808516600081815260016020526040908190209390935591339091169060008051602061128a8339815191529085905190815260200160405180910390a35060015b92915050565b600030600160a060020a031684600160a060020a03161415151561105257600080fd5b83600160a060020a03168260405180828051906020019080838360005b838110156110885780820151818401525b60200161106f565b50505050905090810190601f1680156110b55780820380516001836020036101000a031916815260200191505b5091505060006040518083038160008661646e5a03f191505015156110d957600080fd5b6110e38484610f6a565b50600190505b9392505050565b600160a060020a033381166000908152600260209081526040808320938616835292905290812054611128908363ffffffff6111ac16565b600160a060020a0333811660008181526002602090815260408083209489168084529490915290819020849055919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591905190815260200160405180910390a35060015b92915050565b6000828211156111a157fe5b508082035b92915050565b6000828201838110156111bb57fe5b8091505b5092915050565b600030600160a060020a031684600160a060020a0316141515156111e957600080fd5b83600160a060020a03168260405180828051906020019080838360005b8381101561121f5780820151818401525b602001611206565b50505050905090810190601f16801561124c5780820380516001836020036101000a031916815260200191505b5091505060006040518083038160008661646e5a03f1915050151561127057600080fd5b61127b858585610bef565b50600190505b9493505050505600ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa165627a7a72305820e1b20b54a96f62c93e7a855a9b911f297c1200b3de852252802253f4bcb571a50029',
    arguments: []
  }).send({
    from: daoAccount,
    gas: 5000000,
    gasPrice: 1
  })
  lifContract.options.address = resp.contractAddress
  config.set('tokenAddress', resp.contractAddress)
  await lifContract.methods.faucetLif().send({from: user, gas: 6000000})
  const balance = await lifContract.methods.balanceOf(user).call({from: user})
  expect(balance).to.eql('50000000000000000000')

  const setLifData = await index.methods
    .setLifToken(lifContract.options.address)
    .encodeABI()

  const setLifOptions = {
    from: daoAccount,
    to: index.options.address,
    gas: 5000000,
    data: setLifData
  }

  await web3.eth.sendTransaction(setLifOptions)
}

module.exports = {
  AfterEach,
  BeforeEach,
  Before
}
