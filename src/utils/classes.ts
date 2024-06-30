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
  startTime: Time;
  endTime: Time;
  title: string;
  description: string;
  height: number;
  color: string;

  constructor(
    date: Date,
    startTime: Time,
    endTime: Time = new Time(0, 0),
    title: string = "",
    description: string = "",
    height: number = 0,
    color: string = "gray"
  ) {
    this.id = uuidv4();
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.title = title;
    this.description = description;
    this.height = height;
    this.color = color;
  }
}

export { Event, Time };
