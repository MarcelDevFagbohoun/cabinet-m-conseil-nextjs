require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function createAdmin() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: true },
  });

  const email = 'admin@cabinet-mconseil.com';
  const plainPassword = 'MotDePasseFort123!';
  const fullName = 'Marcel Houénou';
  const role = 'admin';

  const passwordHash = await bcrypt.hash(plainPassword, 12);

  await pool.query(
    `INSERT INTO admin_users (email, password_hash, full_name, role, is_active, failed_attempts)
     VALUES (?, ?, ?, ?, 1, 0)`,
    [email, passwordHash, fullName, role]
  );

  console.log('✅ Compte admin créé :', email);
  process.exit(0);
}

createAdmin().catch(err => {
  console.error('❌ Erreur :', err);
  process.exit(1);
});