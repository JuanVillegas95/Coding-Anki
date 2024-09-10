import * as C from "@/utils/CalendarHub/constants";
import { Time, Event } from "@/utils/CalendarHub/classes";
import React from "react";

// Utility functions
// Converts hours to minutes
const hoursToMinutes = (hours: number): number => hours * 60; 

// Converts minutes to hours
const minutesToHours = (minutes: number): number => minutes / 60; 

// Converts hours (including fractional hours from minutes) to height in pixels
const hoursToPixels = (hours: number): number => hours * C.HOUR_HEIGHT; 

// Convert pixels to hours (including fractional hours from minutes)
const pixelsToHours = (pixels: number): number => pixels / C.HOUR_HEIGHT;

// Convert time in minutes;
const timeToMinutes = (time: Time): number => hoursToMinutes(time.hours) + time.minutes;


// Converts the map into an array returning only the events with the same date
const getSameDateEvents = (events: Map<any, Event>, date: Date): Event[] => Array.from(events.values()).filter(( event ) => areDatesTheSame(event.startDate, date));



// Creates an array of n size;
const range = (size: number): number[] => [...Array(size).keys()]

// Validates if two dates are in the same day
const areDatesTheSame = (first: Date, second: Date): boolean =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

// Adds a specified number of days to the given date.
const addDateBy = (date: Date, count: number): Date => {
  const newDate = new Date(date.getTime());
  newDate.setDate(newDate.getDate() + count);
  return newDate;
};

// Returns the most recent Monday
const getMostRecentMonday = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  today.setDate(today.getDate() - daysSinceMonday);
  return today;
}


// Calculates the top offset in pixels units given the time.
const calculateTopOffset = (time: Time): number => {
  const totalTimeMinutes = timeToMinutes(time);
  const totalTimeHours = minutesToHours(totalTimeMinutes);
  return hoursToPixels(totalTimeHours);
}

// Formats the unit into decimal format
const formatTime = (unit: number): string => (( unit < 10 ) ? `0${unit}` : `${unit}`)

//  Generates an array of 24-hour formatted time intervals
const generate24HourIntervals = (): string[] => {
  const timeArray: string[] = [];
  for(let i = 0; i<24; i++) {
    const formattedTime: string = formatTime(i);
    timeArray.push(`${formattedTime}:00`);
    timeArray.push(`${formattedTime}:30`);
  }
  return timeArray;
} 

// Calculates the start time of an event based on a mouse click position.
const calculateEventTime = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, mainRef: React.RefObject<HTMLDivElement>): Time => {
  const distanceFromTop: number = e.clientY -  mainRef.current!.getBoundingClientRect().top;
  
  const totalHours: number = pixelsToHours(distanceFromTop);
  const totalMinutes: number = Math.floor(hoursToMinutes(totalHours));
  
  const timeHour: number = Math.floor(minutesToHours(totalMinutes));
  const timeMinutes: number = totalMinutes % 60;

  return new Time(timeHour, timeMinutes);
}

const calculateEvenTimeOnDrag = (
  e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  eventDivRef: React.RefObject<HTMLDivElement>,
  mainRef: React.RefObject<HTMLDivElement>
): Time => {
  const { clientY, } = e;
  const containerTop = mainRef.current!.getBoundingClientRect().top;

  const grabOffsetY = eventDivRef.current!.dataset.grabOffsetY ? parseFloat(eventDivRef.current!.dataset.grabOffsetY) : clientY - eventDivRef.current!.getBoundingClientRect().top;

  // Save grab offset in data attribute
  eventDivRef.current!.dataset.grabOffsetY = grabOffsetY.toString();

  // Calculate the current mouse position relative to the container
  const currentMouseY = clientY - containerTop;

  // Adjust the event position based on the grab offset
  const adjustedPositionY = currentMouseY - grabOffsetY;

  // Convert the adjusted Y position to the corresponding time in hours
  const adjustedHours = pixelsToHours(adjustedPositionY);
  const totalMinutes: number = Math.floor(hoursToMinutes(adjustedHours));

  const timeHour: number = Math.floor(minutesToHours(totalMinutes));
  const timeMinutes: number = totalMinutes % 60;

  return new Time(timeHour, timeMinutes);
}


const calculateEventDateOnDrag = (
  e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  eventDivRef: React.RefObject<HTMLDivElement>,
  currentDate: Date
): Date => {
  // Get the width of the event div
  const eventWidth = eventDivRef.current?.clientWidth;
  
  // Get the left position of the event div
  const eventLeft = eventDivRef.current?.getBoundingClientRect().left;
  
  // Get the mouse X position relative to the viewport
  const mouseX = e.clientX;

  // Define a threshold distance (in pixels) to consider as "extreme"
  const threshold = 5;

  // Determine if the mouse is near the left side
  const isNearLeft = eventLeft !== undefined && mouseX <= eventLeft + threshold;

  // Determine if the mouse is near the right side
  const isNearRight =
    eventLeft !== undefined &&
    eventWidth !== undefined &&
    mouseX >= eventLeft + eventWidth - threshold;

  if (isNearLeft) {
    currentDate = addDateBy(currentDate,-1);
    console.log("left")
  }

  if (isNearRight) {
    currentDate = addDateBy(currentDate,1);
    
  }

  // Return the current date or perform other actions
  return currentDate;
};


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
const calculateEventHeight = ({ start, end }: Event): number =>{
  const totalHourStart: number= start.hours + minutesToHours(start.minutes);
  const distanceFromStart: number = hoursToPixels(totalHourStart);

  const totalHourEnd: number = end.hours + minutesToHours(end.minutes);
  const distanceFromEnd: number = hoursToPixels(totalHourEnd);

  return distanceFromEnd - distanceFromStart
}

// Calculates the  end time of an event based the height and start time
const calculateEventEnd = ({ start, height }: Event): Time => {
  const totalMinutesStart: number = timeToMinutes(start);
  const totalMinutesHeight: number = Math.floor(hoursToMinutes(pixelsToHours(height)));
  const totalMinutes: number = totalMinutesStart + totalMinutesHeight;

  const hourEnd: number = Math.floor(minutesToHours(totalMinutes));
  const minutesEnd: number  = totalMinutes % 60;
  
  return new Time(hourEnd,minutesEnd);
}

// Calculates the event duration
const calculateEventDuration = ({ start, end }: Event): Time => {
  const totalStartMinutes: number = timeToMinutes(start);
  const totalEndMinutes: number = timeToMinutes(end);

  const eventTotalMinutes: number = totalEndMinutes - totalStartMinutes;
  
  const eventHours: number = Math.floor(minutesToHours(eventTotalMinutes));
  const eventMinutes: number = eventTotalMinutes % 60;

  return new Time(eventHours,eventMinutes);
}

const isEndBeforeStart = ({ start, end }: Event): boolean => {
  const startTotalMinutes: number = timeToMinutes(start);
  const endTotalMinutes: number = timeToMinutes(end);

  return endTotalMinutes <= startTotalMinutes;
};

const isEventColliding = (newEvent: Event, events: Map<string, Event>): boolean => {
  const sameDateEvents: Event[] = getSameDateEvents(events, newEvent.startDate);
  const newEventStartMinutes = timeToMinutes(newEvent.start);
  const newEventEndMinutes = timeToMinutes(newEvent.end);

  for (const { start, end, id } of sameDateEvents) {
    if (newEvent.id === id) continue;
    const eventStartMinutes = timeToMinutes(start);
    const eventEndMinutes = timeToMinutes(end);

    if (newEventStartMinutes < eventEndMinutes && newEventEndMinutes > eventStartMinutes) return true; 
  }

  return false; 
};

const isNewEventValid = (newEvent: Event, events: Map<string, Event>): boolean => {
  const totalMinutes: number = timeToMinutes(newEvent.duration);

  if(totalMinutes < C.MAX_DURATION_MINUTES) return false

  const endBeforeStart: boolean= isEndBeforeStart(newEvent);
  if(endBeforeStart) return false

  // const isStartDateValid: Time = newEvent.start.hours;

  const eventColliding: boolean= isEventColliding(newEvent,events);
  if(eventColliding) return false

  return true;
}

const formatMonth = (month: Date): string =>{
  return month.toLocaleString('default', { month: 'short' })
}

const getMonth = (mondayDate: Date): string => {


  const month: string = formatMonth(mondayDate);
  for(let i = 0; i<7; i++){
    const newDate: Date = addDateBy(mondayDate,i);
    const newMonth: string = formatMonth(newDate);
    if(month !== newMonth){
      return `${month} - ${newMonth}`
    }
  }
  return mondayDate.toLocaleDateString('default', { month: 'long' });
}

const generate24Hours = (): string[] => {
  const hourArray: string[] = [];
  for(let i = 0; i<24; i++)   hourArray.push(formatTime(i));
  return hourArray;
}

const generate60Minutes = (): string[] => {
  const minutesArray: string[] = [];
  for(let i = 0; i<60; i++)   minutesArray.push(formatTime(i));
  return minutesArray;
}

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

const getDay = (date: Date): number => {
  let dayOfTheWeek: number = date.getDay() - 1;
  if(dayOfTheWeek < 0) dayOfTheWeek = 6;
  return dayOfTheWeek;
}

const shouldBeLocked = (date: Date, index: number): boolean => {
  let dayOfTheWeek: number = date.getDay() - 1;
  if(dayOfTheWeek < 0) dayOfTheWeek = 6;
  return dayOfTheWeek === index;
}





export {
  range,
  areDatesTheSame,
  addDateBy,
  getMostRecentMonday,
  calculateTopOffset,
  generate24HourIntervals,
  calculateEventTime,
  isEventOverlapping,
  calculateEventHeight,
  calculateEventEnd,
  isNewEventValid,
  calculateEventDuration,
  formatTime,
  timeToMinutes,
  getMonth,
  generate24Hours,
  generate60Minutes,
  isEventColliding,
  formatDate,
  getDay,
  shouldBeLocked,
  formatMonth,
  getSameDateEvents,
  calculateEvenTimeOnDrag,
  calculateEventDateOnDrag
};
