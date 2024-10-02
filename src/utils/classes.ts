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
    
    public deleteEvent(eventToDelete: Event): void{
      const existingEvent: Event | undefined = this.eventsById.get(eventToDelete.id);
      if(!existingEvent) console.log("error"); return;
      
    }

    public setEvent(eventToSet: Event): void {
      const existingEvent: Event | undefined = this.eventsById.get(eventToSet.id);

      if (!existingEvent){
        console.log("Creating event");
        // We don't have to worry about the edge case of not existing and having a groupId
        // Since in order to convert into a groupId event needs to exist
        // So we only worry about event not existing and not having a groupId

        // Add the event to the eventsById map
        this.eventsById.set(eventToSet.id, eventToSet);    
        // Add the event ID to the eventIdsByDay map for that date
        const dateKey: string = eventToSet.date;
        this.addEventIdToDate(dateKey, eventToSet.id);
        // Since no groupId nothing left to do
        return;
      }

      // 4 main branches: Since the event exists, according 'groupId' tansitioning.

      // Branch 1: If (was standalone, stays standalone) Update standalone.
      if(!existingEvent.groupId && !eventToSet.groupId){
        console.log("Branch 1, Update standalone");
        // Step 1: Create a Deep copy
        const updatedEvent: Event = { 
          ...eventToSet,
          start: { ...eventToSet.start },
          end: { ...eventToSet.end },
          selectedDays: [...eventToSet.selectedDays]
        };

        // Step 2: Remove event ID from the old date's Set and add the event ID to the new date's Set
        const oldDateKey: string = existingEvent.date;
        const newDateKey: string = updatedEvent.date;
  
        if (oldDateKey !== newDateKey) {
          this.removeEventIdFromDate(oldDateKey, updatedEvent.id);
          this.addEventIdToDate(newDateKey, updatedEvent.id);
        }
        this.eventsById.set(updatedEvent.id, updatedEvent);
      }

      // Branch 2: If (was groupId, now standalone) Delete the standalone, Update the recurring instances.
      else if(existingEvent.groupId && !eventToSet.groupId){
        console.log("Branch 2, Delete the standalone, Update the recurring instances");
        // Step 1: remove id from the groupId
        this.removeEventIdFromGroup(eventToSet.storedGroupId!, eventToSet.id);

        // Step 2: Update other recurring instances and remove 
        const eventsByGroupId: Event[] = this.getEventsByGroupId(eventToSet.storedGroupId!);
        eventsByGroupId.forEach((event: Event) =>{
          const groupIdEvent: Event = { ...event, selectedDays: [...event.selectedDays] };

          if(groupIdEvent.selectedDays[getDay(eventToSet.date)]) this.eventsById.delete(groupIdEvent.id);

          groupIdEvent.selectedDays[getDay(eventToSet.date)] = false;
          this.eventsById.set(groupIdEvent.id, groupIdEvent);

          this.removeEventIdFromDate(eventToSet.date, groupIdEvent.id);
        });
      }

      // Branch 3: If (was standalone, now groupId) Update standalone, Create new reucrring instances.
      else if(!existingEvent.groupId && eventToSet.groupId){
        console.log("Branch 3,  Create new reucrring instances");
        // Step 1: Update the standalone
        const updatedExitstingEvent: Event = { ...existingEvent, groupId: existingEvent.groupId };
        updatedExitstingEvent.groupId = eventToSet.groupId;
        updatedExitstingEvent.selectedDays = eventToSet.selectedDays;
        updatedExitstingEvent.endDate = eventToSet.endDate;
        this.eventsById.set(updatedExitstingEvent.id, updatedExitstingEvent);
        this.addEventIdToGroup(updatedExitstingEvent.groupId, updatedExitstingEvent.id);

        // Step 2: Create new instances (exculding the updated one)
        const startDate: Date = parseDateStringToUTC(eventToSet.startDate);
        const endDate: Date = parseDateStringToUTC(eventToSet.endDate);
  
        for (let date = addDateBy(startDate, 1); date <= endDate!; date = addDateBy(date, 1)) {
          const stringifiedDate: string = strigifyDate(date);
          const day: number = getDay(stringifiedDate);
          if(!eventToSet.selectedDays[day]) continue;
          const newEvent: Event = { ...eventToSet, id: eventToSet.id, date: eventToSet.date };
          newEvent.id = uuidv4();
          newEvent.date = stringifiedDate;
    
          this.eventsById.set(newEvent.id, newEvent);
          this.addEventIdToDate(newEvent.date, newEvent.id);
          this.addEventIdToGroup(newEvent.groupId!, newEvent.id);
        }
      }

      // Branch 4: If (was groupdId, stays groupId) 
      // Update, Create or Delete according 'selectedDays' and 'endDate' transitioning.
      else if (existingEvent.groupId && eventToSet.groupId) { 
        console.log("Branch 4,  Update, Create or Delete according selectedDays transitioning");
        const existingEventendDate: Date = parseDateStringToUTC(existingEvent.endDate);
        const startDate: Date = parseDateStringToUTC(eventToSet.startDate);
        const endDate: Date = parseDateStringToUTC(eventToSet.endDate);

        // Step 2: Delete (Since the range shrunk)
        if(endDate < existingEventendDate){
          for (let date = endDate; date <= existingEventendDate!; date = addDateBy(date, 1)) {
            const stringifiedDate: string = strigifyDate(date);
            const eventToRemove = this.findEventByGroupAndDate(existingEvent.groupId, stringifiedDate);
            if (eventToRemove) {
              this.removeEventIdFromDate(stringifiedDate, eventToRemove.id);
              this.removeEventIdFromGroup(eventToSet.groupId!, eventToRemove.id);
              this.eventsById.delete(eventToRemove.id);
            } 
          }
        }
        for (let date = startDate; date <= endDate; date = addDateBy(date, 1)) {
          const stringifiedDate: string = strigifyDate(date);
          const day: number = getDay(stringifiedDate);
          const prevSelected: boolean =  existingEvent.selectedDays[day];
          const currSelected: boolean = eventToSet.selectedDays[day];

          // If (was false, stays false) No operation
          if(!prevSelected && !currSelected) continue;

          // If (was true, stays true) Update or Create
          else if (prevSelected && currSelected) {
            // Step 1: Update
            const eventToModify = this.findEventByGroupAndDate(existingEvent.groupId, stringifiedDate);
            if (eventToModify) {
              console.log("Event on %s day was updated", stringifiedDate);

              const updatedEvent: Event = { ...eventToSet };
              updatedEvent.id = eventToModify.id;
              this.eventsById.set(eventToModify.id, updatedEvent);
            } 

            // Step 2: Create (Since the range grew)
            else {
              console.log("Event on %s day was created", stringifiedDate);
              const newEvent: Event = { ...eventToSet, id: eventToSet.id, date: eventToSet.date };
              newEvent.id = uuidv4();
              newEvent.date = stringifiedDate;
      
              this.eventsById.set(newEvent.id, newEvent);
              this.addEventIdToDate(newEvent.date, newEvent.id);
              this.addEventIdToGroup(newEvent.groupId!, newEvent.id);
            }
          }

          // If (was true, now false) Delete
          else if (prevSelected && !currSelected) {
            // Step 1: Delete
            console.log("Event on %s day was deleted", stringifiedDate);
            const eventToRemove = this.findEventByGroupAndDate(existingEvent.groupId, stringifiedDate);
            if (eventToRemove) {
              this.removeEventIdFromDate(stringifiedDate, eventToRemove.id);
              this.removeEventIdFromGroup(eventToSet.groupId!, eventToRemove.id);
              this.eventsById.delete(eventToRemove.id);
            } 
          }
          
          // If (was false, now true) Create
          else if (!prevSelected && currSelected) {
            console.log("Event on %s day was created", stringifiedDate);
            const newEvent: Event = { ...eventToSet, id: eventToSet.id, date: eventToSet.date };
            newEvent.id = uuidv4();
            newEvent.date = stringifiedDate;
    
            this.eventsById.set(newEvent.id, newEvent);
            this.addEventIdToDate(newEvent.date, newEvent.id);
            this.addEventIdToGroup(newEvent.groupId!, newEvent.id);
          }
        }
      } 
    }
    
    public consoleLogDate(event: Event): void {
      if(this.eventsById.get(event.id)){
        if(this.eventsById.get(event.id)?.date) console.log(this.eventsById.get(event.id)?.date)
      }
    }

    private removeEventIdFromDate(dateKey: string, eventId: string): void {
      const eventsSet = this.eventIdsByDay.get(dateKey);
      if (eventsSet) {
        eventsSet.delete(eventId);
        if (eventsSet.size === 0) {
          this.eventIdsByDay.delete(dateKey);
        }
      }
    }

    private addEventIdToDate(dateKey: string, eventId: string): void {
      if (this.eventIdsByDay.has(dateKey)) {
        this.eventIdsByDay.get(dateKey)!.add(eventId);
      } else {
        this.eventIdsByDay.set(dateKey, new Set([eventId]));
      }
    }

    private removeEventIdFromGroup(groupId: string, eventId: string): void {
      const eventsSet = this.eventIdsByGroupId.get(groupId);
      if (eventsSet) {
        eventsSet.delete(eventId);
        if (eventsSet.size === 0) {
          this.eventIdsByGroupId.delete(groupId);
        }
      }
    }

    private addEventIdToGroup(groupId: string, eventId: string): void {
      if (this.eventIdsByGroupId.has(groupId)) {
        this.eventIdsByGroupId.get(groupId)!.add(eventId);
      } else {
        this.eventIdsByGroupId.set(groupId, new Set([eventId]));
      }
    }
    
    private findEventByGroupAndDate(groupId: string, stringifiedDate: string): Event | undefined {
      const events: Event[] = this.getEventsByDate(stringifiedDate);
      return events.find((event: Event) => event.groupId === groupId);
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
