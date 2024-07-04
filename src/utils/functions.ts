import * as C from "@/utils/constants";
import { Time, Event } from "@/utils/classes";
import React from "react";

// Utility functions
const hoursToMinutes = (hours: number): number => hours * 60; // Converts hours to minutes
const minutesToHours = (minutes: number): number => minutes / 60; // Converts minutes to hours
const hoursToHeight = (hours: number): number => hours * C.HOUR_HEIGHT; // Converts hours (including fractional hours from minutes) to height in pixels using a constant that represent an hour
const getSameDateEvents = (events: Map<any, Event>, newDate: Date): Event[] => {
  return Array.from(events.values()).filter(({ date }) => 
    areDatesTheSame(date, newDate)
  );
};

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

// Calculates the time of an event based on the mouse click position relative to a calendar.
const calculateEventTime = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): Time => {
  // Deconstruct calendarStartTime
  
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
