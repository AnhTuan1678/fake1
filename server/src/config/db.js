const { Pool } = require('pg')

// Kết nối tới PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'NaDark',
  password: '1',
  port: 5432,
})

const query = (text, params) => pool.query(text, params)

module.exports = { query, pool }
