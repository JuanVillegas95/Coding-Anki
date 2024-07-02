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


const generate24HourIntervals = (startingTime: Time): string[] => {
  // Helper function to give format to our units
  const formatTimeUnit = (unit: number): string => (unit < 10 ? `0${unit}` : `${unit}`);
  
  // Deconstruct startingTime and initializing array of strings
  const { hours, minutes } = startingTime
  const hoursArray: string[] = [];

  // Pushing formatted hours to the array
  for (let i = 0; i < 24; i++) {
    const hour: number = (hours + i) % 24; // Capping the hours
    const hourFormatted: string= formatTimeUnit(hour);
    const minutesFormatted: string = formatTimeUnit(minutes);
    hoursArray.push(`${hourFormatted}:${minutesFormatted}`);
  }

  return hoursArray;
};

const calculateEventTime = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, startingTime: Time): Time => {
  // Deconstruct startingTime
  const { hours, minutes } = startingTime;
  
  // Get the distance from the event to the mouse in pixels
  const { clientY, currentTarget } = e;
  const topOffset: number = currentTarget.getBoundingClientRect().top;
  const posY: number = clientY - topOffset;

  // Get the minutes from the top of the calendar
  const totalMinutesFromTop: number = Math.floor((posY / C.HOUR_HEIGHT) * 60);

  // Calculate the event time in minutes from the starting time
  const totalEventMinutes: number = hours * 60 + minutes + totalMinutesFromTop;

  // Convert totalEventMinutes to hours and minutes
  const eventHours: number = Math.floor(totalEventMinutes / 60);
  const eventMinutes: number = totalEventMinutes % 60;

  return new Time(eventHours, eventMinutes);
}


export {
  range,
  areDatesTheSame,
  addDateBy,
  getMonday,
  getFromTop,
  generate24HourIntervals,
  calculateEventTime,
  isEventOverlapping,
};

