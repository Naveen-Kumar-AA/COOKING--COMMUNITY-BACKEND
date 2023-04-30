const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config(); // load environment variables from .env file

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});


module.exports = pool;
