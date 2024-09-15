import { Event, Time, Calendar, User, Friend, FriendStatus} from "@/utils/CalendarHub/classes"
import * as I from "@/utils/CalendarHub/icons"
import { v4 as uuidv4 } from 'uuid';

const HOUR_WIDTH: number = 60;
const HOUR_HEIGHT: number = 70; // Quantity of pixels that corresponds to an hour
const CALENDAR_WIDTH: number = 1150;
const CALENDAR_HEIGHT: number = 750;
const HEADER_HEIGHT: number = 85;
const HEADER_FONT_SIZE: number = 18;
const SUBHEADER_HEIGHT: number = 50;
const SUBHEADER_FONT_SIZE: number = 15;
const HOURS_FONT_SIZE: number = 12.5;
const DAYS_OF_THE_WEEK_HEIGHT: number = 70;
const DAYS: string[]= ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];



const SHORT_DURATION_THRESHOLD = 60;  // Less than 60 minutes is a "SHORT" event.


const MAX_DURATION_MINUTES: number = 20;

// Peripherals events
const LEFT_MOUSE_CLICK: number = 0;
const ESCAPE_KEYS: string[] = ["Escape", "Esc"];
const ENTER_KEY : string = "Enter";

const NULL_TIME: Time = new Time(-1,-1);
const NULL_DATE: Date = new Date(-500, 6, 14, 3, 15, 30, 789);

/**
 * `NULL_EVENT` acts as a marker to initiate or terminate the event creation, dragging and resizing process.
 */
const NULL_EVENT: Event = new Event(NULL_DATE,NULL_TIME);

enum EVENT_ACTION {
  CREATE = "CREATE",
  DRAG = "DRAG",
  RESIZE = "RESIZE",
}
const NULL_CALENDAR: Calendar = new Calendar("-1","-1");
const NULL_CALENDARS: Map<string, Calendar>= new Map([[NULL_CALENDAR.id, NULL_CALENDAR]])

const TOAST_TYPE: { [key: string]: React.ComponentType } = {
  "success": I.success,
  "info": I.info,
  "error": I.error,
};

const COLORS_ARRAY: string[] = [
  "gray",
   "orange",
   "pink",
   "purple",
   "brown",
  "blue",
   "teal",
   "red",
   "yellow"
];

const ICONS_ARRAY: React.ComponentType[] = [
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



const MENU_MAP = new Map<React.ComponentType, string>([ 
  [I.disk, "Save"],
  [I.replace, "Change"],
  [I.confetti, "New"],
  [I.trash, "Delete"],
  [I.users, "Friends"],
  [I.download, "Import"],
  [I.upload, "Export"],
  [I.print, "Print"],
  [I.interrogation, "Help"],
]);

const HIDE_SCROLL_BAR: string = `
&::-webkit-scrollbar {
  display: none;
}


-ms-overflow-style: none;  
scrollbar-width: none; 
`

const TERTIARY_COLORS: { [colorName: string]: string } = {
  purple: "#B198FF", 
  blue: "#DAF5FC",   
  pink: "#FCD8EF",  
  orange: "#FFE9DC",
  gray: "#D3D3D3",   
  brown: "#DEB887",  
  teal: "#66C2C2",   
  red: "#FFB3B3",    
  yellow: "#FFFACD"  
};

const USER: User = new User(
  uuidv4(), // Generating a unique user ID
  "rosie@example.com", // Email address
  "Rosie", // Username
  "securepassword123", // Password
  new Map([
    ["work", new Calendar(uuidv4(), "Work Calendar")],
    ["personal", new Calendar(uuidv4(), "Personal Calendar asdkjhbasjhdajshdjhasgd")],
    ["yeah", new Calendar(uuidv4(), "School Calendar")]
  ]), // Initializes a map with two calendars
  [
    new Friend(uuidv4(), "Rosie", ["yeah1", "yeah2", "yeah3"], FriendStatus.Accepted), // Initializes friends list with one accepted friend
    new Friend(uuidv4(), "Juan", ["yeah4", "yeah5", "yeah6"], FriendStatus.Pending) // Another friend with a pending request
  ]
);


export {
  USER,
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
  TERTIARY_COLORS,
  SHORT_DURATION_THRESHOLD,
  NULL_DATE,
  EVENT_ACTION,
  ESCAPE_KEYS,
  ENTER_KEY,
  MENU_MAP,
  COLORS_ARRAY,
  TOAST_TYPE
};
