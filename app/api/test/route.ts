import { NextResponse } from "next/server";
import { getConnection } from "@/app/utils/db";
import bcrypt from "bcryptjs";


export async function GET() {
  try {
    const conn = await getConnection();
    const rows = await conn.query("SELECT * FROM profile LIMIT 1");
    conn.release();

    return NextResponse.json({ success: true, rows });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
