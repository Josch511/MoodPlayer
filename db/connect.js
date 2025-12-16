// import from postGreSQL
import pg from 'pg';
// login informationer
import dotenv from 'dotenv';

// importere connect funktionen og henter vores PG data
export async function connect() {
    dotenv.config();
    const pool = new pg.Pool({
        host: process.env.PG_HOST,
        port: parseInt(process.env.PG_PORT),
        database: process.env.PG_DATABASE,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        ssl: { rejectUnauthorized: false },
    });
    const dbResult = await pool.query('select now()');
    console.log('Database connection established on', dbResult.rows[0].now);
    return pool;
}
