// const { Pool } = require('pg');
// const dotenv = require('dotenv');

// dotenv.config(); // load environment variables from .env file

// const connectionString = process.env.DATABASE_URL;

// const pool = new Pool({
//   connectionString: connectionString,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });


// module.exports = pool;


const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: "logun10",
  port: process.env.DB_PORT,
});

module.exports = pool;
