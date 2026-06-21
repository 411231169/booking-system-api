const { StatusCodes } = require('http-status-codes');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
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


// API routes
app.use('/api', routes);

// Handle unknown API requests
app.use((req, res, next) => {
  next(new AppError(`Not Found - ${req.originalUrl}`, StatusCodes.NOT_FOUND));
});

// Centralized error handling
app.use(errorMiddleware);

module.exports = app;
