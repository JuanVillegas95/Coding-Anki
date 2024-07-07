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

// Calculates the top offset in pixels units given the starting time and the time where it starts the event aka currentTime
const calculateTopOffset = (currentTime: Time): number => { 
  const currentMinutes: number = hoursToMinutes(currentTime.hours) + currentTime.minutes;
   // Convert minutes to hours and then scale it for the height unit
  return hoursToHeight(minutesToHours(currentMinutes));
};

//  Generates an array of 24-hour formatted time intervals
const generate24HourIntervals = (): string[] => {
  const hoursArray: string[] = [];
  // Pushing formatted hours to the array
  for (let i = 0; i < 24; i++) {
    const hourFormatted: string = (i < 10 ? `0${i}` : `${i}`);
    hoursArray.push(`${hourFormatted}:00`);
  }

  return hoursArray;
};

const calculateEventStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): Time => {
  // Get the distance from the event to the mouse in pixels
  const { clientY, currentTarget } = e;
  const topOffset: number = currentTarget.getBoundingClientRect().top;
  const posY: number = clientY - topOffset;

  // Get the minutes from the top of the calendar
  const totalMinutesFromTop: number = Math.floor((posY / C.HOUR_HEIGHT) * 60);

  // Convert totalEventMinutes to hours and minutes
  const eventHours: number = Math.floor(totalMinutesFromTop / 60);
  const eventMinutes: number = totalMinutesFromTop % 60;

  return new Time(eventHours, eventMinutes);
};

// Calculates the  end time of an event based the height and start time
const calculateEventEnd = ({ start, height }: Event): Time => {
  const totalMinutesHeight: number = Math.floor((height / C.HOUR_HEIGHT) * 60);
  const totalMinutesStart: number = hoursToMinutes(start.hours) + start.minutes;
  const totalMinutes = totalMinutesHeight + totalMinutesStart;

  // Convert totalMinutes to hours and minutes
  const eventHours: number = Math.floor(totalMinutes / 60);
  const eventMinutes: number = totalMinutes % 60;

  return new Time(eventHours, eventMinutes);
};

// Checks if a new event overlaps with any existing events on the same date.
const isEventOverlapping = (newDate: Date, newTime: Time, events: Map<string, Event>): boolean => {
  // Filter events that share the same date
  const sameDateEvents: Event[] = getSameDateEvents(events, newDate);
  // Check for overlapping events
  for (const { start, end } of sameDateEvents) {
    // Convert time to minutes;
    const newEventStartMinutes = hoursToMinutes(newTime.hours) + newTime.minutes;

    const eventStartMinutes = hoursToMinutes(start.hours) + start.minutes;
    const eventEndMinutes = hoursToMinutes(end.hours) + end.minutes;

    // Check if new event starts within the boundaries of another event
    if (newEventStartMinutes >= eventStartMinutes && 
        newEventStartMinutes < eventEndMinutes
      ) { 
      return true; // There is a conflict
    }
  }

  return false; // No conflicts
};

const getEventDuration = ({ start, end }: Event, ): Time => {
  // Convert start and end times to total minutes from midnight
  const startTotalMinutes: number = hoursToMinutes(start.hours) + start.minutes;
  const endTotalMinutes: number = hoursToMinutes(end.hours) + end.minutes;

  // Calculate the total duration in minutes
  const totalDuration: number = endTotalMinutes - startTotalMinutes;

  // Convert total duration from minutes to hours and remaining minutes
  const totalDurationHours: number = Math.floor(minutesToHours(totalDuration));
  const totalDurationMinutes: number = totalDuration % 60;

  // Return the total duration as a Time object
  return new Time(totalDurationHours, totalDurationMinutes);
};

// Calculate the eventHeight based on the mouse position and the Start Time
const calculateEventHeight = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, newEvent: Event): number => {
  // Get the distance from the event to the mouse in pixels
  const { clientY, currentTarget } = e;
  const topOffset: number = currentTarget.getBoundingClientRect().top;
  const posY: number = clientY - topOffset;

  const totalHoursMinutes: number = newEvent.start.hours + minutesToHours(newEvent.start.minutes)
  const totalHoursPixels: number = hoursToHeight(totalHoursMinutes);

  return posY - totalHoursPixels;
};

const isEndBeforeStart = ({ start, end }: Event): boolean => {
  // Convert start and end times to total minutes from midnight
  const startTotalMinutes: number = hoursToMinutes(start.hours) + start.minutes;
  const endTotalMinutes: number = hoursToMinutes(end.hours) + end.minutes;

  // Return whether the end time is less than the start time
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
