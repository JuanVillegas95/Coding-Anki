import { v4 as uuidv4 } from 'uuid';
import { WARNING_STATUS, FRIEND_STATUS, TOAST_TYPE} from "@/utils/constants"
import * as I  from "@/utils/icons"

// USER PREMIUM CAN CHOOSE THE COLOR, UPLOUAD ICONS, HAVE 10 CALENDARS, SYNC WITH MULTIPLE USERS
class Friend {
  id: string;
  name: string; //todo remove
  calendars: string[]  //todo remove
  status: FRIEND_STATUS;
  
  constructor(id: string, name: string, calendars: string[], status: FRIEND_STATUS = FRIEND_STATUS.PENDING) {
    this.id = id;
    this.name = name; // todo remove friend
    this.calendars = calendars; // todo remove calendars
    this.status = status;
  }
}

class User {
  id: string;
  email: string;
  username: string;
  password: string;
  calendars: Map<string, Calendar>;
  friends: Friend[];

  constructor(
    id: string = uuidv4(),
    email: string,
    username: string,
    password: string,
    calendars: Map<string, Calendar> = new Map(),
    friends: Friend[],
    ){
      this.id = id;
      this.calendars = calendars;
      this.email = email;
      this.username = username;
      this.password = password;
      this.friends = friends;
    }
}

class Calendar {
  id: string;
  name: string;
  events: Map<string, Event>;
  
  recurringEventIDs: Map<string, string[][]>; 
  // The key is the eventGroupID that all the events in the same group shares.
  // The value is a string of 7 positions representing the day of the week and in every position the keys of the events are stored BUCKET TRICK!!
  constructor(
    id: string = uuidv4(), 
    name: string = "Something is wrong", 
    events: Map<string, Event> = new Map(),
    recurringEventIDs: Map<string, string[][]> = new Map()
  ){
    this.id = id;
    this.name = name;
    this.events = events;
    this.recurringEventIDs = recurringEventIDs;
  }
}

class Event {
  id: string;
  date: Date;
  title: string;
  description: string;
  start: Time;
  end: Time;
  height: number;
  duration: Time;
  icon: React.ComponentType;
  color: string;

    // Attributes members for reccurring behavior
  startDate: Date;
  endDate: Date | null;
  eventGroupID: string | null;
  selectedDays: boolean[];

  constructor(date: Date = new Date(), start: Time = new Time(), eventGroupID: string | null = null) {
    this.id = uuidv4();
    this.date = date;
    this.start = start;
    this.end = new Time(-1, -1);
    this.title = "";
    this.description = "";
    this.color = "purple";
    this.height = -1;
    this.duration = new Time(-1, -1);
    this.icon = I.star;
    this.eventGroupID = eventGroupID;
    this.selectedDays = Array(7).fill(false);
    this.startDate = date;
    this.endDate = null;
  }
}

class Time {
  hours: number;
  minutes: number;

  constructor(hours: number = 0, minutes: number = 0) {
    this.hours = hours;
    this.minutes = minutes;
  }
}

class Toast {
  id: string
  description: string;
  type: TOAST_TYPE; 

  constructor(id: string, description: string, type: TOAST_TYPE) { 
    this.id = id;
    this.description = description;
    this.type = type;
  }
}

class Warning {
  currentEvent: Event | null;
  conflictEvents: Event[] | null;
  recurringEvents: Event[] | null;
  status: WARNING_STATUS;

  constructor(
    status: WARNING_STATUS = WARNING_STATUS.NONE,
    currentEvent: Event | null = null,
    conflictEvents: Event[] | null = null,
    recurringEvents:  Event[] | null = null,
  ) {
    this.currentEvent = currentEvent;
    this.conflictEvents = conflictEvents;
    this.recurringEvents = recurringEvents;
    this.status = status;
  }
}


export { Event, Time, Calendar, User, Friend, Toast, Warning};
