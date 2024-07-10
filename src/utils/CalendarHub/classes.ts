import { v4 as uuidv4 } from 'uuid';

class Calendar {
  id: string;
  name: string;
  events: Map<string, Event>;

  constructor(id: string = uuidv4(), name: string = "Something is wrong", events: Map<string, Event> = new Map()) {
    this.id = id;
    this.name = name;
    this.events = events;
  }
}

class Event {
  id: string;
  title: string;
  color: string;
  description: string;
  date: Date;
  start: Time;
  end: Time;
  height: number;

  constructor( date: Date = new Date(), start: Time = new Time()) {
    this.id = uuidv4();
    this.date = date;
    this.start = start;
    this.end = new Time(0,0);
    this.title = "";
    this.description = "";
    this.color = "gray";
    this.height = 0;
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
