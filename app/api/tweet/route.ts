import { NextResponse } from "next/server";
import { getConnection } from "@/app/utils/db";

export async function GET() {
  try {
    const conn = await getConnection();

    
    const [rows]: any = await conn.query(
      "SELECT id, user_id, username, display_name, content, gif, created_at FROM tweets ORDER BY created_at DESC"
    );

    conn.release();

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Tweet fetch error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
