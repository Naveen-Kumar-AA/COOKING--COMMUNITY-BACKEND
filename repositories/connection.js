const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Cooking-Community',
  password: 'logun10',
  port: 5432, // default port for PostgreSQL
});

module.exports = pool;
