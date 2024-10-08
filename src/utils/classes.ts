import { v4 as uuidv4 } from 'uuid';
import { WARNING_STATUS, FRIEND_STATUS, TOAST_TYPE} from "@/utils/constants"
import { strigifyDate, addDateBy, parseDateStringToUTC, getDay } from "@/utils/functions";
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
  private debugMaps(): void {
    // Logging the eventsById map
    console.log("Events By ID:");
    this.eventsById.forEach((event, eventId) => {
      console.log(`Event ID: ${eventId}`, event);
    });
    
    // Logging the eventIdsByDay map
    console.log("Event IDs By Day:");
    this.eventIdsByDay.forEach((eventIdsSet, day) => {
      console.log(`Day: ${day}`);
      console.log("Event IDs:", Array.from(eventIdsSet).join(', '));
    });
    
    // Logging the eventIdsByGroupId map
    console.log("Event IDs By Group ID:");
    this.eventIdsByGroupId.forEach((eventIdsSet, groupId) => {
      console.log(`Group ID: ${groupId}`);
      console.log("Event IDs:", Array.from(eventIdsSet).join(', '));
    });
  }
    
  private getEventSummary({selectedDays, id ,date, groupId, storedGroupId}: Event): string {
    const selectedDaysString = selectedDays
      .map((selected, index) => (selected ? index : null))
      .filter(day => day !== null)
      .join(', ');
  
    return `Event Summary:
    - ID: ${id}
    - Date: ${date}
    - Group ID: ${groupId ?? 'None'}
    - Stored Group ID: ${storedGroupId ?? 'None'}
    - Selected Days: [${selectedDaysString || 'None'}]`;
  }

  private deleteEvent(eventToDelete: Event): void {
    if(eventToDelete.groupId) this.deleteEventIdFromGroup(eventToDelete.groupId, eventToDelete.id);
    this.deleteEventIdFromDate(eventToDelete.date, eventToDelete.id);
    this.eventsById.delete(eventToDelete.id);
    console.log("The following event was deleted", this.getEventSummary(eventToDelete));
  }

  private addEvent(newEvent: Event): void {
    if(newEvent.groupId) this.addEventIdToGroup(newEvent.groupId, newEvent.id);
    this.addEventIdToDate(newEvent.date, newEvent.id);
    this.eventsById.set(newEvent.id, newEvent);
    console.log("The following event was added", this.getEventSummary(newEvent));
  }

    // Will set the values of existingEvent from updatedEvent
  private updateEvent(existingEvent: Event, updatedEvent: Event){
    // if (existingEvent.date !== updatedEvent.date) {
    //   this.deleteEventIdFromDate(existingEvent.date, updatedEvent.id);
    //   this.addEventIdToDate(updatedEvent.date, updatedEvent.id);
    // }
    this.eventsById.set(existingEvent.id, updatedEvent);
    console.log("The following event was updated", this.getEventSummary(updatedEvent));
  }

  public deleteEventSubmit(eventToDelete: Event): void {
    if(!eventToDelete.groupId) this.deleteEvent(eventToDelete);
    else this.getEventsByGroupId(eventToDelete.groupId).forEach((event: Event) => this.deleteEvent(event));
  
  }

  public setEvent(eventToSet: Event): void {
    const existingEvent: Event | undefined = this.eventsById.get(eventToSet.id);
    
    if (!existingEvent){ this.addEvent(eventToSet); return; }

    // Branch 1: If (was standalone, stays standalone) Update standalone.
    if(!existingEvent.groupId && !eventToSet.groupId) this.updateEvent(existingEvent,eventToSet);
      
    // Branch 2: If (was standalone, now groupId) Update standalone, Create new reucurring instances.
    else if(!existingEvent.groupId && eventToSet.groupId){
      console.log("Branch 3, was standalone, now groupId");
      // Step 1: Update the standalone
      const eventToSetCopy: Event = { ...eventToSet, id: existingEvent.id, date: existingEvent.date };
      this.addEventIdToGroup(eventToSetCopy.groupId!,eventToSetCopy.id);
      this.updateEvent(existingEvent,eventToSetCopy)

      // Step 2: Create new instances (exculding the updated one)
      const startDate: Date = parseDateStringToUTC(eventToSet.startDate);
      const endDate: Date = parseDateStringToUTC(eventToSet.endDate);
  
      for (let date = addDateBy(startDate, 1); date <= endDate!; date = addDateBy(date, 1)) {
        const stringifiedDate: string = strigifyDate(date);
        const day: number = getDay(stringifiedDate);
        if (!eventToSet.selectedDays[day]) continue;
        
        const newEventToSetCopy: Event = { ...eventToSetCopy, id: uuidv4(), date: stringifiedDate };
        this.addEvent(newEventToSetCopy);
      }
    }

    // Branch 3: If (was groupId, now standalone) Update the standalone, Delete the recurring instances.
    else if (existingEvent.groupId && !eventToSet.groupId) {
      console.log("Branch 3: Transition from group to standalone");
    
      // Step 1: Delete all recurring events from the group
      const eventsByGroupId: Event[] = this.getEventsByGroupId(existingEvent.groupId);
      eventsByGroupId.forEach((event: Event) => {
          this.deleteEvent(event);
      });

      // Step 2: Update the existing event to standalone
      const booleanArray: boolean[] = Array(7).fill(false);
      booleanArray[getDay(eventToSet.date)] = true;
      const eventToSetCopy: Event = { 
          ...eventToSet, 
          id: existingEvent.id,     // Retain the original event's id
          storedGroupId: null,
          groupId: null,       // Remove groupId to make it standalone
          selectedDays: booleanArray,  // Remove recurrence logic (if applicable)
          startDate: eventToSet.date, // Update start and end dates if needed
          endDate: ""
      };
    
      this.updateEvent(existingEvent, eventToSetCopy);
    }
    
    // Branch 4: If (was groupdId, stays groupId)Update, Create or Delete according 'selectedDays' and 'dates' 
    else if (existingEvent.groupId && eventToSet.groupId) { 
      console.log("Branch 4,  Update, Create or Delete according selectedDays transitioning");
      const existingEventEndDate: Date = parseDateStringToUTC(existingEvent.endDate);
      const existingEventStartDate: Date = parseDateStringToUTC(existingEvent.startDate);
      const eventToSetStartDate: Date = parseDateStringToUTC(eventToSet.startDate);
      const eventToSetEndDate: Date = parseDateStringToUTC(eventToSet.endDate);

      if (existingEventEndDate > eventToSetEndDate) {
        for (let date = addDateBy(eventToSetEndDate, 1); date <= existingEventEndDate; date = addDateBy(date, 1)) {
          const stringifiedDate = strigifyDate(date);
          const eventsByDate: Event[] = this.getEventsByDate(stringifiedDate);
          const foundEvent: Event | undefined = eventsByDate.find((eventByDate: Event) => eventByDate.groupId === existingEvent.groupId);
          if (foundEvent) this.deleteEvent(foundEvent);
        }
      }
        
      if (existingEventStartDate < eventToSetStartDate) {
        for (let date = existingEventStartDate; date < eventToSetStartDate; date = addDateBy(date, 1)) {
          const stringifiedDate = strigifyDate(date);
          const eventsByDate: Event[] = this.getEventsByDate(stringifiedDate);
          const foundEvent: Event | undefined = eventsByDate.find((eventByDate: Event) => eventByDate.groupId === existingEvent.groupId);
          if (foundEvent) this.deleteEvent(foundEvent);
        }
      }

      for (let date = eventToSetStartDate; date <= eventToSetEndDate; date = addDateBy(date, 1)) {
        const stringifiedDate: string = strigifyDate(date);
        const day: number = getDay(stringifiedDate);
        const prevSelected: boolean =  existingEvent.selectedDays[day];
        const currSelected: boolean = eventToSet.selectedDays[day];

        // Step 2: (was false, stays false) No operation
        if(!prevSelected && !currSelected) continue;

        // Step 2: (was false, now true) Create
        else if (!prevSelected && currSelected) {
          const eventToSetCopy: Event= { ...eventToSet, id: uuidv4(), date: stringifiedDate};
          this.addEvent(eventToSetCopy)
        }

          // Step 3: If (was true, stays true) Update
        else if (prevSelected && currSelected) {
          const eventsByDate: Event[] = this.getEventsByDate(stringifiedDate);
          const foundEvent: Event | undefined = eventsByDate.find((eventByDate: Event) => eventByDate.groupId === existingEvent.groupId);
          if(foundEvent){
            const eventToSetCopy: Event= { ...eventToSet, id: foundEvent.id, date: foundEvent.date}
            this.updateEvent(foundEvent,eventToSetCopy);
          }
          else{
            const eventToSetCopy: Event= { ...eventToSet, id: uuidv4(), date: stringifiedDate};
            this.addEvent(eventToSetCopy)
          }
        }

          // Step 4: If (was true, now false) Deleted
        else if (prevSelected && !currSelected) {
          const eventsByDate: Event[] = this.getEventsByDate(stringifiedDate);
          const foundEvent: Event | undefined = eventsByDate.find((eventByDate: Event) => eventByDate.groupId === existingEvent.groupId);
          if(foundEvent) this.deleteEvent(foundEvent);
        }
      }
    } 
  }

    private deleteEventIdFromDate(dateKey: string, eventId: string): void {
      const eventsSet = this.eventIdsByDay.get(dateKey);
      if (eventsSet) {
        eventsSet.delete(eventId);
        if (eventsSet.size === 0) {
          this.eventIdsByDay.delete(dateKey);
        }
      }
    }

    private addEventIdToDate(dateKey: string, eventId: string): void {
      if (this.eventIdsByDay.has(dateKey)) this.eventIdsByDay.get(dateKey)!.add(eventId);
      else this.eventIdsByDay.set(dateKey, new Set([eventId]));
    }

    private deleteEventIdFromGroup(groupId: string, eventId: string): void {
      const eventsSet = this.eventIdsByGroupId.get(groupId);
      if (eventsSet) {
        eventsSet.delete(eventId);
        if (eventsSet.size === 0) {
          this.eventIdsByGroupId.delete(groupId);
        }
      }
    }

    private addEventIdToGroup(groupId: string, eventId: string): void {
      if (this.eventIdsByGroupId.has(groupId)) this.eventIdsByGroupId.get(groupId)!.add(eventId);
      else this.eventIdsByGroupId.set(groupId, new Set([eventId]));
    }
    
    private getEventsByGroupId(groupId: string): Event[] {
      const eventIds = this.eventIdsByGroupId.get(groupId);
      if (!eventIds) return []; 
      const events = Array.from(eventIds).map(eventId => this.eventsById.get(eventId)).filter(event => event !== undefined) as Event[];
      return events;
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
  startDate: string;
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
    this.startDate = this.date;
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
