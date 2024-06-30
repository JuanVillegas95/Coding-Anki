import * as CONST from "@/utils/constants";

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

const getFromTop = (hours: number, minutes: number): number => hours * CONST.HOUR_HEIGHT + (minutes / 60) * CONST.HOUR_HEIGHT;

export {
  range,
  areDatesTheSame,
  addDateBy,
  getMonday,
  getFromTop
};