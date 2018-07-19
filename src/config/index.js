const env = process.env.WT_CONFIG || 'local';
const envConfig = require(`./${env}`);

module.exports = Object.assign({}, envConfig);
