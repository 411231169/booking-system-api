const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const env = require('./config/env');
const logger = require('./config/logger');
const routes = require('./routes');
const { errorMiddleware } = require('./middlewares/error.middleware');
const rateLimiter = require('./middlewares/rateLimit.middleware');
const { sendError } = require('./utils/response');
const { AppError } = require('./middlewares/error.middleware');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Parse json request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Gzip compression
app.use(compression());

// Enable cors
app.use(cors({ origin: env.cors.origin }));

// Rate limiting
app.use('/api', rateLimiter);

// Logger middleware
const morganFormat = env.env === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
  stream: { write: (message) => logger.http(message.trim()) }
}));

// Swagger documentation
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API routes
app.use('/api/v1', routes);

// Handle unknown API requests
app.use((req, res, next) => {
  next(new AppError(`Not Found - ${req.originalUrl}`, 404));
});

// Centralized error handling
app.use(errorMiddleware);

module.exports = app;
