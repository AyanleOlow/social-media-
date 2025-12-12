import mariadb from "mariadb";


const pool = mariadb.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  connectionLimit: 5,
});

export async function getConnection() {
  const conn = await pool.getConnection();
  return conn;
}
