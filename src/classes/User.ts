import { Calendar } from "@/classes/Calendar";
import { v4 as uuidv4 } from "uuid";

export type userId = string;
export type calendarId = string;
export type oauthId = string;
export type friendId = string;

export class User {
    private userId: userId;  
    private oauthId: oauthId;  
    private calendars: Map<calendarId, Calendar>;  
    private friendIds: Set<friendId>;  
  
    constructor(
      userId: userId = uuidv4(),
      oauthId: oauthId,  
      calendars: Map<calendarId, Calendar> = new Map(),
      friendIds: Set<friendId> = new Set()
    ) {
      this.userId = userId;
      this.oauthId = oauthId;
      this.calendars = calendars;
      this.friendIds = friendIds;
    }
}