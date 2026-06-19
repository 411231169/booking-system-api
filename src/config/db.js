const mysql = require('mysql2');
require('dotenv').config();

// Create the connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    } else if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused. Check your IP whitelist in cPanel Remote MySQL or your DB_HOST.');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Database access denied. Check your DB_USER and DB_PASSWORD.');
    } else {
      console.error('Database error:', err.message);
    }
  } else {
    console.log('✅ Successfully connected to the MySQL Database!');
    connection.release();
  }
});

const promisePool = pool.promise();

module.exports = promisePool;
