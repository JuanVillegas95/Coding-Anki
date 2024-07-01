import * as C from "@/utils/constants";
import { Time, Event } from "@/utils/classes"
import React from "react";

const range = (keyCount: number): number[] => [...Array(keyCount).keys()];

const areDatesTheSame = (first: Date, second: Date): boolean =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const addDateBy = (date: Date, count: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + count);
  return d;
};

const getMonday = (): Date => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(today.setDate(diff));
};

const getFromTop = (hours: number, minutes: number): number => hours * C.HOUR_HEIGHT + (minutes / 60) * C.HOUR_HEIGHT;

// Calculate the time-start based on the mouse position...
const calculateEventTime = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): Time =>{
  // Get the distance from the event to the mouse in pixels
  const { clientY, currentTarget } = e;
  const topOffset: number = currentTarget.getBoundingClientRect().top;
  const posY: number = clientY - topOffset;

  // Get the hours and minutes 
  const hours: number = Math.floor(posY / C.HOUR_HEIGHT);
  const minutes: number = Math.floor((posY % C.HOUR_HEIGHT) / C.HOUR_HEIGHT) * 60;
  
  return new Time(hours,minutes)
}

const isEventTimeConflict = (newEvent: Event, events: Map<string, Event>): boolean => {
  const eventsOnSameDay = Array.from(events.values()).filter(event => areDatesTheSame(event.date, newEvent.date));

  for (const event of eventsOnSameDay) {
    const eventStartMinutes = event.start.hours * 60 + event.start.minutes;
    const eventEndMinutes = event.end.hours * 60 + event.end.minutes;
    const newEventStartMinutes = newEvent.start.hours * 60 + newEvent.start.minutes;

    if (newEventStartMinutes >= eventStartMinutes && newEventStartMinutes <= eventEndMinutes) {
      return true;
    }
  }

  return false;
};


export {
  range,
  areDatesTheSame,
  addDateBy,
  getMonday,
  getFromTop,
  calculateEventTime,
  isEventTimeConflict,
};

