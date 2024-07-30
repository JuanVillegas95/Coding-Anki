import { v4 as uuidv4 } from 'uuid';
import * as I  from "@/utils/CalendarHub/icons"
import { StaticImageData } from 'next/image';


class Calendar {
  id: string;
  name: string;
  events: Map<string, Event>;
  recurringEventIDs: Map<string, string[][]>; // The key is the eventGroupID the value is a string of 7 positions rerpsenting the day fo the week and in every position the events are stored
  constructor(
    id: string = uuidv4(), 
    name: string = "Something is wrong", 
    events: Map<string, Event> = new Map(),
    recurringEventIDs: Map<string, string[][]> = new Map()
  ){
    this.id = id;
    this.name = name;
    this.events = events;
    this.recurringEventIDs = recurringEventIDs;
  }
}

class Event {
  id: string;
  title: string;
  color: string;
  description: string;
  startDate: Date;
  start: Time;
  end: Time;
  height: number;
  duration: Time;
  icon: React.ComponentType;
  recurringEventID: string;
  selectedDays: boolean[];
  endDate: Date;
  colorImage: StaticImageData;

  constructor(startDate: Date = new Date(), start: Time = new Time(), recurringEventID: string = "") {
    this.id = uuidv4();
    this.startDate = startDate;
    this.start = start;
    this.end = new Time(-1, -1);
    this.title = "";
    this.description = "";
    this.color = "gray";
    this.colorImage = I.gray;
    this.height = -1;
    this.duration = new Time(-1, -1);
    this.icon = I.star;
    this.recurringEventID = recurringEventID;
    this.selectedDays = Array(7).fill(false);
    this.endDate = new Date();
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

export { Event, Time, Calendar };
