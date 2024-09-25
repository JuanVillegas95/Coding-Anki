import { Toast, Warning,Event } from "@/utils/classes"

export type WarningHandler = {
    set: (newWarning: Warning) => void;
    close: () => void;
};

export type ToastHandler = {
    push: (newToast: Toast) => void;
    pop: () => void;
    getTail: () => Toast;
};

export type WeekHandler = {
    next: () => void;
    prev: () => void;
    curr: () => void;
};

export type CalendarHandler = {
    deleteEvent: (event: Event) => void;
    getEvents: () => Map<string,Event>;
    setEvent: (event: Event) => void;
    setRecurringEvents: (recurringEvent: Event) => void;

    setReccurringEventIDs: (event: Event) => void;
    deleteRecurringEventID: (event: Event) => void;
    getReccurringEventIDs: (event: Event) => Event[];
};

export type EventOnMouseDownType = {
    create: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, date: Date) => void;
    drag: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, event: Event) => void;
    bottom: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, event: Event) => void;
    top: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, event: Event) => void;
};
