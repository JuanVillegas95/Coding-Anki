import { v4 as uuidv4 } from 'uuid';
import { TOAST_TYPE, STATUS} from "@/utils/constants"
import { strigifyDate, addDateBy, parseDateStringToUTC, getDay, getConflictingEvents } from "@/utils/functions";
import { ServerCalendar, ServerEvent } from "@/utils/types";
export class User {
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
  //! Still need to load other data (id, ouathId, friendsIds).
  public mapData(data: ServerCalendar[]){
    data.forEach(( fetchedCalendar: ServerCalendar ) => {
      const { id, events, timezone, name } = fetchedCalendar;

      new Calendar(id,name,timezone,)
    });
  }
}


export class Calendar {
  private id: string;
  private name: string;
  private timeZone: string;
  private eventsById: Map<string, Event>;  // Stores all event objects by their unique ID
  private eventIdsByDay: Map<string, Set<string>>;  // Maps specific dates as strings to Set<string> of event IDs for events on those days
  private eventIdsByGroupId: Map<string, Set<string>>; // Maps specific groupId as strings to Set<string> of event IDs for those events Ids
  private eventsToUpdate: [Event, Event][]; // Array of tuples [existingEvent, eventToSet]
  private eventsToAdd: Event[];
  private eventsToDelete: Event[];
  private conflictingEvents: Event[];
  private eventToSet: Event

  constructor(
    id: string = uuidv4(),
    name: string = "Set Calendar Name",
    timeZone: string = "",
    eventsById: Map<string, Event> = new Map(),
    eventIdsByDay: Map<string, Set<string>> = new Map(),
    eventIdsByGroupId: Map<string, Set<string>> = new Map(),
  ) {
    this.auditStatus = this.auditStatus.bind(this);
      this.id = id;
      this.name = name;
      this.timeZone = timeZone;
      this.eventsById = eventsById;
      this.eventIdsByDay = eventIdsByDay;
      this.eventIdsByGroupId = eventIdsByGroupId;
      this.eventsToAdd = [];
      this.eventsToDelete = [];
      this.eventsToUpdate = [];
      this.conflictingEvents = [];
      this.eventToSet = new Event();
  }

  public setId(id: string): void {
    this.id = id;
  }

  public getId(): string {
    return this.id;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getName(): string {
    return this.id;
  }


  public getTimeZone(): string{
    return this.timeZone;
  }


  public setTimeZone(newTimeZone: string){
    this.timeZone = newTimeZone;
  }

  public debugEvents() {
    console.log('Events to Add:', this.eventsToAdd);
    console.log('Events to Delete:', this.eventsToDelete);
    console.log('Events to Update:', this.eventsToUpdate);
    console.log('Conflicting Events:', this.conflictingEvents);
    console.log('Event to Set:', this.eventToSet);
  }

  
  public getConflictDetails(): [Event, Event[]] {
    return [this.eventToSet, this.conflictingEvents];
  }

  public clearEventStates(): void {
    this.eventsToAdd = [];
    this.eventsToDelete = [];
    this.eventsToUpdate = [];
    this.conflictingEvents = [];
    this.eventToSet = new Event();
  }


  public debugMaps(): void {
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
    if (existingEvent.date !== updatedEvent.date) {
      this.deleteEventIdFromDate(existingEvent.date, updatedEvent.id);
      this.addEventIdToDate(updatedEvent.date, updatedEvent.id);
    }
    this.eventsById.set(existingEvent.id, updatedEvent);
    console.log("The following event was updated", this.getEventSummary(updatedEvent));
  }

  public deleteEventSubmit(eventToDelete: Event): void {
    if(!eventToDelete.groupId) this.deleteEvent(eventToDelete);
    else this.getEventsByGroupId(eventToDelete.groupId).forEach((event: Event) => this.deleteEvent(event));
  
  }

  public auditStatus(eventToSet: Event): STATUS { 
    this.eventToSet = eventToSet;
    const existingEvent: Event | undefined = this.eventsById.get(eventToSet.id);
    
    if (!existingEvent){ this.eventsToAdd.push(eventToSet); return STATUS.OK; }
    
    // Branch 1: If (was standalone, stays standalone) Update standalone.
    if(!existingEvent.groupId && !eventToSet.groupId) this.eventsToUpdate.push([existingEvent,eventToSet]);

    // Branch 2: If (was standalone, now groupId) Update standalone, Create new reucurring instances.
    else if(!existingEvent.groupId && eventToSet.groupId){
      console.log("Branch 3, was standalone, now groupId");
      // Step 1: Update the standalone
      const eventToSetCopy: Event = { ...eventToSet, id: existingEvent.id, date: existingEvent.date };
      this.addEventIdToGroup(eventToSetCopy.groupId!,eventToSetCopy.id);
      this.eventsToUpdate.push([existingEvent,eventToSetCopy])

      // Step 2: Create new instances (exculding the updated one)
      const startDate: Date = parseDateStringToUTC(eventToSet.startDate);
      const endDate: Date = parseDateStringToUTC(eventToSet.endDate);
  
      for (let date = addDateBy(startDate, 1); date <= endDate!; date = addDateBy(date, 1)) {
        const stringifiedDate: string = strigifyDate(date);
        const day: number = getDay(stringifiedDate);
        if (!eventToSet.selectedDays[day]) continue;
        
        const newEventToSetCopy: Event = { ...eventToSetCopy, id: uuidv4(), date: stringifiedDate };
        this.eventsToAdd.push(newEventToSetCopy);
      }
    }

    // Branch 3: If (was groupId, now standalone) Update the standalone, Delete the recurring instances.
    else if (existingEvent.groupId && !eventToSet.groupId) {
      console.log("Branch 3: Transition from group to standalone");
    
      // Step 1: Delete all recurring events from the group
      const eventsByGroupId: Event[] = this.getEventsByGroupId(existingEvent.groupId);
      eventsByGroupId.forEach((event: Event) => this.eventsToDelete.push(event));

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
      this.eventsToUpdate.push([existingEvent,eventToSetCopy])
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
          if (foundEvent)  this.eventsToDelete.push(foundEvent);
        }
      }
        
      if (existingEventStartDate < eventToSetStartDate) {
        for (let date = existingEventStartDate; date < eventToSetStartDate; date = addDateBy(date, 1)) {
          const stringifiedDate = strigifyDate(date);
          const eventsByDate: Event[] = this.getEventsByDate(stringifiedDate);
          const foundEvent: Event | undefined = eventsByDate.find((eventByDate: Event) => eventByDate.groupId === existingEvent.groupId);
          if (foundEvent) this.eventsToDelete.push(foundEvent);
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
          this.eventsToAdd.push(eventToSetCopy)
        }

          // Step 3: If (was true, stays true) Update
        else if (prevSelected && currSelected) {
          const eventsByDate: Event[] = this.getEventsByDate(stringifiedDate);
          const foundEvent: Event | undefined = eventsByDate.find((eventByDate: Event) => eventByDate.groupId === existingEvent.groupId);
          if(foundEvent){
            const eventToSetCopy: Event= { ...eventToSet, id: foundEvent.id, date: foundEvent.date}
            this.eventsToUpdate.push([foundEvent,eventToSetCopy])
          }
          else{
            const eventToSetCopy: Event= { ...eventToSet, id: uuidv4(), date: stringifiedDate};
            this.eventsToAdd.push(eventToSetCopy)
          }
        }

          // Step 4: If (was true, now false) Deleted
        else if (prevSelected && !currSelected) {
          const eventsByDate: Event[] = this.getEventsByDate(stringifiedDate);
          const foundEvent: Event | undefined = eventsByDate.find((eventByDate: Event) => eventByDate.groupId === existingEvent.groupId);
          if(foundEvent) this.eventsToDelete.push(foundEvent);
        }
      }
    } 

    this.eventsToAdd.forEach((eventToAdd: Event) => {
      const filteredEvents = this.getEventsByDate(eventToAdd.date);
      const conflictingEvents = getConflictingEvents(eventToAdd, filteredEvents);
      this.conflictingEvents.push(...conflictingEvents);
    });
    
    this.eventsToUpdate.forEach(([,eventToupdate] : [Event, Event]) => {
      const filteredEvents = this.getEventsByDate(eventToupdate.date);
      const conflictingEvents = getConflictingEvents(eventToupdate, filteredEvents);
      this.conflictingEvents.push(...conflictingEvents);
    });

    if(this.conflictingEvents.length > 0) {
      return STATUS.EVENT_CONFLICT
    }
    else {
      return STATUS.OK;
    }
  }

  public commitEventRevisions(): void{
    if(this.conflictingEvents.length > 0 ) this.conflictingEvents.forEach((eventToDelete: Event) => this.deleteEvent(eventToDelete));
    this.eventsToAdd.forEach((eventToAdd: Event) => this.addEvent(eventToAdd));
    this.eventsToUpdate.forEach(([existingEvent, eventToUpdate] : [Event, Event]) => this.updateEvent(existingEvent, eventToUpdate));
    this.eventsToDelete.forEach((eventToDelete: Event) => this.deleteEvent(eventToDelete));
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




export class Event {
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
    date: string = "",
    start: Time = new Time(),
    groupId: string | null = null,
    isFriendEvent: boolean = false,
    height: number = -1,
    id: string = uuidv4(),
    title: string = "",
    description: string = "",
    color: string = "purple",
    end: Time = new Time(-1, -1),
    duration: Time = new Time(-1, -1),
    storedGroupId: string | null = null,
    icon: string = "star",
    selectedDays: boolean[] = new Array(7).fill(false),
    endDate: string = ""
  ) {
    this.id = id;
    this.date = date; 
    this.startDate = date;
    this.start = start;
    this.end = end;
    this.title = title;
    this.description = description;
    this.color = color;
    this.height = height;
    this.duration = duration;
    this.storedGroupId = storedGroupId;
    this.icon = icon;
    this.groupId = groupId;
    this.selectedDays = selectedDays;
    this.endDate = endDate;
    this.isFriendEvent = isFriendEvent;
  }
}

export class Time {
  hours: number;
  minutes: number;

  constructor(hours: number = 0, minutes: number = 0) {
    this.hours = hours;
    this.minutes = minutes;
  }
}

export class Toast {
  id: string
  description: string;
  type: TOAST_TYPE; 

  constructor(id: string, description: string, type: TOAST_TYPE) { 
    this.id = id;
    this.description = description;
    this.type = type;
  }
}




