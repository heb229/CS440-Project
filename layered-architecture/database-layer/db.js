import pkg from 'pg'
const { Pool } = pkg;

import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "moviedb",
});

pool.query('SELECT 1')
    .then(() => console.log("Connected to PostgreSQL database."))
    .catch((err) => console.error("Database connection error", err.message));

export default pool;