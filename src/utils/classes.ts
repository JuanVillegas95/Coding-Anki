import { v4 as uuidv4 } from 'uuid';
import { WARNING_STATUS, FRIEND_STATUS, TOAST_TYPE} from "@/utils/constants"
import { strigifyDate } from "@/utils/functions";
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
  private eventsById: Map<string, Event>;  // Stores all event objects by their unique ID
  private eventIdsByDay: Map<string, Set<string>>;  // Maps specific dates as strings to Set<string> of event IDs for events on those days
  private eventIdsByGroupId: Map<string, Set<string>>; // Maps specific groupId as strings to Set<string> of event IDs for those events Ids
  
    constructor(id: string = uuidv4(), name: string = "Something is wrong") {
      this.id = id;
      this.name = name;
      this.eventsById = new Map<string, Event>();
      this.eventIdsByDay = new Map<string, Set<string>>();
      this.eventIdsByGroupId = new Map<string, Set<string>>();
    }

    public consoleLogDate(event: Event): void {
      if(this.eventsById.get(event.id)){
        if(this.eventsById.get(event.id)?.date) console.log(this.eventsById.get(event.id)?.date)
      }
      
    }

    public deleteEvent(event: Event): void {
      const existingEvent = this.eventsById.get(event.id);
      if (!existingEvent) {
        console.error(`Event with ID ${event.id} does not exist.`);
        return;
      }
    
      // Step 1: Remove the event from the eventsById map
      this.eventsById.delete(event.id);
    
      // Step 2: Remove the event ID from the eventIdsByDay map for its date
      const dateKey: string = existingEvent.date;
      const eventsOnDate = this.eventIdsByDay.get(dateKey);
      if (eventsOnDate) {
        eventsOnDate.delete(event.id);
        if (eventsOnDate.size === 0) {
          this.eventIdsByDay.delete(dateKey);  // Remove the date entry if no more events on that date
        }
      }

      // Step 3: Remove the event ID from the eventIdsByGroupId map if it belongs to a group
      if (existingEvent.groupId) {
        const groupEvents = this.eventIdsByGroupId.get(existingEvent.groupId);
        if (groupEvents) {
          groupEvents.delete(event.id);
          if (groupEvents.size === 0) {
            this.eventIdsByGroupId.delete(existingEvent.groupId);  // Remove the group entry if no more events in the group
          }
        }
      }
    
      console.log(`Event with ID ${event.id} successfully deleted.`);
    }
    

    public setEvent(event: Event): void {
      const existingEvent = this.eventsById.get(event.id);

      if (existingEvent) { // If the event exists, modify it
        // Handle date change in eventIdsByDay
        const updatedEvent = { ...event };
        const oldDateKey: string = existingEvent.date;
        const newDateKey: string = updatedEvent.date;
        // Remove event ID from the old date's Set
        if (oldDateKey !== newDateKey) {
          const oldDateEvents = this.eventIdsByDay.get(oldDateKey);
          if (oldDateEvents) {
            oldDateEvents.delete(updatedEvent.id);
            if (oldDateEvents.size === 0) this.eventIdsByDay.delete(oldDateKey); 
          }
    
          // Add event ID to the new date's Set
          if (this.eventIdsByDay.has(newDateKey)) this.eventIdsByDay.get(newDateKey)!.add(updatedEvent.id);
          else this.eventIdsByDay.set(newDateKey, new Set([updatedEvent.id]));
        }
        this.eventsById.set(updatedEvent.id, updatedEvent);

        //!BANANAS 
        // if (event.groupId) {
        //   if (this.eventIdsByGroupId.has(event.groupId)) this.eventIdsByGroupId.get(event.groupId)!.add(event.id);
        //   else this.eventIdsByGroupId.set(event.groupId, new Set([event.id]));
        // }
        //!

      } else { // If the event doesn't exist, treat it as a new event
        // Add the event to the eventsById map
        this.eventsById.set(event.id, event);
    
        // Step 2: Add the event ID to the eventIdsByDay map for that date
        const dateKey: string = event.date;
        if (this.eventIdsByDay.has(dateKey)) this.eventIdsByDay.get(dateKey)!.add(event.id);
        else this.eventIdsByDay.set(dateKey, new Set([event.id]));
      }
    
      // Step 3: If the event has a groupId, add the event ID to the eventIdsByGroupId map
      // Handle groupId for both add and modify cases
      if (event.groupId) {
        if (existingEvent && existingEvent.groupId !== event.groupId) {
          // If groupId has changed, remove from the old groupId
          const oldGroupEvents = this.eventIdsByGroupId.get(existingEvent.groupId!);
          if (oldGroupEvents) {
            oldGroupEvents.delete(event.id);
            if (oldGroupEvents.size === 0) this.eventIdsByGroupId.delete(existingEvent.groupId!);
          }
        }
    
        // Add event ID to the new groupId's Set
        if (this.eventIdsByGroupId.has(event.groupId)) this.eventIdsByGroupId.get(event.groupId)!.add(event.id);
        else this.eventIdsByGroupId.set(event.groupId, new Set([event.id]));
      }
    }
    
    public getEventsByDate(date: string): Event[] {
      const eventIds: Set<string> | undefined = this.eventIdsByDay.get(date);
    
      if (!eventIds) return [];
    
      const events: Event[] = Array.from(eventIds).map(eventId => this.eventsById.get(eventId)!);

      return events;
    }
    
}




class Event {
  id: string;
  date: string; //YYYY-MM-DD 
  title: string;
  description: string;
  height: number;
  icon: string;
  color: string;
  isFriendEvent: boolean;

  duration: Time;
  start: Time;
  end: Time;
  // Attributes members for reccurring behavior
  endDate: string;
  groupId: string | null;
  storedGroupId: string | null; // In order to handle then toggleing

  selectedDays: boolean[];
  constructor(
    date: Date, 
    start: Time = new Time(), 
    groupId: string | null = null, 
    isFriendEvent: boolean = false,
    height: number = -1, 
    ) {
    this.id = uuidv4();
    this.date = strigifyDate(date);
    this.start = start;
    this.end = new Time(-1, -1);
    this.title = "";
    this.description = "";
    this.color = "purple";
    this.height = height;
    this.duration = new Time(-1, -1);
    this.storedGroupId = null;
    this.icon = "star";
    this.groupId = groupId;
    this.selectedDays = new Array(7).fill(false);
    this.endDate = "";
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
