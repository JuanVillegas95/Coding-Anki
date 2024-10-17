import { v4 as uuidv4 } from "uuid";
import { Events } from "@/classes/Events"
import { Event, eventId } from "@/classes/Event";
import { RecurringDetails, recurringId } from "@/classes/RecurringDetails";
import { disk, replace, confetti, trash, users, download, upload, print, interrogation } from "@/utils/icons";
import { stringifiedDate } from "@/classes/MyDate";

export type calendarId = string;

export class Calendar {
  private calendarId: calendarId;
  private events: Events;
  private name: string | null;
  private timeZone: string | null;

  constructor(
    calendarId: calendarId = uuidv4(), 
    name: string | null = null, 
    timeZone: string | null = null,
    events: Events = new Events()
  ) {
    this.calendarId = calendarId;
    this.name = name;
    this.timeZone = timeZone;
    this.events = events;
  };

  public getCalendarId(): calendarId { return this.calendarId; };

  public setCalendarId(calendarId: calendarId): void { this.calendarId = calendarId; };

  public getName(): string | null { return this.name; };

  public setName(name: string): void { this.name = name; };

  public getTimeZone(): string | null { return this.timeZone;};

  public setTimeZone(newTimeZone: string | null): void { this.timeZone = newTimeZone;}

  public setEvent(eventToSet: Event, recurringDetails: RecurringDetails | null){
    const eventId: eventId = eventToSet.getEventId();
    if(!this.events.hasEvent(eventId)) this.events.addEvent(eventToSet,recurringDetails);
    else this.events.updateEvent(eventToSet, recurringDetails);
  };

  public deleteEvent(eventToDelete: Event) { this.events.deleteEvent(eventToDelete); };

  public getEventsByDate(date: stringifiedDate): Event[] { return this.events.getEventsByDate(date); };
  
  public getRecurringDetails(recurringId: recurringId): RecurringDetails | null { return this.events.getRecurringDetails(recurringId)}

  // public clearEventStates(): void {
  //   this.eventsToAdd = [];
  //   this.eventsToDelete = [];
  //   this.eventsToUpdate = [];
  //   this.conflictingEvents = [];
  //   this.eventToSet = new Event();
  // }

  // public auditStatus(eventToSet: Event): STATUS { 
  //   this.eventToSet = eventToSet;
  //   const existingEvent: Event | undefined = this.eventsById.get(eventToSet.id);
    
  //   if (!existingEvent){ this.eventsToAdd.push(eventToSet); return STATUS.OK; }
    
  //   // Branch 1: If (was standalone, stays standalone) Update standalone.
  //   if(!existingEvent.groupId && !eventToSet.groupId) this.eventsToUpdate.push([existingEvent,eventToSet]);

  //   // Branch 2: If (was standalone, now groupId) Update standalone, Create new reucurring instances.
  //   else if(!existingEvent.groupId && eventToSet.groupId){
  //     console.log("Branch 3, was standalone, now groupId");
  //     // Step 1: Update the standalone
  //     const eventToSetCopy: Event = { ...eventToSet, id: existingEvent.id, date: existingEvent.date };
  //     this.addEventIdToGroup(eventToSetCopy.groupId!,eventToSetCopy.id);
  //     this.eventsToUpdate.push([existingEvent,eventToSetCopy])

  //     // Step 2: Create new instances (exculding the updated one)
  //     const startDate: Date = parseDateStringToUTC(eventToSet.startDate);
  //     const endDate: Date = parseDateStringToUTC(eventToSet.endDate);
  
  //     for (let date = addDateBy(startDate, 1); date <= endDate!; date = addDateBy(date, 1)) {
  //       const stringifiedDate: string = strigifyDate(date);
  //       const day: number = getDay(stringifiedDate);
  //       if (!eventToSet.selectedDays[day]) continue;
        
  //       const newEventToSetCopy: Event = { ...eventToSetCopy, id: uuidv4(), date: stringifiedDate };
  //       this.eventsToAdd.push(newEventToSetCopy);
  //     }
  //   }

  //   // Branch 3: If (was groupId, now standalone) Update the standalone, Delete the recurring instances.
  //   else if (existingEvent.groupId && !eventToSet.groupId) {
  //     console.log("Branch 3: Transition from group to standalone");
    
  //     // Step 1: Delete all recurring events from the group
  //     const eventsByGroupId: Event[] = this.getEventsByGroupId(existingEvent.groupId);
  //     eventsByGroupId.forEach((event: Event) => this.eventsToDelete.push(event));

  //     // Step 2: Update the existing event to standalone
  //     const booleanArray: boolean[] = Array(7).fill(false);
  //     booleanArray[getDay(eventToSet.date)] = true;
  //     const eventToSetCopy: Event = { 
  //         ...eventToSet, 
  //         id: existingEvent.id,     // Retain the original event's id
  //         storedGroupId: null,
  //         groupId: null,       // Remove groupId to make it standalone
  //         selectedDays: booleanArray,  // Remove recurrence logic (if applicable)
  //         startDate: eventToSet.date, // Update start and end dates if needed
  //         endDate: ""
  //     };
  //     this.eventsToUpdate.push([existingEvent,eventToSetCopy])
  //   }
    
  //   // Branch 4: If (was groupdId, stays groupId)Update, Create or Delete according 'selectedDays' and 'dates' 
  //   else if (existingEvent.groupId && eventToSet.groupId) { 
  //     console.log("Branch 4,  Update, Create or Delete according selectedDays transitioning");
  //     const existingEventEndDate: Date = parseDateStringToUTC(existingEvent.endDate);
  //     const existingEventStartDate: Date = parseDateStringToUTC(existingEvent.startDate);
  //     const eventToSetStartDate: Date = parseDateStringToUTC(eventToSet.startDate);
  //     const eventToSetEndDate: Date = parseDateStringToUTC(eventToSet.endDate);

  //     if (existingEventEndDate > eventToSetEndDate) {
  //       for (let date = addDateBy(eventToSetEndDate, 1); date <= existingEventEndDate; date = addDateBy(date, 1)) {
  //         const stringifiedDate = strigifyDate(date);
  //         const eventsByDate: Event[] = this.getEventsByDate(stringifiedDate);
  //         const foundEvent: Event | undefined = eventsByDate.find((eventByDate: Event) => eventByDate.groupId === existingEvent.groupId);
  //         if (foundEvent)  this.eventsToDelete.push(foundEvent);
  //       }
  //     }
        
  //     if (existingEventStartDate < eventToSetStartDate) {
  //       for (let date = existingEventStartDate; date < eventToSetStartDate; date = addDateBy(date, 1)) {
  //         const stringifiedDate = strigifyDate(date);
  //         const eventsByDate: Event[] = this.getEventsByDate(stringifiedDate);
  //         const foundEvent: Event | undefined = eventsByDate.find((eventByDate: Event) => eventByDate.groupId === existingEvent.groupId);
  //         if (foundEvent) this.eventsToDelete.push(foundEvent);
  //       }
  //     }

  //     for (let date = eventToSetStartDate; date <= eventToSetEndDate; date = addDateBy(date, 1)) {
  //       const stringifiedDate: string = strigifyDate(date);
  //       const day: number = getDay(stringifiedDate);
  //       const prevSelected: boolean =  existingEvent.selectedDays[day];
  //       const currSelected: boolean = eventToSet.selectedDays[day];

  //       // Step 2: (was false, stays false) No operation
  //       if(!prevSelected && !currSelected) continue;

  //       // Step 2: (was false, now true) Create
  //       else if (!prevSelected && currSelected) {
  //         const eventToSetCopy: Event= { ...eventToSet, id: uuidv4(), date: stringifiedDate};
  //         this.eventsToAdd.push(eventToSetCopy)
  //       }

  //         // Step 3: If (was true, stays true) Update
  //       else if (prevSelected && currSelected) {
  //         const eventsByDate: Event[] = this.getEventsByDate(stringifiedDate);
  //         const foundEvent: Event | undefined = eventsByDate.find((eventByDate: Event) => eventByDate.groupId === existingEvent.groupId);
  //         if(foundEvent){
  //           const eventToSetCopy: Event= { ...eventToSet, id: foundEvent.id, date: foundEvent.date}
  //           this.eventsToUpdate.push([foundEvent,eventToSetCopy])
  //         }
  //         else{
  //           const eventToSetCopy: Event= { ...eventToSet, id: uuidv4(), date: stringifiedDate};
  //           this.eventsToAdd.push(eventToSetCopy)
  //         }
  //       }

  //         // Step 4: If (was true, now false) Deleted
  //       else if (prevSelected && !currSelected) {
  //         const eventsByDate: Event[] = this.getEventsByDate(stringifiedDate);
  //         const foundEvent: Event | undefined = eventsByDate.find((eventByDate: Event) => eventByDate.groupId === existingEvent.groupId);
  //         if(foundEvent) this.eventsToDelete.push(foundEvent);
  //       }
  //     }
  //   } 

  //   this.eventsToAdd.forEach((eventToAdd: Event) => {
  //     const filteredEvents = this.getEventsByDate(eventToAdd.date);
  //     const conflictingEvents = getConflictingEvents(eventToAdd, filteredEvents);
  //     this.conflictingEvents.push(...conflictingEvents);
  //   });
    
  //   this.eventsToUpdate.forEach(([,eventToupdate] : [Event, Event]) => {
  //     const filteredEvents = this.getEventsByDate(eventToupdate.date);
  //     const conflictingEvents = getConflictingEvents(eventToupdate, filteredEvents);
  //     this.conflictingEvents.push(...conflictingEvents);
  //   });

  //   if(this.conflictingEvents.length > 0) {
  //     return STATUS.EVENT_CONFLICT
  //   }
  //   else {
  //     return STATUS.OK;
  //   }
  // }

  // public commitEventRevisions(): void{
  //   if(this.conflictingEvents.length > 0 ) this.conflictingEvents.forEach((eventToDelete: Event) => this.deleteEvent(eventToDelete));
  //   this.eventsToAdd.forEach((eventToAdd: Event) => this.addEvent(eventToAdd));
  //   this.eventsToUpdate.forEach(([existingEvent, eventToUpdate] : [Event, Event]) => this.updateEvent(existingEvent, eventToUpdate));
  //   this.eventsToDelete.forEach((eventToDelete: Event) => this.deleteEvent(eventToDelete));
  // }



}



export const MENU: Record<string, React.ComponentType> = {
  Save: disk,
  Change: replace,
  New: confetti,
  Delete: trash,
  Friends: users,
  Import: download,
  Export: upload,
  Print: print,
  Help: interrogation,
};






