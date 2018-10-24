const { Http404Error } = require('../errors');

const path = require('path');
const ecies = require("eth-ecies");
const fs = require('fs');

function _decryptPrices(ratePlans){
  var auth_info = fs.readFileSync(path.resolve(__dirname, '../config/authConfig.json'), 'utf8');
  auth_info = JSON.parse(auth_info);
  for (var rateKey in ratePlans) {
      if (ratePlans.hasOwnProperty(rateKey)) {
          for (var priceKey in ratePlans[rateKey]['privatePrices']) {
            if(priceKey!=auth_info.address) continue;
              if (ratePlans[rateKey]['privatePrices'].hasOwnProperty(priceKey)) {
                  var encryptedPrice = ratePlans[rateKey]['privatePrices'][priceKey].toString();
                  var encrypted = ecies.decrypt(Buffer.from(auth_info.privateKey.slice(2),"hex"), Buffer.from(encryptedPrice,"hex"));
                  ratePlans[rateKey]['privatePrices'][priceKey] = parseFloat(encrypted.toString());
              }
          }
      }
  }
}

const findAll = async (req, res, next) => {
  try {
    let plainHotel = await res.locals.wt.hotel.toPlainObject(['ratePlansUri']);
    if (!plainHotel.dataUri.contents.ratePlansUri) {
      return next(new Http404Error('ratePlanNotFound', 'Rate plan not found'));
    }
    let ratePlans = plainHotel.dataUri.contents.ratePlansUri.contents;
    _decryptPrices(ratePlans);
    for (let ratePlanId in ratePlans) {
      ratePlans[ratePlanId].id = ratePlanId;
    }
    res.status(200).json(ratePlans);
  } catch (e) {
    next(e);
  }
};

const find = async (req, res, next) => {
  let { ratePlanId } = req.params;
  try {
    let plainHotel = await res.locals.wt.hotel.toPlainObject(['ratePlansUri']);
    if (!plainHotel.dataUri.contents.ratePlansUri) {
      return next(new Http404Error('ratePlanNotFound', 'Rate plan not found'));
    }
    const ratePlans = plainHotel.dataUri.contents.ratePlansUri.contents;
    _decryptPrices(ratePlans);
    let ratePlan = ratePlans[ratePlanId];
    if (!ratePlan) {
      return next(new Http404Error('ratePlanNotFound', 'Rate plan not found'));
    }
    ratePlan.id = ratePlanId;
    res.status(200).json(ratePlan);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  findAll,
  find,
};
