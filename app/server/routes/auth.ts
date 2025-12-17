import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getConnection } from "../../utils/db";

const router = Router();
const SECRET = process.env.JWT_SECRET || "dev-secret";

// Signup
router.post("/signup", async (req, res) => {
  const { email, username, password, displayName } = req.body;
  const conn = await getConnection();

  // Check if user exists
  const [existing]: any = await conn.query(
    "SELECT user_id FROM profile WHERE email = ? OR username = ?",
    [email, username]
  );
  if (existing) return res.status(400).json({ error: "User exists" });

  // Hash password
  const hash = await bcrypt.hash(password, 12);

  await conn.query(
    "INSERT INTO profile (username, display_name, email, password_hash) VALUES (?, ?, ?, ?)",
    [username, displayName, email, hash]
  );

  conn.release();
  res.json({ message: "Signup successful" });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const conn = await getConnection();

  const [rows]: any = await conn.query(
    "SELECT user_id, username, display_name, email, password_hash FROM profile WHERE email = ?",
    [email]
  );

  if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

  const user = rows[0];
  const isCorrect = await bcrypt.compare(password, user.password_hash);
  if (!isCorrect) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { user_id: user.user_id, username: user.username, display_name: user.display_name },
    SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Login successful", user });
});

export default router;
