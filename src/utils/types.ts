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
    setEvent: (event: Event) => void;
    deleteEvent: (event: Event) => void;
    getEvents: () => Map<string,Event>;
    setRecurringEvents: (recurringEvent: Event) => void;
};
