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

const TOAST_TYPE: Record<'success' | 'info' | 'error', React.ComponentType> = {
  success: I.success,
  info: I.info,
  error: I.error,
};

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


const MENU: Record<string, React.ComponentType> = {
  Save: I.disk,
  Change: I.replace,
  New: I.confetti,
  Delete: I.trash,
  Friends: I.users,
  Import: I.download,
  Export: I.upload,
  Print: I.print,
  Help: I.interrogation,
};

const HIDE_SCROLL_BAR: string = `
&::-webkit-scrollbar {
  display: none;
}


-ms-overflow-style: none;  
scrollbar-width: none; 
`


const COLORS : Record<string, {  
  primary: string;
  secondary: string;
  tertiary: string;
}> = {
  purple: {
    primary: '#571BFB',
    secondary: 'rgba(87, 27, 251, 0.1)',
    tertiary: '#B198FF',
  },
  blue: {
    primary: '#01A2EA',
    secondary: 'rgba(1, 162, 234, 0.1)',
    tertiary: '#DAF5FC',
  },
  pink: {
    primary: '#FE3CBB',
    secondary: 'rgba(254, 60, 187, 0.1)',
    tertiary: '#FCD8EF',
  },
  orange: {
    primary: '#FF7E00',
    secondary: 'rgba(255, 126, 0, 0.1)',
    tertiary: '#FFE9DC',
  },
  gray: {
    primary: '#808080',
    secondary: 'rgba(128, 128, 128, 0.1)',
    tertiary: '#D3D3D3',
  },
  brown: {
    primary: '#8B4513',
    secondary: 'rgba(139, 69, 19, 0.1)',
    tertiary: '#DEB887',
  },
  teal: {
    primary: '#008080',
    secondary: 'rgba(0, 128, 128, 0.1)',
    tertiary: '#66C2C2',
  },
  red: {
    primary: '#FF0000',
    secondary: 'rgba(255, 0, 0, 0.1)',
    tertiary: '#FFB3B3',
  },
  yellow: {
    primary: '#FFD700',
    secondary: 'rgba(255, 215, 0, 0.1)',
    tertiary: '#FFFACD',
  },
};


const USER: User = new User(
  uuidv4(), // Generating a unique user ID
  "rosie@example.com", // Email address
  "Rosie", // Username
  "securepassword123", // Password
  new Map([
    ["work", new Calendar(uuidv4(), "Work Calendar")],
    ["personal", new Calendar(uuidv4(), "Personal Calendar asdkjhbasjhdajshdjhasgd")],
    ["perasonal", new Calendar(uuidv4(), "Personal Calendara asdkjhbasjhdajshdjhasgd")],
    ["asdsadasdasd", new Calendar(uuidv4(), "safsaf")],
    ["asdgfdsfgdf", new Calendar(uuidv4(), "asfsafasf")],
    ["fasfassaf", new Calendar(uuidv4(), "asfasf")],
    ["safsafasfsa", new Calendar(uuidv4(), "asfasf")],
    ["fasfasfasfas", new Calendar(uuidv4(), "afsaf")],
    ["fsafasfdasfasfas", new Calendar(uuidv4(), "asf")],
    ["asfasfas", new Calendar(uuidv4(), "asf")],
    ["fasfasf", new Calendar(uuidv4(), "asfsaf")],
    ["afsfasfsafasf", new Calendar(uuidv4(), "afsf")],
    
    ["yeah", new Calendar(uuidv4(), "School Calendar")],
  ]), // Initializes a map with two calendars
  [
    new Friend(uuidv4(), "Rosie", ["yeah1", "yeah2", "yeah3"], FriendStatus.Accepted), // Initializes friends list with one accepted friend
    new Friend(uuidv4(), "Juan", ["yeah4", "yeah5", "yeah6"], FriendStatus.Pending), // Another friend with a pending request
    new Friend(uuidv4(), "Juan", ["yeah4", "yeah5", "yeah6"], FriendStatus.Pending), // Another friend with a pending request
    new Friend(uuidv4(), "Juan", ["yeah4", "yeah5", "yeah6"], FriendStatus.Pending), // Another friend with a pending request
    new Friend(uuidv4(), "Juan", ["yeah4", "yeah5", "yeah6"], FriendStatus.Pending), // Another friend with a pending request
    new Friend(uuidv4(), "Juan", ["yeah4", "yeah5", "yeah6"], FriendStatus.Pending), // Another friend with a pending request
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
  SHORT_DURATION_THRESHOLD,
  NULL_DATE,
  EVENT_ACTION,
  ESCAPE_KEYS,
  ENTER_KEY,
  MENU,
  TOAST_TYPE,
  COLORS
};
