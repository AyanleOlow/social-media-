import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getConnection } from "@/app/utils/db";
import { SignJWT } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

export async function POST(req: Request) {
  try {
    const { email, password, username, displayName } = await req.json();

    if (!email || !password || !username || !displayName) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const conn = await getConnection();

    const [existing]: any = await conn.query(
      "SELECT user_id FROM profile WHERE email = ? OR username = ?",
      [email, username]
    );

    const rows = Array.isArray(existing) ? existing : [];
    if (rows.length > 0) {
      conn.release();
      return NextResponse.json({ error: "Email or username is already taken." }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 12);

    const insertResult: any = await conn.query(
  "INSERT INTO profile (username, display_name, email, password_hash) VALUES (?, ?, ?, ?)",
  [username, displayName, email, hash]
);

const userId = insertResult[0]?.insertId;

    conn.release();

    if (!userId) return NextResponse.json({ error: "Failed to create user" }, { status: 500 });

    const token = await new SignJWT({
      user_id: userId,       
      username,
      display_name: displayName,
      email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(SECRET);

   
      
    const res = NextResponse.json({ message: "Signup successful" });
    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, 
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error during signup" }, { status: 500 });
  }
}
