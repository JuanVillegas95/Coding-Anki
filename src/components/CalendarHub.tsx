'use client';
import React, { useState, useEffect, useRef } from "react";
import { Event, Calendar, Toast, Warning, User, Friend } from "@/utils/classes";
import { v4 as uuidv4 } from 'uuid';
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
import * as I from '@/utils/icons';

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
  const [linkedCalendar, setLinkedCalendar] = useState<string>("")
  const [linkIcon, setLinkIcon] = useState<string>(I.linkOut.src)
  const calendar = useRef<Calendar>(USER.calendars.get("work")!);
  const asideRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const toggleLink = (): void => {
    const icon: string = (linkIcon === I.linkIn.src) ? I.linkOut.src : I.linkIn.src;
    setLinkIcon(icon);
  }


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
      beforeDragEvent: null,
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
          const newEvent: Event = { ...recurringEvent, id: recurringEvent.id, date: recurringEvent.date };
          newEvent.id = uuidv4();
          newEvent.date = new Date(date);
          newRecurringEvents.push(newEvent);

          const newConflictEvents: Event[] = F.getConflictingEvents(newEvent, calendars.get(calendar.current.id)!.events);
          if (newConflictEvents.length > 0) newConflictEvents.forEach((newConflictEvent: Event) => conflictEvents.push(newConflictEvent));
        }
      }
      // Because here I have a return the handaling of events is delegated to Warning Handeler
      if (conflictEvents.length > 0) {
        warningHandler.set(new Warning(
          C.WARNING_STATUS.EVENT_CONFLICT,
          recurringEvent,
          conflictEvents,
          newRecurringEvents,
        ))
        return;
      }
      newRecurringEvents.forEach((event: Event) => {
        calendarHandler.setEvent(event);
        calendarHandler.setReccurringEventIDs(event);
      });
      calendarHandler.setReccurringEventIDs(recurringEvent);
    },

    setReccurringEventIDs: (event: Event): void => {
      const { id, groupID, date } = event;
      const day = F.getDay(date);

      // Get the current day's Map for recurring events
      let dayGroupId: Map<string, Set<string>> = calendar.current.recurringEventIDs[day];

      // Get the set of event IDs for the group, or create a new set if it doesn't exist
      let dayEventIDs: Set<string> | undefined = dayGroupId.get(groupID!);
      if (!dayEventIDs) {
        dayEventIDs = new Set();
        dayGroupId.set(groupID!, dayEventIDs); // Ensure to set the groupID with the new Set
      }

      // Add the event ID to the set of IDs (Set ensures no duplicates)
      dayEventIDs.add(id);
      // Update the state for the calendars
      setCalendars((prevCalendars) => {
        const updatedCalendars = new Map(prevCalendars);
        updatedCalendars.set(calendar.current.id, { ...calendar.current });
        return updatedCalendars;
      });
    },


    getReccurringEventIDs: (event: Event): Event[] => {
      const { id, groupID } = event;

      const recurringEventsIDs: string[] = [];
      Object.values(calendar.current.recurringEventIDs).forEach((map) => {
        const gorupEventsIDs: Set<string> | undefined = map.get(groupID!);
        if (gorupEventsIDs) {
          gorupEventsIDs.forEach((id: string) => {
            recurringEventsIDs.push(id)
          })
        }

      })

      const groupEvents: Event[] = []
      recurringEventsIDs.forEach((id: string) => groupEvents.push(calendar.current.events!.get(id)!))
      return groupEvents;
    },

    deleteRecurringEventID: (event: Event): void => {
      const { groupID, id } = event

      // Get the day's Map of group IDs
      const dayGroupId: Map<string, Set<string>> | undefined = calendar.current.recurringEventIDs[F.getDay(event.date)];

      // If there are no groups for the given day, exit early
      if (!dayGroupId) return;

      // Get the set of event IDs for the specified group
      const dayEventIDs: Set<string> | undefined = dayGroupId.get(groupID!);

      // If no event IDs exist for the given group, exit early
      if (!dayEventIDs) return;

      // Remove the event ID from the set
      dayEventIDs.delete(id);

      // If the set becomes empty after deletion, remove the groupID from the day's Map
      if (dayEventIDs.size === 0) {
        dayGroupId.delete(groupID!);
      }

      // Update the state for the calendars
      setCalendars((prevCalendars) => {
        const updatedCalendars = new Map(prevCalendars);
        updatedCalendars.set(calendar.current.id, { ...calendar.current });
        return updatedCalendars;
      });
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
    calendar.current.name = name;
    setCalendars((prevCalendars) => {
      const updatedCalendars = new Map(prevCalendars);
      updatedCalendars.set(calendar.current.id, { ...calendar.current });
      return updatedCalendars;
    });
  };


  const setLinkedCalendarFriend = (event: React.ChangeEvent<HTMLSelectElement>): void => setLinkedCalendar(event.target.value)

  return <React.Fragment>
    <S.CalendarWrapperDiv>
      <S.CalendarContainerDiv>
        <CalendarHeader
          mondayDate={mondayDate}
          name={calendar.current.name}
          changeCalendarName={changeCalendarName}
          weekHandler={weekHandler}
          linkIcon={linkIcon}
          toggleLink={toggleLink}
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
          isLinked={(linkIcon === I.linkIn.src)}
        />
      </S.CalendarContainerDiv>
      <MenuAside
        setCalendarName={setCalendarName}
        setLinkedCalendar={setLinkedCalendarFriend}
      />
    </S.CalendarWrapperDiv>
    {(toasts.size > 0) && <ToastMessage
      toast={toastHandeler.getTail()}
      popToast={toastHandeler.pop}
    />}
    {(warning.status !== C.WARNING_STATUS.NONE) && <WarningModal
      warning={warning}
      warningHandler={warningHandler}
      calendarHandler={calendarHandler}
    />}
  </React.Fragment>
};

export default CalendarHub;
