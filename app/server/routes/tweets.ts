import { Router } from "express";
import { getConnection } from "../../utils/db";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";


const router = Router();
const SECRET = process.env.JWT_SECRET || "dev-secret";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.auth_token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const payload = jwt.verify(token, SECRET);
    (req as any).user = payload; 
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}



router.post("/new", authMiddleware, async (req, res) => {
  const { content, gif } = req.body;
  const userId = (req as any).user.user_id;

  const conn = await getConnection();
  await conn.query("INSERT INTO tweets (user_id, content, gif) VALUES (?, ?, ?)", [
    userId,
    content,
    gif || null,
  ]);
  conn.release();

  res.json({ success: true });
});


router.get("/", async (req, res) => {
  const conn = await getConnection();
  const [rows]: any = await conn.query(`
    SELECT tweets.id, tweets.content, tweets.gif, tweets.created_at,
           profile.username, profile.display_name
    FROM tweets
    JOIN profile ON profile.user_id = tweets.user_id
    ORDER BY tweets.created_at DESC
  `);
  conn.release();

  res.json(rows);
});

export default router;
