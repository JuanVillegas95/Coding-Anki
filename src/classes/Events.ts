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
    const stringifiedDate: stringifiedDate = eventToDelete.getMyDate().getStringifiedDate();
    const recurringId: recurringId = eventToDelete.getRecurringId();

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
};



export enum STATUS {
  OK = "ok", // No warning should be shown.
  EVENT_CONFLICT = "Event Conflict", 
  EVENT_MODIFY = "Recurring Event Modify", 
  EVENT_DELETE = "Recurring Event Delete", 
}

