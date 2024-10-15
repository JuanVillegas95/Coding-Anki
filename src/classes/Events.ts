import { eventId, recurringId, Event } from "@/classes/Event";
import { stringifiedDate } from "@/classes/MyDate";
import { RecurringDetails } from "@/classes/RecurringDetails";


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

  //! If is the first time adding a groupEvent you shall give the recurringDetails with the info loaded
  public addEvent(newEvent: Event, recurringDetails: RecurringDetails | null): void {
    const eventId: eventId = newEvent.getEventId();
    const stringifiedDate: stringifiedDate = newEvent.getDate().getStringifiedDate();
    const recurringId: recurringId = newEvent.getRecurringId();

    // Adding in recurringDetailsMap
    if(recurringId && recurringDetails) this.recurringDetailsMap.set(recurringId, recurringDetails);

    // Adding in eventsMap
    if (!(this.eventsMap.has(newEvent.getEventId()))) this.eventsMap.set(newEvent.getEventId(), newEvent);

    // Adding in eventIdsMap
    if (!(this.eventIdsMap.has(stringifiedDate))) this.eventIdsMap.set(stringifiedDate, new Set([eventId]));
    else this.eventIdsMap.get(stringifiedDate)!.add(eventId);
    
    console.log("The following event was added", newEvent.getSummary());
  };

  public deleteEvent(eventToDelete: Event): void {
    const eventId: eventId = eventToDelete.getEventId();
    const stringifiedDate: stringifiedDate = eventToDelete.getDate().getStringifiedDate();
    const recurringId: recurringId = eventToDelete.getRecurringId();

    // Deleting in recurringDetailsMap
    if(recurringId) {
      const recurringDetailsCopy: RecurringDetails = this.recurringDetailsMap.get(recurringId)!
      recurringDetailsCopy.deleteEventId(eventId);
      if(recurringDetailsCopy.isEventIdsEmpty()) this.recurringDetailsMap.delete(recurringId)
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
    const exisitngEvent: Event | undefined = this.eventsMap.get(eventId);
    if(!exisitngEvent) return;
    this.eventsMap.set(eventId, updatedEvent);
    console.log("The following event was updated", updatedEvent.getSummary());

  };





};

export enum STATUS {
  OK = "ok", // No warning should be shown.
  EVENT_CONFLICT = "Event Conflict", 
  EVENT_MODIFY = "Recurring Event Modify", 
  EVENT_DELETE = "Recurring Event Delete", 
}

// export const getConflictingEvents = (newEvent: Event, events: Event[]): Event[] => {
//   const conflictingEvents: Event[] = [];
//   const newEventStartMinutes = timeToMinutes(newEvent.start);
//   const newEventEndMinutes = timeToMinutes(newEvent.end);

//   for (const event of events) {
//     if (newEvent.id === event.id) continue;
//     const eventStartMinutes = timeToMinutes(event.start);
//     const eventEndMinutes = timeToMinutes(event.end);

//     if (newEventStartMinutes < eventEndMinutes && newEventEndMinutes > eventStartMinutes)conflictingEvents.push(event);
//   }

//   return conflictingEvents; 
// };
