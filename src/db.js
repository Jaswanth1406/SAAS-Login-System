import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20
});

pool.on('connect', async (client) => {
  await client.query("SET timezone = 'Asia/Kolkata'");
  console.log('Database connected successfully with IST timezone');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

export default pool;