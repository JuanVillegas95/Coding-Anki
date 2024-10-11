import { Toast,Event } from "@/utils/classes"

export type WeekHandler = {
    next: () => void;
    prev: () => void;
    curr: () => void;
};


export type EventOnMouseDownType = {
    create: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, date: Date) => void;
    drag: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, event: Event) => void;
    bottom: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, event: Event) => void;
    top: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, event: Event) => void;
};

export type UserData = {
    user: {
        ID: string,
        USERNAME: string;
    }
}

export type ServerCalendarEventRow = {
  CALENDAR_ID: string;
  CALENDAR_NAME: string;
  TIMEZONE: string | null;
  EVENT_ID: string;
  EVENT_TITLE: string | null;
  DESCRIPTION: string | null;
  EVENT_DATE: string;
  ICON_NAME: string;
  COLOR: string;
  HEIGHT: number;
  TOP_OFFSET: number;
  GROUP_ID: string | null;
  START_DATE: string | null;
  END_DATE: string | null;
}
  
export type ServerEvent = {
  id: string;
  title: string | null;
  description: string | null;
  eventDate: string;
  iconName: string;
  color: string;
  height: number;
  topOffset: number;
  groupId: string | null;
  startDate: string | null;
  endDate: string | null;
}

export type ServerCalendar = {
  id: string;
  name: string;
  timezone: string | null;
  events: ServerEvent[];
}