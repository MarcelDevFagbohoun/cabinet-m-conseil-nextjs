require("dotenv").config();
const dns = require("dns");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const readline = require("readline");

dns.setDefaultResultOrder("ipv4first");

function ask(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  const required = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Variables manquantes dans .env : ${missing.join(", ")}`);
  }

  const email = await ask("Email admin : ");
  const fullName = await ask("Nom complet : ");
  const password = await ask("Mot de passe : ");

  if (!email || !password || password.length < 8) {
    throw new Error("Email requis et mot de passe d'au moins 8 caractères.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true },
    connectTimeout: 20000,
  });

  try {
    const [existing] = await pool.query(
      "SELECT id FROM admin_users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      await pool.query(
        "UPDATE admin_users SET password_hash = ?, full_name = ?, is_active = 1 WHERE email = ?",
        [passwordHash, fullName, email]
      );
      console.log(`✅ Compte admin existant mis à jour : ${email}`);
    } else {
      await pool.query(
        "INSERT INTO admin_users (email, password_hash, full_name, role, is_active) VALUES (?, ?, ?, 'admin', 1)",
        [email, passwordHash, fullName]
      );
      console.log(`✅ Compte admin créé : ${email}`);
    }
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("❌ Erreur :", err.message);
  process.exit(1);
});
