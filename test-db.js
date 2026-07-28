require("dotenv").config();
const dns = require("dns");
const mysql = require("mysql2/promise");

dns.setDefaultResultOrder("ipv4first");

async function testConnection() {
  const required = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Variables manquantes dans .env : ${missing.join(", ")}`);
  }

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
    },
    connectTimeout: 20000,
    waitForConnections: true,
    connectionLimit: 5,
  });

  try {
    const [rows] = await pool.query("SELECT VERSION() AS version");
    console.log("✅ Connexion OK :", rows);

    const [dbs] = await pool.query("SHOW DATABASES");
    console.log(
      "📂 Bases visibles :",
      dbs.map((d) => d.Database)
    );

    const [tables] = await pool.query("SHOW TABLES");
    console.log("📋 Tables dans", process.env.DB_NAME, ":", tables);
  } finally {
    await pool.end();
  }
}

testConnection().catch((err) => {
  console.error("❌ Erreur :", err.message);
  if (err.code) console.error("   Code :", err.code);
  process.exit(1);
});