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


// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'Cooking-Community',
//   password: 'logun10',
//   port: 5432,
// });

// module.exports = pool;
