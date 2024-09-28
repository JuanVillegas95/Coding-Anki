import { v4 as uuidv4 } from 'uuid';
import { WARNING_STATUS, FRIEND_STATUS, TOAST_TYPE} from "@/utils/constants"
import * as I  from "@/utils/icons"

class User {
  id: string;  
  oauthId: string;  
  calendars: Map<string, Calendar>;  
  friendIds: Set<string>;  

  constructor(
    id: string = uuidv4(),
    oauthId: string,  
    calendars: Map<string, Calendar> = new Map(),
    friendIds: Set<string> = new Set()
  ) {
    this.id = id;
    this.oauthId = oauthId;
    this.calendars = calendars;
    this.friendIds = friendIds;
  }
}


class Calendar {
  id: string;
  name: string;
  events: Map<string, Event>;
  recurringEventIDs: Record<number, Map<string, Set<string>>>;

  constructor(
    id: string = uuidv4(), 
    name: string = "Something is wrong", 
    events: Map<string, Event> = new Map(),
    recurringEventIDs: Record<number, Map<string, Set<string>>> = {
      0: new Map(), // Monday
      1: new Map(), // Tuesday
      2: new Map(), // Wednesday
      3: new Map(), // Thursday
      4: new Map(), // Friday
      5: new Map(), // Saturday
      6: new Map(), // Sunday
    }
  ) {
    this.id = id;
    this.name = name;
    this.events = events;
    this.recurringEventIDs = recurringEventIDs;
  }
}


// Explanation:
// `recurringEventIDs`: Record<number, Map<string, Set<string>>>
// - The `Record` has fixed keys from 0 to 6 representing days of the week (Monday to Sunday).
// - Each key in the `Record` points to a `Map<string, Set<string>>`:
//     - The `Map`'s keys are `groupIDs`, representing groups of recurring events.
//     - The `Map`'s values are `Set<string>`, which contains event IDs that belong to the `groupID` for that particular day.
// - Using `Record<number, Map<string, Set<string>>>` allows efficient operations with **O(1)** time complexity for adding 



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
  isFriendEvent: boolean;

    // Attributes members for reccurring behavior
  startDate: Date;
  endDate: Date | null;
  groupID: string | null;
  storedGroupId: string | null; // In order to handle then toggleing

  selectedDays: boolean[];
  constructor(
    date: Date = new Date(), 
    start: Time = new Time(), 
    groupID: string | null = null, 
    isFriendEvent: boolean = false,
    height: number = -1, 
    ) {
    this.id = uuidv4();
    this.date = date;
    this.start = start;
    this.end = new Time(-1, -1);
    this.title = "";
    this.description = "";
    this.color = "purple";
    this.height = height;
    this.duration = new Time(-1, -1);
    this.storedGroupId = null;
    this.icon = I.star;
    this.groupID = groupID;
    this.selectedDays = Array(7).fill(false);
    this.startDate = date;
    this.endDate = null;
    this.isFriendEvent = isFriendEvent;
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
  beforeDragEvent: Event | null;
  status: WARNING_STATUS;

  constructor(
    status: WARNING_STATUS = WARNING_STATUS.NONE,
    currentEvent: Event | null = null,
    conflictEvents: Event[] | null = null,
    recurringEvents:  Event[] | null = null,
    beforeDragEvent: Event | null = null,
  ) {
    this.currentEvent = currentEvent;
    this.conflictEvents = conflictEvents;
    this.recurringEvents = recurringEvents;
    this.status = status;
    this.beforeDragEvent = beforeDragEvent;
  }
}


export { Event, Time, Calendar, User, Toast, Warning};
