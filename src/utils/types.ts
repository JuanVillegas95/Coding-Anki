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

export type EventData = {
    event: {
      ID: string;
      CALENDAR_ID: string;
      GROUP_ID: string;
      TITLE: string;
      DESCRIPTION: string;
      EVENT_DATE: string;
      ICON_NAME: string;
      COLOR: string;
      HEIGHT: number;
      TOP_OFFSET: number;
    };
  };

  export type CalendarData = {
    calendar: {
      ID: string;
      USER_ID: string;
      NAME: string;
    };
  };

  
  
  export type FriendshipData = {
    friendship: {
      USER_ID: string;
      FRIEND_ID: string;
    };
  };
  