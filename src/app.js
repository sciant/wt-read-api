const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan');
const YAML = require('yamljs');
const app = express();
const config = require('./config');
const { version } = require('../package.json');

const { validateIPWhiteList } = require('./middlewares');
const { hotelsRouter } = require('./routes/hotels');
const { handleApplicationError } = require('./errors');

const swaggerDocument = YAML.load(path.resolve('./docs/swagger.yaml'));
 
// Swagger docs

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Generic middlewares

app.use(bodyParser.json());
// Logging only when not in test mode
if (config.logHttpTraffic) {
  app.use(morgan(':remote-addr :remote-user [:date[clf]] :method :url HTTP/:http-version :status :res[content-length] - :response-time ms', {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
    stream: process.stderr,
  }));

  app.use(morgan(':remote-addr :remote-user [:date[clf]] :method :url HTTP/:http-version :status :res[content-length] - :response-time ms', {
    skip: function (req, res) {
      return res.statusCode >= 400;
    },
    stream: process.stdout,
  }));
}
app.use('/*', validateIPWhiteList);

// Router

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
  config.logger.error(err.message);
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
