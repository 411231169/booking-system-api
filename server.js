const app = require('./src/app');
const env = require('./src/config/env');
const logger = require('./src/config/logger');
const sequelize = require('./src/config/database');

let server;

const startServer = async () => {
  try {
    // Authenticate Database
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
    
    // In production we usually run migrations instead of sync
    // await sequelize.sync({ force: false });

    server = app.listen(env.port, () => {
      logger.info(`Server listening on port ${env.port} in ${env.env} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
