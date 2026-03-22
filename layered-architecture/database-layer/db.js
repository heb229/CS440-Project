import pkg from 'pg'
const { Pool } = pkg;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "movie_review_db",
    password: "8097531*rH12",
    port: 5432
});

pool.connect()
    .then(() => console.log("Connected to PostgreSQL database."))
    .catch((err) => console.error("Database connection error", err.message));

export default pool;