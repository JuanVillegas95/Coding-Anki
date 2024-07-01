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
  const formatTimeUnit = (unit: number): string => (unit < 10 ? `0${unit}` : `${unit}`);
  
  const { hours, minutes } = startingTime
  const hoursArray: string[] = [];
  for (let i = 0; i < 24; i++) {
    const hour = (hours + i) % 24;
    const hourFormatted = formatTimeUnit(hour);
    const minutesFormatted = formatTimeUnit(minutes);
    hoursArray.push(`${hourFormatted}:${minutesFormatted}`);
  }

  return hoursArray;
};



export {
  range,
  areDatesTheSame,
  addDateBy,
  getMonday,
  getFromTop,
  generate24HourIntervals,
};

