'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Event, Calendar, Toast } from '@/utils/CalendarHub/classes';
import CalendarHeader from "@/components/CalendarHeader"
import TimeColumnAside from "@/components/TimeColumnAside"
import DaySection from "@/components/DaySection"
import ScheduleGridMain from "@/components/ScheduleGridMain";
import MenuAside from "@/components/MenuAside";
import ToastMessage from "@/components/ToastMessage";
import * as C from '@/utils/CalendarHub/constants';
import * as F from '@/utils/CalendarHub/functions';
import * as S from '@/styles/CalendarHub.styles';

const CalendarHub: React.FC = () => {
  const [calendars, setCalendars] = useState<Map<string, Calendar>>(C.NULL_CALENDARS);
  const [mondayDate, setMondayDate] = useState<Date>(F.getMostRecentMonday());
  const [toasts, setToasts] = useState<Map<string, Toast>>(new Map())

  const calendar = useRef<Calendar>(C.NULL_CALENDAR);
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

  const toastHandeler: {
    push: (newToast: Toast) => void;
    pop: () => void;
    getTail: () => Toast;
  } = {
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

  const weekHandler = {
    nextWeek: () => setMondayDate(F.addDateBy(mondayDate, 7)),
    previousWeek: () => setMondayDate(F.addDateBy(mondayDate, -7)),
    currentWeek: () => setMondayDate(F.getMostRecentMonday()),
  };

  const calendarHandler = {
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
  };

  const changeCalendarName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (newTitle.length > 18) {
      toastHandeler.push(new Toast("Calendar Name", "hi", "info"))
      return;
    };
    calendar.current.name = newTitle;
    setCalendars((prevCalendars) => {
      const updatedCalendars = new Map(prevCalendars);
      updatedCalendars.set(calendar.current.id, { ...calendar.current });
      return updatedCalendars;
    });
  };

  return <S.CalendarWrapperDiv>
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
        />
      </S.CalendarContainerDiv>
    </S.PrintableContent>
    <MenuAside />
    {
      (toasts.size > 0) && (
        <ToastMessage
          toast={toastHandeler.getTail()}
          popToast={toastHandeler.pop}
        />)
    }
  </S.CalendarWrapperDiv>
};

export default CalendarHub;
