import { Event, Time } from "@/utils/classes"

const HOUR_WIDTH: number = 60;
const HOUR_HEIGHT: number = 50; // Quantity of pixels that corresponds to an hour
const HEADER_HEIGHT: number = 60;
const DAYS_OF_THE_WEEK_HEIGHT: number = 70;
const DAYS: Array<string> = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const COLORS: Array<string> = ["gray", "orange", "pink", "purple", "brown", "blue"];
const MAX_DURATION_MINUTES: number = 15;
const LEFT_MOUSE_CLICK: number = 0;
const NULL_EVENT = new Event(new Date(-500, 6, 14, 3, 15, 30, 789),new Time(-1,-1));


export {
  HOUR_HEIGHT,
  HOUR_WIDTH,
  HEADER_HEIGHT,
  DAYS_OF_THE_WEEK_HEIGHT,
  DAYS,
  COLORS,
  MAX_DURATION_MINUTES,
  LEFT_MOUSE_CLICK,
  NULL_EVENT
};
