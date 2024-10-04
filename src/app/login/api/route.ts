import { getConnection } from "@/server/oracledb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const oauth_id = searchParams.get('oauth_id');

  try {
    const connection = await getConnection();
    const userQuery = `SELECT * FROM USERS WHERE oauth_id = :oauth_id`;
    const userResult = await connection.execute(userQuery, [oauth_id]);

    await connection.close();
    if(userResult.rows){
      if (userResult.rows.length === 0) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
  
      const user = userResult.rows[0];
      return NextResponse.json({ user });
    }
    
  } catch (error) {
    console.error('Error during GET /login:', error);
    return NextResponse.json({ message: 'Error checking user' }, { status: 500 });
  }
}





