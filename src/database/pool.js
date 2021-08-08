const dotenv = require('dotenv');
dotenv.config();

const { Pool } = require('pg');

const postgresOptions = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: { rejectUnauthorized: false },
};
const pool = new Pool(postgresOptions);

module.exports = pool;
