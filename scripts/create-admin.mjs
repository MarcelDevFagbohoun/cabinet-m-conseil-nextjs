/**
 * Crée (ou met à jour) un compte administrateur.
 * Usage : npm run admin:create -- admin@cabinet.bj "MotDePasseFort123!" "Nom Complet"
 */
import fs from "node:fs";
import readline from "node:readline/promises";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

loadEnv();

const [, , argEmail, argPassword, ...nameParts] = process.argv;
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const email = (argEmail || (await rl.question("Email admin : "))).trim().toLowerCase();
const password = argPassword || (await rl.question("Mot de passe (12 caractères min.) : "));
const fullName = nameParts.join(" ") || (await rl.question("Nom complet : ")) || "Administrateur";
rl.close();

if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Email invalide.");
if (password.length < 12) throw new Error("Mot de passe trop court (12 caractères minimum).");

const hash = await bcrypt.hash(password, 12);

const conn = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
});

await conn.execute(
  `INSERT INTO admin_users (email, password_hash, full_name, role)
   VALUES (?, ?, ?, 'admin')
   ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash),
                           full_name = VALUES(full_name),
                           is_active = 1, failed_attempts = 0, locked_until = NULL`,
  [email, hash, fullName]
);
await conn.end();
console.log(`✅ Compte administrateur prêt : ${email}`);

function loadEnv() {
  const file = fs.existsSync(".env.local") ? ".env.local" : ".env";
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
