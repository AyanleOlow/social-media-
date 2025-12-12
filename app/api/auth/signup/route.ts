import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getConnection } from "@/app/utils/db";

export async function POST(req: Request) {
  try {
    const { email, password, username, displayName } = await req.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Email, username and password are required." },
        { status: 400 }
      );
    }

    const conn = await getConnection();

    const [existing]: any = await conn.query(
      "SELECT user_id FROM profile WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existing.length > 0) {
      conn.release();
      return NextResponse.json(
        { error: "Email or username is already taken." },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(password, 12);

    await conn.query(
      "INSERT INTO profile (username, display_name, email, password_hash) VALUES (?, ?, ?, ?)",
      [username, displayName || username, email, hash]
    );

    conn.release();

    return NextResponse.json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error during signup" },
      { status: 500 }
    );
  }
}
