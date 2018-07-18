const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const app = express();
const { logger } = require('./config');
const { version } = require('../package.json');

const { validateIPWhiteList } = require('./middlewares');
const { hotelsRouter } = require('./routes/hotels');
const { handleApplicationError } = require('./errors');

const swaggerDocument = YAML.load(path.resolve('./docs/swagger.yaml'));
 
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json());
app.use('/*', validateIPWhiteList);
app.use(hotelsRouter);

// Root handler
app.get('/', (req, res) => {
  const response = {
    docs: 'https://github.com/windingtree/wt-read-api/blob/master/README.md',
    info: 'https://github.com/windingtree/wt-read-api',
    version,
  };
  res.status(200).json(response);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    code: '#notFound',
    short: 'Page not found',
    long: 'This endpoint does not exist',
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(err.message);
  if (!err.code) {
    // Handle special cases of generic errors
    if (err.message === 'Invalid JSON RPC response: ""') {
      err = handleApplicationError('unreachableChain', err);
    } else {
      err = handleApplicationError('genericError', err);
    }
  }
  res.status(err.status).json({
    status: err.status,
    code: err.code,
    short: err.short,
    long: err.long,
  });
});

module.exports = {
  app,
};
