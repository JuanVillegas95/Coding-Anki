import { v4 as uuidv4 } from 'uuid';


class FormattedEvent {
  id: string;
  title: string;
  color: string;
  description: string;
  startHours: string;
  startMinutes: string;
  endHours: string;
  endMinutes: string;
  height: number;
  topOffset: number;
  isOverlapping: boolean;

  constructor(
    id: string,
    title: string,
    color: string,
    description: string,
    startHours: string,
    startMinutes: string,
    endHours: string,
    endMinutes: string,
    height: number,
    topOffset: number,
    isOverlapping: boolean = false

  ) {
    this.id = id;
    this.title = title;
    this.color = color;
    this.description = description;
    this.startHours = startHours;
    this.startMinutes = startMinutes;
    this.endHours = endHours;
    this.endMinutes = endMinutes;
    this.height = height;
    this.topOffset = topOffset;
    this.isOverlapping = isOverlapping;
  }
}


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
  duration: Time;
  isOverlapping: boolean;
  topOffset: number;


  constructor( date: Date = new Date(), start: Time = new Time()) {
    this.id = uuidv4();
    this.date = date;
    this.start = start;
    this.end = new Time(-1,-1);
    this.title = "Math";
    this.description = "Diego la chupa";
    this.color = "gray";
    this.height = -1;
    this.duration = new Time(-1,-1);
    this.isOverlapping = false;
    this.topOffset = 0;
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

export { Event, Time, Calendar, FormattedEvent };
