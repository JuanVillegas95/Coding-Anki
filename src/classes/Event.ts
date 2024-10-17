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
    public static readonly DRAG_THRESHOLD_MS= 200;

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

    public isDurationValid(): boolean { return this.getDurationMinutes() > Event.VALID_MINUTES; };

    public isValid(events: Event[]): boolean {  
      if (!this.isDurationValid() || this.isColliding(events)) return false;
      return true;
    }

    public getTimeOnDrag(distanceFromTop: pixels): {startTime: MyTime, endTime: MyTime} {
      const padding: pixels = this.getHeight() / 2;
      const startTime: MyTime = new MyTime(distanceFromTop - padding);
      const endTime: MyTime = new MyTime (startTime.getTimeInPixels() + this.getHeight());
      return { startTime, endTime };
    };

    public adjustDate(enterDatWeek: number): void {
      const currentEventDayWeek: number = this.getDate().getDay();
      const dayDifference: number = enterDatWeek - currentEventDayWeek;
      if (dayDifference !== 0) {
          const newDate: MyDate = new MyDate(this.getDate().getMyDate());
          newDate.addBy(dayDifference);
          this.setDate(newDate.getMyDate());
      }
  }
  
  

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

    public isColliding (events: Event[]): boolean{
      const newStartTotalMinutes: number = this.startTime.getTimeInMinutes();
      const newEndTotalMinutes: number = this.endTime.getTimeInMinutes();
      for(const { startTime, endTime, eventId} of events){
        if(eventId === this.eventId) continue;
        const startTotalMinutes = startTime.getTimeInMinutes();
        const endTodalMinutes = endTime.getTimeInMinutes();
        if (newStartTotalMinutes < endTodalMinutes && newEndTotalMinutes > startTotalMinutes) return true; 
      }
      return false;
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






