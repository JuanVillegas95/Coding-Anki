import * as C from "@/utils/constants";
import { Time, Event } from "@/utils/classes";
import React from "react";

// Utility functions
// Converts hours to minutes
const hoursToMinutes = (hours: number): number => hours * 60; 

// Converts minutes to hours
const minutesToHours = (minutes: number): number => minutes / 60; 

// Converts hours (including fractional hours from minutes) to height in pixels
const hoursToHeight = (hours: number): number => hours * C.HOUR_HEIGHT; 

// Convert pixels to hours (including fractional hours from minutes)
const pixelsToHours = (pixels: number): number => pixels / C.HOUR_HEIGHT;

// Converts the map into an array returning only the events with the same date
const getSameDateEvents = (events: Map<any, Event>, date: Date): Event[] => Array.from(events.values()).filter(( event ) => areDatesTheSame(event.date, date));

// Creates an array of n size;
const range = (size: number): number[] => [...Array(size).keys()]

// Validates if two dates are in the same day
const areDatesTheSame = (first: Date, second: Date): boolean =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

// Adds a specified number of days to the given date.
const addDateBy = (date: Date, count: number): Date => new Date(date.setDate(date.getDate() + count));

// Returns the most recent Monday
const getMostRecentMonday = (): Date => {
  const today = new Date();
  today.setDate(today.getDate() - (today.getDay() + 6) % 7 );
  return today;
}

// Calculates the top offset in pixels units given the time.
const calculateTopOffset = (time: Time): number => {
  const totalMinutes: number = hoursToMinutes(time.hours) + time.minutes;
  const totalHours: number = minutesToHours(totalMinutes);
  return hoursToHeight(totalHours);
}

// Formats the unit into decimal format
const formatTime = (unit: number): string => (( unit < 10 ) ? `0${unit}` : `${unit}`)

//  Generates an array of 24-hour formatted time intervals
const generate24HourIntervals = (): string[] => {
  const timeArray: string[] = [];
  for(let i = 0; i<24; i++) timeArray.push(`${formatTime(i)}:00`);
  return timeArray;
} 

// Calculates the start time of an event based on a mouse click position.
const calculateEventStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): Time => {
  const { clientY, currentTarget } = e;
  const topOffset: number = currentTarget.getBoundingClientRect().top;
  const distanceFromTop: number = clientY - topOffset;
  
  const totalHours: number = pixelsToHours(distanceFromTop);
  const totalMinutes: number = Math.floor(hoursToMinutes(totalHours));
  
  const startingHour: number = Math.floor(minutesToHours(totalMinutes));
  const startingMinutes: number = totalMinutes % 60;

  return new Time(startingHour, startingMinutes);
}

// Checks if a new event overlaps with any existing events on the same date.
const isEventOverlapping = (events: Map<string, Event>, newDate: Date, { hours, minutes }: Time) => {
  const sameDateEvents: Event[] = getSameDateEvents(events,newDate);
  const newEventTotalMinutes: number = hoursToMinutes(hours) + minutes;

  for(const { start, end } of sameDateEvents){
    const eventStartTotalMinutes: number = hoursToMinutes(start.hours) + start.minutes;
    const eventEndTotalMinutes: number = hoursToMinutes(end.hours) + end.minutes;
    
    if(newEventTotalMinutes >= eventStartTotalMinutes && newEventTotalMinutes < eventEndTotalMinutes) return true;
  }
  return false;
}

// Calculate the eventHeight based on the mouse position and the Start Time
const calculateEventHeight = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, { start }: Event): number =>{
  const { clientY, currentTarget } = e;
  const topOffset: number = currentTarget.getBoundingClientRect().top;
  const distanceFromTop: number = clientY - topOffset;

  const totalHourStart: number= start.hours + minutesToHours(start.minutes);
  const distanceFromStart: number = hoursToHeight(totalHourStart);

  return distanceFromTop - distanceFromStart
}

// Calculates the  end time of an event based the height and start time
const calculateEventEnd = ({ start, height }: Event): Time => {
  const totalMinutesStart: number = hoursToMinutes(start.hours) + start.minutes;
  const totalMinutesHeight: number = Math.floor(hoursToMinutes(pixelsToHours(height)));
  const totalMinutes: number = totalMinutesStart + totalMinutesHeight;

  const hourEnd: number = Math.floor(minutesToHours(totalMinutes));
  const minutesEnd: number  = totalMinutes % 60;
  
  return new Time(hourEnd,minutesEnd);
}

// Calculates the event duration



const isEndBeforeStart = ({ start, end }: Event): boolean => {
  const startTotalMinutes: number = hoursToMinutes(start.hours) + start.minutes;
  const endTotalMinutes: number = hoursToMinutes(end.hours) + end.minutes;

  return endTotalMinutes <= startTotalMinutes;
};

const isEventColliding = (newEvent: Event, events: Map<string, Event>): boolean => {
  // Filter events that share the same date
  const sameDateEvents: Event[] = getSameDateEvents(events, newEvent.date);

  // Convert new event's start and end times to total minutes
  const newEventStartMinutes = hoursToMinutes(newEvent.start.hours) + newEvent.start.minutes;
  const newEventEndMinutes = hoursToMinutes(newEvent.end.hours) + newEvent.end.minutes;

  // Check for overlapping events
  for (const { start, end, id } of sameDateEvents) {
    if (newEvent.id === id) continue;
    // Convert existing event's start and end times to total minutes
    const eventStartMinutes = hoursToMinutes(start.hours) + start.minutes;
    const eventEndMinutes = hoursToMinutes(end.hours) + end.minutes;

    // Check if new event overlaps with existing event
    if (
      (newEventStartMinutes < eventEndMinutes && newEventEndMinutes > eventStartMinutes) ||
      (newEventStartMinutes >= eventStartMinutes && newEventStartMinutes < eventEndMinutes)
    ) {
      return true; // There is a conflict
    }
  }

  return false; // No conflicts
};

const isNewEventValid = (newEvent: Event, events: Map<string, Event>): boolean => {
  const newEventDuration: Time = getEventDuration(newEvent);
  if(newEventDuration.minutes < C.MAX_DURATION_MINUTES) return false

  const endBeforeStart: boolean= isEndBeforeStart(newEvent);
  if(endBeforeStart) return false

  const eventColliding: boolean= isEventColliding(newEvent,events);
  if(eventColliding) return false

  return true;
}



export {
  range,
  areDatesTheSame,
  addDateBy,
  getMostRecentMonday,
  calculateTopOffset,
  generate24HourIntervals,
  calculateEventStart,
  isEventOverlapping,
  calculateEventHeight,
  calculateEventEnd,
  isNewEventValid,
};
