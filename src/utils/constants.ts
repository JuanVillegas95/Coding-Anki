import * as I from "@/utils/icons";

// Constants
const HOUR_WIDTH: number = 60;
const HOUR_HEIGHT: number = 70; // Quantity of pixels that corresponds to an hour

const CALENDAR_WIDTH: number = 1150;
const CALENDAR_HEIGHT: number = 750;
const HEADER_HEIGHT: number = 90;
const HEADER_FONT_SIZE: number = 18;
const SUBHEADER_HEIGHT: number = 50;
const SUBHEADER_FONT_SIZE: number = 15;
const HOURS_FONT_SIZE: number = 12.5;
const DAYS_OF_THE_WEEK_HEIGHT: number = 70;
const DAYS: string[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const SHORT_DURATION_THRESHOLD: number = 60; // Less than 60 minutes is a "SHORT" event.
const MAX_DURATION_MINUTES: number = 20;
const DRAG_THRESHOLD: number = 200
// Peripheral events
const LEFT_MOUSE_CLICK: number = 0;
const ESCAPE_KEYS: string[] = ["Escape", "Esc"];
const ENTER_KEY: string = "Enter";



// Toast Type Enum
enum TOAST_TYPE {
  SUCCESS = 'SUCCESS',
  INFO = 'INFO',
  ERROR = 'ERROR',
}

// Toast Icon Mapping
const TOAST_ICON: Record<TOAST_TYPE, React.ComponentType> = {
  [TOAST_TYPE.SUCCESS]: I.success,
  [TOAST_TYPE.INFO]: I.info,
  [TOAST_TYPE.ERROR]: I.error,
};

// Warning Type Enum
enum WARNING_STATUS {
  NONE = "NONE", // No warning should be shown.
  EVENT_CONFLICT = "Event Conflict", 
  EVENT_MODIFY = "Recurring Event Modify", 
  EVENT_DELETE = "Recurring Event Delete", 
}


// Friend Status Enum
enum FRIEND_STATUS {
  PENDING = 'PENDING', // Initial state when a friend request is sent
  ACCEPTED = 'ACCEPTED', // When the friend request is accepted
  DECLINED = 'DECLINED', // When the friend request is declined
}

// Menu Icon Mapping
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


// Color Scheme
const COLORS: Record<string, {
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

export const ICONS: Record<string, React.ComponentType> = {
  bell: I.bell,
  cart: I.cart,
  heart: I.heart,
  star: I.star,
  mark: I.mark,
  phone: I.phone,
  information: I.information,
  coke: I.coke,
  meh: I.meh,
};

// Scrollbar Hiding CSS
const HIDE_SCROLL_BAR: string = `
&::-webkit-scrollbar {
  display: none;
}

-ms-overflow-style: none;
scrollbar-width: none;
`;

export const ONE_YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000; 


export {
  HOUR_HEIGHT,
  HOUR_WIDTH,
  HEADER_HEIGHT,
  DAYS_OF_THE_WEEK_HEIGHT,
  DAYS,
  MAX_DURATION_MINUTES,
  LEFT_MOUSE_CLICK,
  CALENDAR_HEIGHT,
  CALENDAR_WIDTH,
  SUBHEADER_HEIGHT,
  SUBHEADER_FONT_SIZE,
  HOURS_FONT_SIZE,
  HEADER_FONT_SIZE,
  HIDE_SCROLL_BAR,
  SHORT_DURATION_THRESHOLD,
  WARNING_STATUS,
  ESCAPE_KEYS,
  ENTER_KEY,
  MENU,
  TOAST_TYPE,
  COLORS,
  FRIEND_STATUS,
  TOAST_ICON,
  DRAG_THRESHOLD,
};
