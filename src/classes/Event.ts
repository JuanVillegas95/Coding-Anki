import { MyTime, pixels } from "@/classes/MyTime"
import { MyDate } from "@/classes/MyDate"
import { RecurringDetails } from "@/classes/RecurringDetails";
import { bell, cart, heart, star, mark, phone, information, coke, meh } from "@/utils/icons"
import { v4 as uuidv4 } from "uuid";

export type eventId = string;
export type recurringId = string | null;
export type EventAttributes = {
  eventId: eventId,
  recurringId: recurringId,
  date: MyDate,
  startTime: MyTime,
  endTime: MyTime,
  color: COLOR,
  icon: ICON,
  title: string | null,
  description: string | null
};

export class Event {
    private eventId: eventId;
    private recurringId: recurringId;
    private date: MyDate;
    private startTime: MyTime;
    private endTime: MyTime;
    private color: COLOR;
    private icon: ICON;
    private title: string | null;
    private description: string | null;

    public static readonly THRESHOLD_MINUTES = 60;
    public static readonly VALID_MINUTES = 20;

    constructor(
      date: MyDate,
      startTime: MyTime = new MyTime(),
      eventId: string = uuidv4(),
      recurringId: recurringId = null,
      endTime: MyTime = new MyTime(),
      color: COLOR = COLOR.GRAY, 
      icon: ICON = ICON.BELL, 
      title: string | null = null,
      description: string | null = null
    ) {
      this.eventId = eventId;
      this.date = date;
      this.recurringId = recurringId;
      this.startTime = startTime;
      this.endTime = endTime;
      this.color = color;
      this.icon = icon;
      this.title = title;
      this.description = description;
    }
  
    // eventId

    public getSummary(): string {
      return `
      Event ${this.eventId} summrary:
      - Date: ${this.date.getStringifiedDate()}
      - startTime: ${this.startTime.getSummary()}
      - endTime: ${this.endTime.getSummary()}
      `;
    };

    public getEventId(): eventId { return this.eventId; };

    public setEventId(eventId: eventId): void { this.eventId = eventId; };

    public getDate(): MyDate { return this.date; };

    public setDate(date: Date ): void { this.date = new MyDate(date) };

    public getRecurringId(): recurringId { return this.recurringId; };
  
    public setRecurringId(recurringId: recurringId): void { this.recurringId = recurringId; };

    public getStartTime(): MyTime { return this.startTime; };
  
    public setStartTime(startTime: MyTime): void { this.startTime = startTime; };
  
    public getEndTime(): MyTime { return this.endTime; };
  
    public setEndTime(endTime: MyTime): void { this.endTime = endTime; };
  
    public getColor(): COLOR { return this.color; };
  
    public setColor(color: COLOR): void { this.color = color; };

    public getIcon(): ICON { return this.icon; };
  
    public setIcon(icon: ICON): void { this.icon = icon; };
  
    public getTitle(): string | null { return this.title; };
  
    public setTitle(title: string | null): void { this.title = title; };
  
    public getDescription(): string | null { return this.description; };
  
    public setDescription(description: string | null): void { this.description = description; };

    public getDurationMinutes(): number { return this.endTime.getTimeInMinutes() - this.startTime.getTimeInMinutes(); };

    public getHeight(): pixels { return this.endTime.getTimeInPixels() - this.startTime.getTimeInPixels(); };

    public getAttributes(): EventAttributes {
      return {
          eventId: this.eventId,
          recurringId: this.recurringId,
          date: this.date,
          startTime: this.startTime,
          endTime: this.endTime,
          color: this.color,
          icon: this.icon,
          title: this.title,
          description: this.description
      };
    }

    public clone(): Event {
      return new Event(
        this.date.clone(), 
        this.startTime.clone(), 
        this.eventId,  
        this.recurringId,
        this.endTime.clone(),
        this.color,
        this.icon,
        this.title,
        this.description
      );
    };

    
    public static isOverlapping = (events: Event[], time: MyTime) => {
      const newTimeTotalMinutes: number = time.getTimeInMinutes();
      for(const { startTime, endTime } of events){
        const startTotalMinutes = startTime.getTimeInMinutes();
        const endTotdalMinutes = endTime.getTimeInMinutes();
        if((newTimeTotalMinutes >= startTotalMinutes) && (newTimeTotalMinutes < endTotdalMinutes)) return true;
      }
      return false;
    }
    
}
  
  export enum COLOR {
    PURPLE = "purple",
    BLUE = "blue",
    PINK = "pink",
    ORANGE = "orange",
    GRAY = "gray",
    BROWN = "brown",
    TEAL = "teal",
    RED = "red",
    YELLOW = "yellow",
  }
  
  
  
  export const COLORS: Record<COLOR, {
    primary: string;
    secondary: string;
    tertiary: string;
  }> = {
    purple: {
      primary: '#571BFB',
      secondary: 'rgba(87, 27, 251, 0.1)',
      tertiary: '#B198FF',
    },
    blue: {
      primary: '#01A2EA',
      secondary: 'rgba(1, 162, 234, 0.1)',
      tertiary: '#DAF5FC',
    },
    pink: {
      primary: '#FE3CBB',
      secondary: 'rgba(254, 60, 187, 0.1)',
      tertiary: '#FCD8EF',
    },
    orange: {
      primary: '#FF7E00',
      secondary: 'rgba(255, 126, 0, 0.1)',
      tertiary: '#FFE9DC',
    },
    gray: {
      primary: '#808080',
      secondary: 'rgba(128, 128, 128, 0.1)',
      tertiary: '#D3D3D3',
    },
    brown: {
      primary: '#8B4513',
      secondary: 'rgba(139, 69, 19, 0.1)',
      tertiary: '#DEB887',
    },
    teal: {
      primary: '#008080',
      secondary: 'rgba(0, 128, 128, 0.1)',
      tertiary: '#66C2C2',
    },
    red: {
      primary: '#FF0000',
      secondary: 'rgba(255, 0, 0, 0.1)',
      tertiary: '#FFB3B3',
    },
    yellow: {
      primary: '#FFD700',
      secondary: 'rgba(255, 215, 0, 0.1)',
      tertiary: '#FFFACD',
    },
  };
  
  export enum ICON {
    BELL = "bell",
    CART = "cart",
    HEART = "heart",
    STAR = "star",
    MARK = "mark",
    PHONE = "phone",
    INFORMATION = "information",
    COKE = "coke",
    MEH = "meh",
  }
  
  
  // Icons
  export const ICONS: Record<ICON, React.ComponentType> = {
    bell,
    cart,
    heart,
    star,
    mark,
    phone,
    information,
    coke,
    meh,
  };


// export const calculateTimeOnDrag = (
//   e: React.MouseEvent<HTMLDivElement, MouseEvent>,
//   columnDivRef: React.RefObject<HTMLDivElement>,
//   event: Event
// ): [Time, Time] => {
//   // Destructuring to extract start and end times
//   let { hours: startHour, minutes: startMinutes } = event.start;
//   let { hours: endHour, minutes: endMinutes } = event.end;

//   // Calculate the distance from the top of the column to the mouse position
//   const columnTop = columnDivRef.current!.getBoundingClientRect().top;
//   const distanceFromTop = e.clientY - columnTop - event.height / 2;

//   // Convert distance to hours and minutes
//   const startHoursTotal = pixelsToHours(distanceFromTop);
//   const startMinutesTotal = Math.floor(hoursToMinutes(startHoursTotal));

//   const heightHoursTotal = pixelsToHours(event.height);
//   const heightMinutesTotal = Math.floor(hoursToMinutes(heightHoursTotal));

//   // Calculate total minutes for the end time
//   const endMinutesTotal = heightMinutesTotal + startMinutesTotal;

//   // Ensure the calculated times are within a valid range (0-23 hours)
//   const newStartHour = Math.floor(minutesToHours(startMinutesTotal));
//   const newEndHour = Math.floor(minutesToHours(endMinutesTotal));

//   if (newEndHour <= 23 && newStartHour >= 0) {
//     // Update end time values
//     endHour = newEndHour;
//     endMinutes = endMinutesTotal % 60;

//     // Update start time values
//     startHour = newStartHour;
//     startMinutes = startMinutesTotal % 60;
//   }

//   // Return the updated start and end times
//   return [new Time(startHour, startMinutes), new Time(endHour, endMinutes)];
// };





// // Calculates the  end time of an event based the height and start time
// export const calculateEventEnd = ({ start, height }: Event): Time => {
//   const totalMinutesStart: number = timeToMinutes(start);
//   const totalMinutesHeight: number = Math.floor(hoursToMinutes(pixelsToHours(height)));
//   const totalMinutes: number = totalMinutesStart + totalMinutesHeight;

//   const hourEnd: number = Math.floor(minutesToHours(totalMinutes));
//   const minutesEnd: number  = totalMinutes % 60;
  
//   return new Time(hourEnd,minutesEnd);
// }

// export const SHORT_DURATION_THRESHOLD = 60; // Less than 60 minutes is a "SHORT" event.
// export const MAX_DURATION_MINUTES = 20;
// export const DRAG_THRESHOLD = 200;

// export const isEndBeforeStart = ({ start, end }: Event): boolean => { 
//   const startTotalMinutes: number = timeToMinutes(start);
//   const endTotalMinutes: number = timeToMinutes(end);

//   return endTotalMinutes < startTotalMinutes;
// };

// export const isEventColliding = (newEvent: Event, events: Event[]): boolean => {
//   const newEventStartMinutes = timeToMinutes(newEvent.start);
//   const newEventEndMinutes = timeToMinutes(newEvent.end);

//   for (const { start, end, id } of events) {
//     if (newEvent.id === id) continue;
//     const eventStartMinutes = timeToMinutes(start);
//     const eventEndMinutes = timeToMinutes(end);

//     if (newEventStartMinutes < eventEndMinutes && newEventEndMinutes > eventStartMinutes) return true; 
//   }

//   return false; 
// };



// export const isNewEventValid = (newEvent: Event, events: Event[]): boolean => {

//   const totalMinutes: number = timeToMinutes(newEvent.duration);

//   if(totalMinutes < C.MAX_DURATION_MINUTES) return false

//   const isTimeValid: boolean = (newEvent.start.hours < 0 || newEvent.end.hours > 23) ? false : true;
//   if(!isTimeValid) return false;

//   const isEndValid: boolean = isEndBeforeStart(newEvent);
//   if(isEndValid) return false

//   const eventColliding: boolean= isEventColliding(newEvent,events);
//   if(eventColliding) return false

//   return true;
// }



// export const calculateStartAndEndTime = (topOffset: number, height: number): { start: Time, end: Time } => {
//   // Convert the topOffset to hours using the pixelsToHours utility function
//   const startHours = pixelsToHours(topOffset);
  
//   // Convert the fractional hours to full hours and minutes
//   const startFullHours = Math.floor(startHours);
//   const startMinutes = Math.round((startHours - startFullHours) * 60);
  
//   // Create the start time object
//   const start: Time = new Time(startFullHours, startMinutes);
//   // Calculate the total pixel value for the end time (topOffset + height)
//   const endPixels = topOffset + height;
  
//   // Convert the total pixels to hours using the pixelsToHours utility function
//   const endHours = pixelsToHours(endPixels);
  
//   // Convert the fractional hours to full hours and minutes
//   const endFullHours = Math.floor(endHours);
//   const endMinutes = Math.round((endHours - endFullHours) * 60);
  
//   // Create the end time object
//   const end: Time = new Time(endFullHours, endMinutes);

//   return { start, end };
// };
