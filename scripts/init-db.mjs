/**
 * Applique db/schema.sql sur la base configurée dans .env
 * Usage : npm run db:init
 */
import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

loadEnv();

const sql = fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf8");

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
});

await connection.query(sql);
await connection.end();
console.log("✅ Schéma MySQL appliqué avec succès.");

function loadEnv() {
  const file = fs.existsSync(".env.local") ? ".env.local" : ".env";
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
