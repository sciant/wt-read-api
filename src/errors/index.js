const errorCodes = require('./codes.js');

function handleApplicationError (code, e) {
  if (!e) {
    e = new Error();
  }
  if (code === 'web3') {
    // Generic web3 error
    e.status = 500;
    e.code = `#${code}`;
    e.short = e.name;
    e.long = e.message;
    return e;
  }
  const desc = errorCodes[code] || errorCodes.genericError;
  e.status = desc.status;
  e.code = `#${code}`;
  e.short = desc.short;
  e.long = (code === 'genericError') ? desc.long : (e.message || desc.long);
  return e;
}

module.exports = {
  handleApplicationError,
};
