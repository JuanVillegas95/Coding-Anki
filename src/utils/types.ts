import { Toast, Warning,Event } from "@/utils/classes"

export type WarningHandler = {
    setWarning: (newWarning: Warning) => void;
    clearWarning: () => void;
};

export type ToastHandler = {
    push: (newToast: Toast) => void;
    pop: () => void;
    getTail: () => Toast;
};

export type WeekHandler = {
    nextWeek: () => void;
    previousWeek: () => void;
    currentWeek: () => void;
};

export type CalendarHandler = {
    setEvent: (event: Event) => void;
    deleteEvent: (event: Event) => void;
};
