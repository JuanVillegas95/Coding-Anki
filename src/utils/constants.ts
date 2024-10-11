import { 
  success, 
  info, 
  error, 
  disk, 
  replace, 
  confetti, 
  trash, 
  users, 
  download, 
  upload, 
  print, 
  interrogation, 
  bell, 
  cart, 
  heart, 
  star, 
  mark, 
  phone, 
  information, 
  coke, 
  meh 
} from "@/utils/icons";

// Constants
export const HOUR_WIDTH = 60;
export const HOUR_HEIGHT = 70; // Quantity of pixels that corresponds to an hour

export const CALENDAR_WIDTH = 1150;
export const CALENDAR_HEIGHT = 900;
export const HEADER_HEIGHT = 90;
export const HEADER_FONT_SIZE = 18;
export const SUBHEADER_HEIGHT = 50;
export const SUBHEADER_FONT_SIZE = 15;
export const HOURS_FONT_SIZE = 12.5;
export const DAYS_OF_THE_WEEK_HEIGHT = 70;
export const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
export const SHORT_DURATION_THRESHOLD = 60; // Less than 60 minutes is a "SHORT" event.
export const MAX_DURATION_MINUTES = 20;
export const DRAG_THRESHOLD = 200;

// Peripheral events
export const LEFT_MOUSE_CLICK = 0;
export const ESCAPE_KEYS = ["Escape", "Esc"];
export const ENTER_KEY = "Enter";

// Toast Type Enum
export enum TOAST_TYPE {
  SUCCESS = 'SUCCESS',
  INFO = 'INFO',
  ERROR = 'ERROR',
}

// Toast Icon Mapping
export const TOAST_ICON: Record<TOAST_TYPE, React.ComponentType> = {
  [TOAST_TYPE.SUCCESS]: success,
  [TOAST_TYPE.INFO]: info,
  [TOAST_TYPE.ERROR]: error,
};

export enum STATUS {
  OK = "ok", // No warning should be shown.
  EVENT_CONFLICT = "Event Conflict", 
  EVENT_MODIFY = "Recurring Event Modify", 
  EVENT_DELETE = "Recurring Event Delete", 
}

// Menu Icon Mapping
export const MENU: Record<string, React.ComponentType> = {
  Save: disk,
  Change: replace,
  New: confetti,
  Delete: trash,
  Friends: users,
  Import: download,
  Export: upload,
  Print: print,
  Help: interrogation,
};

// Color Scheme

export enum COLOR {
  PURPLE = "purple",
  BLUE = "blue",
  PINK = "pink",
  ORANGE = "orange",
  GRAY = "gray",
  BROWN = "brown",
  TEAL = "teal",
  RED = "red",
  YELLOW = "yellow",
}



export const COLORS: Record<COLOR, {
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

export enum ICON {
  BELL = "bell",
  CART = "cart",
  HEART = "heart",
  STAR = "star",
  MARK = "mark",
  PHONE = "phone",
  INFORMATION = "information",
  COKE = "coke",
  MEH = "meh",
}


// Icons
export const ICONS: Record<ICON, React.ComponentType> = {
  bell,
  cart,
  heart,
  star,
  mark,
  phone,
  information,
  coke,
  meh,
};

// Scrollbar Hiding CSS
export const HIDE_SCROLL_BAR = `
&::-webkit-scrollbar {
  display: none;
}

-ms-overflow-style: none;
scrollbar-width: none;
`;

export const USER_SELECT_NONE = `
  -webkit-user-select: none;
  -moz-user-select: none; 
  -ms-user-select: none; 
  user-select: none; 
`

export const ONE_YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000;
