import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "supabase_schema_and_seed.sql");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "SQL file not found" }, { status: 404 });
    }
    const sqlContent = fs.readFileSync(filePath, "utf-8");
    return new NextResponse(sqlContent, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": 'attachment; filename="supabase_schema_and_seed.sql"',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
