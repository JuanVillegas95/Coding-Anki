import { NextResponse } from "next/server";
import { getConnection } from "@/server/oracledb";
import OracleDB from "oracledb";
import { ServerCalendarEventRow, ServerCalendar, ServerEvent } from "@/utils/types"

export async function GET(request: Request, { params }: { params: { user_id: string } }) {
  const userId: string = params.user_id;

  try {
    // Get a connection from the pool
    const connection: OracleDB.Connection = await getConnection();

    // Define the query to fetch all calendars for the user along with their events
    const query: string = `
      SELECT 
        c.id AS calendar_id,
        c.name AS calendar_name,
        c.timezone,
        e.id AS event_id,
        e.title AS event_title,
        e.description,
        e.event_date,
        e.icon_name,
        e.color,
        e.height,
        e.top_offset
      FROM 
        CALENDARS c
      LEFT JOIN 
        EVENTS e ON c.id = e.calendar_id
      WHERE 
        c.user_id = :userId
    `;

    // Execute the query with explicit typing and outFormat as OBJECT
    const result: OracleDB.Result<ServerCalendarEventRow> = await connection.execute<ServerCalendarEventRow>(query,[userId],);

    if (result.rows && result.rows.length > 0) {
      // Organize the calendars and their events
      const calendarsMap: { [key: string]: ServerCalendar } = {};

      // Use the correct type for rows (each row is of type CalendarEventRow)
      result.rows.forEach((row: ServerCalendarEventRow) => {
        const calendarId = row.CALENDAR_ID;
        if (!calendarsMap[calendarId]) {
          calendarsMap[calendarId] = {
            id: row.CALENDAR_ID,
            name: row.CALENDAR_NAME,
            timezone: row.TIMEZONE,
            events: [], // Initialize an empty array for events
          };
        }

        // Only add events if EVENT_ID is not null
        if (row.EVENT_ID !== null) {
          calendarsMap[calendarId].events.push({
            id: row.EVENT_ID,
            title: row.EVENT_TITLE,
            description: row.DESCRIPTION,
            eventDate: row.EVENT_DATE,
            iconName: row.ICON_NAME,
            color: row.COLOR,
            height: row.HEIGHT,
            topOffset: row.TOP_OFFSET,
            groupId: row.GROUP_ID,
            startDate: row.START_DATE,
            endDate: row.END_DATE,
          });
        }
      });

      const calendarsArray: ServerCalendar[] = Object.values(calendarsMap);
      return NextResponse.json(calendarsArray);
    } else {
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error("Error fetching calendars and events:", error);

    // Return a 500 response in case of server/database error
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}