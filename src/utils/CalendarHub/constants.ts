import { Event, Time, Calendar } from "@/utils/CalendarHub/classes"
import * as I from "@/utils/CalendarHub/icons"

const HOUR_WIDTH: number = 60;
const HOUR_HEIGHT: number = 70; // Quantity of pixels that corresponds to an hour
const CALENDAR_WIDTH: number = 1000;
const CALENDAR_HEIGHT: number = 750;
const HEADER_HEIGHT: number = 85;
const SUBHEADER_HEIGHT: number = 50;
const SUBHEADER_FONT_SIZE: number = 15;
const HOURS_FONT_SIZE: number = 12.5;
const HEADER_FONT_SIZE: number = 18;

const DAYS_OF_THE_WEEK_HEIGHT: number = 70;
const DAYS: string[]= ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const MAX_DURATION_MINUTES: number = 15;
const LEFT_MOUSE_CLICK: number = 0;
const NULL_EVENT = new Event(new Date(-500, 6, 14, 3, 15, 30, 789),new Time(-1,-1));
const NULL_CALENDAR = new Calendar("-1","-1");
const NULL_CALENDARS = new Map([[NULL_CALENDAR.id, NULL_CALENDAR]])

const ICONS_ARRAY: string[] = [
  I.bell,
  I.cart,
  I.heart,
  I.star,
  I.mark,
  I.phone,
  I.information,
  I.coke,
  I.meh
];


const COLORS_MAP = new Map<any, string>([
  [I.gray, "gray"],
  [I.orange, "orange"],
  [I.pink, "pink"],
  [I.purple, "purple"],
  [I.brown, "brown"],
  [I.blue, "blue"],
  [I.teal, "teal"],
  [I.red, "red"],
  [I.yellow, "yellow"]
]);

const HIDE_SCROLL_BAR: string = `
&::-webkit-scrollbar {
  display: none;
}


-ms-overflow-style: none;  
scrollbar-width: none; 
`

export {
  HOUR_HEIGHT,
  HOUR_WIDTH,
  HEADER_HEIGHT,
  DAYS_OF_THE_WEEK_HEIGHT,
  DAYS,
  MAX_DURATION_MINUTES,
  LEFT_MOUSE_CLICK,
  NULL_EVENT,
  NULL_CALENDAR,
  NULL_CALENDARS,
  CALENDAR_HEIGHT,
  CALENDAR_WIDTH,
  SUBHEADER_HEIGHT,
  SUBHEADER_FONT_SIZE,
  HOURS_FONT_SIZE,
  HEADER_FONT_SIZE,
  HIDE_SCROLL_BAR,
  ICONS_ARRAY,
  COLORS_MAP,
};
