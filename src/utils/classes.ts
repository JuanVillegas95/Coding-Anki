import { v4 as uuidv4 } from 'uuid';

class Time {
  hours: number;
  minutes: number;

  constructor(hours: number, minutes: number) {
    this.hours = hours;
    this.minutes = minutes;
  }
}

class Event {
  id: string;
  date: Date;
  title: string;
  description: string;
  height: number;
  color: string;

  constructor(
    date: Date = new Date(),
    title: string = "",
    description: string = "",
    color: string = "gray",
    height: number = 0,
  ) {
    this.id = uuidv4();
    this.date = date;
    this.title = title;
    this.description = description;
    this.height = height;
    this.color = color;
  }
}

export { Event, Time };
