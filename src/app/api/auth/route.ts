import { getConnection } from "@/server/oracledb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const user_id = searchParams.get("userId");

  try {
    const connection = await getConnection();
    const query: string = `
      SELECT 
          ID, NAME
      FROM 
          CALENDARS
      WHERE 
          USER_ID = :user_id
    `;
    const result = await connection.execute(query, [user_id]);
    await connection.close();

    return NextResponse.json({ calendars: result.rows });
    
  } catch (error) {
    console.error('Error during GET /calendar:', error);
    return NextResponse.json({ message: 'Error fetching calendar data' }, { status: 500 });
  }
}
