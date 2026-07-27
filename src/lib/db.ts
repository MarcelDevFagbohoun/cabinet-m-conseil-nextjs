import mysql from "mysql2/promise";

/**
 * Pool MySQL partagé. Toutes les requêtes utilisent des requêtes préparées
 * (placeholders `?`) : aucune concaténation de valeurs utilisateur en SQL.
 */
declare global {
  // eslint-disable-next-line no-var
  var __mysqlPool: mysql.Pool | undefined;
}

function createPool() {
  return mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 5,
    enableKeepAlive: true,
    charset: "utf8mb4_unicode_ci",
    timezone: "Z",
    dateStrings: false,
    // Jamais activé : empêche les injections par empilement de requêtes.
    multipleStatements: false,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
  });
}

export const pool: mysql.Pool = global.__mysqlPool ?? createPool();
if (process.env.NODE_ENV !== "production") global.__mysqlPool = pool;

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

export async function execute(sql: string, params: any[] = []) {
  const [result] = await pool.execute(sql, params);
  return result as mysql.ResultSetHeader;
}

export async function transaction<T>(fn: (conn: mysql.PoolConnection) => Promise<T>): Promise<T> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}
