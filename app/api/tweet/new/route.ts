import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getConnection } from "@/app/utils/db";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");


export async function POST(req: NextRequest) {
  try {

    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth_token");
    const token = tokenCookie?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }



    let payload: any;
    try {
      const verified = await jwtVerify(token, SECRET);
      payload = verified.payload;
    } catch (e) {
      console.error("JWT verification failed:", e);
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

   console.log("Decoded JWT payload:", payload);
const userId = payload.user_id;
if (!userId) {
  console.error("JWT payload missing user_id", payload);
  return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
}

    const { content, gif } = await req.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: "Content required" }, { status: 400 });
    }

    const conn = await getConnection();
    try {
      await conn.query(
        "INSERT INTO tweets (user_id, content, gif) VALUES (?, ?, ?)",
        [userId, content, gif || null]
      );
    } finally {
      conn.release();
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function GET() {
  const conn = await getConnection();
  const [rows]: any = await conn.query(`
    SELECT tweets.id, tweets.content, tweets.gif, tweets.created_at, profile.username, profile.display_name
    FROM tweets
    JOIN profile ON profile.user_id = tweets.user_id
    ORDER BY tweets.created_at DESC
  `);
  conn.release();
  return NextResponse.json(rows);
}
