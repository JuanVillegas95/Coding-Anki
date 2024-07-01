import { v4 as uuidv4 } from 'uuid';

class Time {
  hours: number;
  minutes: number;

  constructor(hours: number = 0, minutes: number = 0) {
    this.hours = hours;
    this.minutes = minutes;
  }
}

class Event {
  id: string;
  date: Date;
  start: Time;
  end: Time;
  title: string;
  description: string;
  height: number;
  color: string;

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

export { Event, Time };
