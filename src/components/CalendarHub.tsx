'use client';
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Event, Calendar, Toast, Warning, User, Friend } from "@/utils/classes";
import CalendarHeader from "@/components/CalendarHeader"
import TimeColumnAside from "@/components/TimeColumnAside"
import DaySection from "@/components/DaySection"
import ScheduleGridMain from "@/components/ScheduleGridMain";
import MenuAside from "@/components/MenuAside";
import ToastMessage from "@/components/ToastMessage";
import WarningModal from "@/components/WarningModal";
import * as C from '@/utils/constants';
import * as F from '@/utils/functions';
import * as S from '@/utils/styles';
import * as T from '@/utils/types';

const USER: User = new User(
  "a", // Generating a unique user ID
  "rosie@example.com", // Email address
  "Rosie", // Username
  "securepassword123", // Password
  new Map([
    ["work", new Calendar("work", "Work Calendar")],
    ["personal", new Calendar("personal", "Personal Calendar asdkjhbasjhdajshdjhasgd")],
    ["yeah", new Calendar("yeah", "School Calendar")],
  ]), // Initializes a map with two calendars
  [
    new Friend("yeah", "Rosie", ["yeah1", "yeah2", "yeah3"], C.FRIEND_STATUS.ACCEPTED), // Initializes friends list with one accepted friend
    new Friend("yeah", "Juan", ["yeah4", "yeah5", "yeah6"], C.FRIEND_STATUS.PENDING), // Another friend with a pending request
  ]
);


const CalendarHub: React.FC = () => {
  const [mondayDate, setMondayDate] = useState<Date>(F.getMostRecentMonday());
  const [toasts, setToasts] = useState<Map<string, Toast>>(new Map())
  const [warning, setWarning] = useState<Warning>(new Warning());
  const [calendars, setCalendars] = useState<Map<string, Calendar>>(USER.calendars);
  const calendar = useRef<Calendar>(USER.calendars.get("work")!);
  const asideRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);


  // Initialization logic and scroll synchronization effects
  useEffect(() => {
    calendar.current = new Calendar();
    setCalendars(new Map([[calendar.current.id, calendar.current]]));
  }, []);

  useEffect(() => {
    const syncScroll = () => {
      if (asideRef.current && mainRef.current) {
        const maxScrollTop = asideRef.current.scrollHeight - asideRef.current.clientHeight;
        const scrollTop = mainRef.current.scrollTop;

        if (scrollTop > maxScrollTop) {
          mainRef.current.scrollTop = maxScrollTop;
        }

        asideRef.current.scrollTop = mainRef.current.scrollTop;
      }
    };

    asideRef.current?.addEventListener('scroll', syncScroll);
    mainRef.current?.addEventListener('scroll', syncScroll);

    return () => {
      asideRef.current?.removeEventListener('scroll', syncScroll);
      mainRef.current?.removeEventListener('scroll', syncScroll);
    };
  }, []);


  const warningHandler: T.WarningHandler = {
    set: (newWarning: Warning): void => setWarning((prev) => ({ ...prev, ...newWarning })),
    close: (): void => setWarning({
      conflictEvents: null,
      currentEvent: null,
      recurringEvents: null,
      status: C.WARNING_STATUS.NONE,
    }),
  };


  const toastHandeler: T.ToastHandler = {
    push: (newToast: Toast): void => {
      setToasts((prevToasts) => {
        if (prevToasts.has(newToast.id)) return prevToasts;

        const updatedToasts = new Map(prevToasts);
        updatedToasts.set(newToast.id, newToast);

        return updatedToasts;
      });
    },

    pop: (): void => {
      setToasts((prevToasts) => {
        if (prevToasts.size === 0) return prevToasts;
        const updatedToasts = new Map(prevToasts);
        const lastKey = Array.from(updatedToasts.keys()).pop();
        if (lastKey) updatedToasts.delete(lastKey);
        return updatedToasts;
      });
    },

    getTail: (): Toast => {
      const toastsArray = Array.from(toasts.values());
      return toastsArray[toastsArray.length - 1];
    },
  }

  const weekHandler: T.WeekHandler = {
    next: () => setMondayDate(F.addDateBy(mondayDate, 7)),
    prev: () => setMondayDate(F.addDateBy(mondayDate, -7)),
    curr: () => setMondayDate(F.getMostRecentMonday()),
  };

  const calendarHandler: T.CalendarHandler = {
    setEvent: (event: Event) => {
      calendar.current.events.set(event.id, event);
      setCalendars((prevCalendars) => {
        const updatedCalendars = new Map(prevCalendars);
        updatedCalendars.set(calendar.current.id, { ...calendar.current });
        return updatedCalendars;
      });
    },
    deleteEvent: (event: Event) => {
      calendar.current.events.delete(event.id);
      setCalendars((prevCalendars) => {
        const updatedCalendars = new Map(prevCalendars);
        updatedCalendars.set(calendar.current.id, { ...calendar.current });
        return updatedCalendars;
      });
    },

    getEvents: () => calendars.get(calendar.current.id)!.events,

    setRecurringEvents: (recurringEvent: Event) => {
      const { startDate, endDate, selectedDays } = recurringEvent;
      const conflictEvents: Event[] = [];
      const newRecurringEvents: Event[] = [];

      for (let date = F.addDateBy(startDate, 1); date <= endDate!; date = F.addDateBy(date, 1)) {
        if (selectedDays[F.getDay(date)]) {
          const newEvent: Event = { ...recurringEvent, id: uuidv4(), date: new Date(date) };
          newRecurringEvents.push(newEvent);

          const newConflictEvents: Event[] = F.getConflictingEvents(newEvent, calendars.get(calendar.current.id)!.events);
          if (newConflictEvents.length > 0) newConflictEvents.forEach((newConflictEvent: Event) => conflictEvents.push(newConflictEvent));
        }
      }
      if (conflictEvents.length > 0) {
        warningHandler.set(new Warning(
          C.WARNING_STATUS.EVENT_CONFLICT,
          recurringEvent,
          conflictEvents,
          newRecurringEvents,
        ))
        return;
      }
      newRecurringEvents.forEach((event: Event) => calendarHandler.setEvent(event));
    }
  };

  const changeCalendarName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (newTitle.length > 18) {
      toastHandeler.push(new Toast("Calendar Name", "hi", C.TOAST_TYPE.INFO))
      return;
    };
    calendar.current.name = newTitle;
    setCalendars((prevCalendars) => {
      const updatedCalendars = new Map(prevCalendars);
      updatedCalendars.set(calendar.current.id, { ...calendar.current });
      return updatedCalendars;
    });
  };

  const setCalendarName = (name: string) => {
    console.log(name)
    calendar.current.name = name;
    setCalendars((prevCalendars) => {
      const updatedCalendars = new Map(prevCalendars);
      updatedCalendars.set(calendar.current.id, { ...calendar.current });
      return updatedCalendars;
    });
  };

  return <React.Fragment>
    <S.CalendarWrapperDiv>
      <S.PrintableContent>
        <S.CalendarContainerDiv>
          <CalendarHeader
            mondayDate={mondayDate}
            name={calendar.current.name}
            changeCalendarName={changeCalendarName}
            weekHandler={weekHandler}
          />
          <TimeColumnAside asideRef={asideRef} />
          <DaySection mondayDate={mondayDate} />
          <ScheduleGridMain
            mondayDate={mondayDate}
            events={calendarHandler.getEvents()}
            calendarHandler={calendarHandler}
            addToast={toastHandeler.push}
            mainRef={mainRef}
            warningHandeler={warningHandler}
          />
        </S.CalendarContainerDiv>
      </S.PrintableContent>
      <MenuAside
        setCalendarName={setCalendarName}
      />
    </S.CalendarWrapperDiv>
    {(toasts.size > 0) && <ToastMessage
      toast={toastHandeler.getTail()}
      popToast={toastHandeler.pop}
    />}
    {warning.status !== C.WARNING_STATUS.NONE && <WarningModal
      warning={warning}
      warningHandler={warningHandler}
      calendarHandler={calendarHandler}
    />}
  </React.Fragment>
};

export default CalendarHub;
