const config = require('../config');

function getInstance () {
  return config.wtLibs;
}

async function getWTIndex () {
  const wtLibsInstance = getInstance();
  return wtLibsInstance.getWTIndex(config.wtIndexAddress);
}

module.exports = {
  getInstance,
  getWTIndex,
};
