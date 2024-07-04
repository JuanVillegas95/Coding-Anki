import * as C from "@/utils/constants";
import { Time, Event } from "@/utils/classes";
import React from "react";

// Utility functions
const hoursToMinutes = (hours: number): number => hours * 60; // Converts hours to minutes
const minutesToHours = (minutes: number): number => minutes / 60; // Converts minutes to hours
const hoursToHeight = (hours: number): number => hours * C.HOUR_HEIGHT; // Converts hours (including fractional hours from minutes) to height in pixels using a constant that represent an hour

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

// Calculates the top offset in pixels units given the starting time and the time where it starts the event aka currentTime
const calculateTopOffset = (currentTime: Time, calendarStartTime: Time): number => { 
  const startMinutes: number = hoursToMinutes(calendarStartTime.hours) + calendarStartTime.minutes;
  const currentMinutes: number = hoursToMinutes(currentTime.hours) + currentTime.minutes;

  // Calculate how many minutes have passed from calendarStartTime to 
  const totalMinutes: number = currentMinutes - startMinutes;currentTime

   // Convert minutes to hours and then scale it for the height unit
  return hoursToHeight(minutesToHours(totalMinutes));
};

//  Generates an array of 24-hour formatted time intervals starting from a given time.
const generate24HourIntervals = (calendarStartTime: Time): string[] => {
  // Helper function to give format to our units
  const formatTimeUnit = (unit: number): string => (unit < 10 ? `0${unit}` : `${unit}`);
  
  // Deconstruct calendarStartTime and initializing array of strings
  const { hours, minutes } = calendarStartTime;
  const hoursArray: string[] = [];

  // Pushing formatted hours to the array
  for (let i = 0; i < 24; i++) {
    const hour: number = (hours + i) % 24; // Capping the hours
    const hourFormatted: string = formatTimeUnit(hour);
    const minutesFormatted: string = formatTimeUnit(minutes);
    hoursArray.push(`${hourFormatted}:${minutesFormatted}`);
  }

  return hoursArray;
};

// Calculates the time of an event based on the mouse click position relative to a calendar.
const calculateEventTime = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, calendarStartTime: Time): Time => {
  // Deconstruct calendarStartTime
  const { hours, minutes } = calendarStartTime;
  
  // Get the distance from the event to the mouse in pixels
  const { clientY, currentTarget } = e;
  const topOffset: number = currentTarget.getBoundingClientRect().top;
  const posY: number = clientY - topOffset;

  // Get the minutes from the top of the calendar
  const totalMinutesFromTop: number = Math.floor((posY / C.HOUR_HEIGHT) * 60);

  // Calculate the event time in minutes from the starting time
  const totalEventMinutes: number = hoursToMinutes(hours) + minutes + totalMinutesFromTop;

  // Convert totalEventMinutes to hours and minutes
  const eventHours: number = Math.floor(totalEventMinutes / 60);
  const eventMinutes: number = totalEventMinutes % 60;

  return new Time(eventHours, eventMinutes);
};

// Checks if a new event overlaps with any existing events on the same date.
const isEventOverlapping = (newDate: Date, newTime: Time, events: Map<string, Event>): boolean => {
  // Filter events that share the same date
  const sameDateEvents: Event[] = Array.from(events.values()).filter(({ date }) =>
    areDatesTheSame(date, newDate)
  );

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


const getEventDuration = ({ start, end }: Event): Time => {
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


const calculateEventHeight = (event: Event): number => {
  // Get the duration of the event in minutes
  const duration: Time = getEventDuration(event);

  // Convert the duration to total hours
  const totalHours = duration.hours + (duration.minutes / 60);

  // Convert the total hours to pixels using the HOUR_HEIGHT constant
  const height = hoursToHeight(totalHours);

  return height;
};

const isEndBeforeStart = ({ start, end }: Event): boolean => {
  // Convert start and end times to total minutes from midnight
  const startTotalMinutes: number = hoursToMinutes(start.hours) + start.minutes;
  const endTotalMinutes: number = hoursToMinutes(end.hours) + end.minutes;

  // Return whether the end time is less than the start time
  return endTotalMinutes <= startTotalMinutes;
};

const isEventColliding = (newDate: Date, newEvent: Event, events: Map<string, Event>, calendarStartTime: Time): boolean => {
  // Filter events that share the same date
  const sameDateEvents: Event[] = Array.from(events.values()).filter(({ date }) =>
    areDatesTheSame(date, newDate)
  );

  // Convert calendar start time to minutes from midnight
  const calendarStartMinutes = hoursToMinutes(calendarStartTime.hours) + calendarStartTime.minutes;

  // Convert new event's start and end times to total minutes from calendar start time
  const newEventStartMinutes = (hoursToMinutes(newEvent.start.hours) + newEvent.start.minutes) - calendarStartMinutes;
  const newEventEndMinutes = (hoursToMinutes(newEvent.end.hours) + newEvent.end.minutes) - calendarStartMinutes;

  // Check for overlapping events
  for (const { start, end } of sameDateEvents) {
    // Convert existing event's start and end times to total minutes from calendar start time
    const eventStartMinutes = (hoursToMinutes(start.hours) + start.minutes) - calendarStartMinutes;
    const eventEndMinutes = (hoursToMinutes(end.hours) + end.minutes) - calendarStartMinutes;

    // Check if new event overlaps with existing event
    if (
      (newEventStartMinutes < eventEndMinutes && newEventEndMinutes > eventStartMinutes)
    ) {
      return true; // There is a conflict
    }
  }

  return false; // No conflicts
};



export {
  range,
  areDatesTheSame,
  addDateBy,
  getMonday,
  calculateTopOffset,
  generate24HourIntervals,
  calculateEventTime,
  isEventOverlapping,
  getEventDuration,
  calculateEventHeight,
  hoursToMinutes,
  minutesToHours,
  hoursToHeight,
  isEndBeforeStart,
  isEventColliding,
};
