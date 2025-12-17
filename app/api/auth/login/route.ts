import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getConnection } from "@/app/utils/db";
import { SignJWT } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const conn = await getConnection();

    const [rows]: any = await conn.query(
      "SELECT user_id, username, display_name, email, password_hash FROM profile WHERE email = ?",
      [email]
    );

    conn.release();

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = rows[0];

    const isCorrect = await bcrypt.compare(password, user.password_hash);
    if (!isCorrect) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }


    const token = await new SignJWT({
      user_id: user.user_id,
      username: user.username,
      display_name: user.display_name,
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(SECRET);

    const res = NextResponse.json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        username: user.username,
        display_name: user.display_name,
        email: user.email,
      },
    });

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
    return NextResponse.json(
      { error: "Server error during login" },
      { status: 500 }
    );
  }
}
