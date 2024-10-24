import { eventId, Event } from "@/classes/Event";
import { stringifiedDate } from "@/classes/MyDate";
import { RecurringDetails, recurringId } from "@/classes/RecurringDetails";


export class Events {
  private eventsMap: Map<eventId, Event>;
  private eventIdsMap: Map<stringifiedDate, Set<eventId>>;
  private recurringDetailsMap: Map<recurringId, RecurringDetails>;
  private eventsToUpdate: Event[]; 
  private eventsToAdd: Event[];
  private eventsToDelete: Event[];
  private collidingEvents: Event[];
  // private eventToSet: Event

  constructor(
    eventsMap: Map<eventId, Event> = new Map(),
    eventIdsMap: Map<stringifiedDate, Set<eventId>> = new Map(),
    recurringDetailsMap: Map<recurringId, RecurringDetails> = new Map()
  ) {
    this.eventsMap = eventsMap;
    this.eventIdsMap = eventIdsMap;
    this.recurringDetailsMap = recurringDetailsMap;
    this.eventsToAdd = [];
    this.eventsToDelete = [];
    this.eventsToUpdate = [];
    this.collidingEvents = [];
  };

  private eventsMapSet(eventId: eventId, eventToSet: Event): void {
    this.eventsMap.set(eventId, eventToSet);
  }

  private eventIdsMapSet(stringifiedDate: stringifiedDate, eventId: eventId): void {
    if (!(this.eventIdsMap.has(stringifiedDate))) this.eventIdsMap.set(stringifiedDate, new Set([eventId]));
    else this.eventIdsMap.get(stringifiedDate)!.add(eventId);
  }

  private recurringDetailsMapSet(recurringId: recurringId, recurringDetails: RecurringDetails | null): void {
    if(recurringId && recurringDetails) this.recurringDetailsMap.set(recurringId, recurringDetails);
  }

  private recurringDetailsMapDelete(recurringId: recurringId): void {
    const recurringDetailsCopy: RecurringDetails = this.recurringDetailsMap.get(recurringId)!
    recurringDetailsCopy.deleteEventId(eventId);
    if(recurringDetailsCopy.isEventIdsEmpty()) this.recurringDetailsMap.delete(recurringId)
  }

  private eventsMapDelete(eventId: eventId): void {
  }

  public getRecurringDetails(recurringId: recurringId): RecurringDetails | null {
    if(!this.recurringDetailsMap.has(recurringId)) return null;
    return this.recurringDetailsMap.get(recurringId)!;
  }

  public getEventsByDate(date: stringifiedDate): Event[] {
    const events: Event[] = [];
    const eventIdsCopy: Set<eventId> | undefined = this.eventIdsMap.get(date);
    if(!eventIdsCopy) return events;
    eventIdsCopy.forEach((eventId: eventId) => {
      const eventCopy: Event = this.eventsMap.get(eventId)!;
      events.push(eventCopy);
    })
    return events;
  }

  public hasEvent(eventId: eventId): boolean { return this.eventsMap.has(eventId); };


  public addEvent(newEvent: Event, recurringDetails: RecurringDetails | null): void {
    const eventId: eventId = newEvent.getEventId();
    const stringifiedDate: stringifiedDate = newEvent.getMyDate().getStringifiedDate();
    const recurringId: recurringId = newEvent.getRecurringId();

    this.recurringDetailsMapSet(recurringId, recurringDetails);
    this.eventsMapSet(eventId, newEvent);
    this.eventIdsMapSet(stringifiedDate, eventId);
    
    console.log("The following event was added", newEvent.getSummary());
  };

  public deleteEvent(eventToDelete: Event): void {
    const eventId: eventId = eventToDelete.getEventId();
    const stringifiedDate: stringifiedDate = eventToDelete.getMyDate().getStringifiedDate();
    const recurringId: recurringId = eventToDelete.getRecurringId();

    if(recurringId) {

    }

    // Deleting in eventIdsMap
    if(this.eventIdsMap.has(stringifiedDate)){
      const eventIdsCopy: Set<eventId> = this.eventIdsMap.get(stringifiedDate)!
      eventIdsCopy.delete(eventId)
      if(eventIdsCopy.size === 0) this.eventIdsMap.delete(stringifiedDate);
    }

    // Deleting in eventsMap
    this.eventsMap.delete(eventId);

    console.log("The following event was deleted", eventToDelete.getSummary());
  };

  public updateEvent(updatedEvent: Event, recurringDetails: RecurringDetails | null): void {
    const eventId: eventId = updatedEvent.getEventId();
    const exisitngEvent: Event | undefined = this.eventsMap.get(eventId)?.clone();

    if(!exisitngEvent) return;

    if(!recurringDetails){
      const oldDay: string =  exisitngEvent.getMyDate().getStringifiedDate();
      const newDay: string =  updatedEvent.getMyDate().getStringifiedDate();

      if(oldDay !== newDay){

        const eventIdsCopy: Set<eventId> = this.eventIdsMap.get(oldDay)!
        eventIdsCopy.delete(eventId)
        if(eventIdsCopy.size === 0) this.eventIdsMap.delete(oldDay);

        if (!(this.eventIdsMap.has(newDay))) this.eventIdsMap.set(newDay, new Set([eventId]));
        else this.eventIdsMap.get(newDay)!.add(eventId);
      }
      this.eventsMap.set(eventId, updatedEvent);
      console.log("The following event was updated", updatedEvent.getSummary());
      return;
    }
  };


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
};



export enum STATUS {
  OK = "ok", // No warning should be shown.
  EVENT_CONFLICT = "Event Conflict", 
  EVENT_MODIFY = "Recurring Event Modify", 
  EVENT_DELETE = "Recurring Event Delete", 
}

