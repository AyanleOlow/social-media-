import { NextResponse } from "next/server";
import { getConnection } from "@/app/utils/db";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

export async function POST(req: Request) {
  try {
    const { content, gif } = await req.json();

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const cookie = req.headers.get("cookie") || "";
    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("auth_token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, SECRET);

    const conn = await getConnection();

    await conn.query(
      `INSERT INTO tweets (user_id, username, display_name, content, gif)
       VALUES (?, ?, ?, ?, ?)`,
      [
        payload.user_id,
        payload.username,
        payload.display_name || payload.username,
        content,
        gif || null,
      ]
    );

    conn.release();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
