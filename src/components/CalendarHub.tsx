import React, { useState, useEffect, useRef } from "react";
import { Event, Calendar, Toast, Warning, User } from "@/utils/classes";
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
import * as T from '@/utils/types';
import * as I from '@/utils/icons';
import * as S from '@/utils/style.calendar';

const USER: User = new User(
  "a", // Generating a unique user ID
  "Rosie", // Username
  new Map([
    ["work", new Calendar("work", "Work Calendar")],
    ["personal", new Calendar("personal", "Personal Calendar asdkjhbasjhdajshdjhasgd")],
    ["yeah", new Calendar("yeah", "School Calendar")],
  ]), // Initializes a map with two calendars
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

  // useEffect(() => {
  //   console.log(calendar.current)

  // }, [calendars])

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


    // !ABOUT TO ABSTRACT THE LOGIC OF THIS
    // Remember here you are dealing either with modifying or creating and potential conflicts
    setRecurringEvents: (recurringEvent: Event) => {
      const { startDate, endDate, selectedDays, groupID } = recurringEvent;
      const existingEvents: Event[] = calendarHandler.getEventsByGroupID(groupID!);

      // Filter Events
      const eventsToModify: Event[] = [];
      const eventsToDelete: Event[] = [];
      const eventsToCreate: Event[] = [];
      const eventsToSet: Event[] = [];
      const conflictEvents: Event[] = [];

      if (existingEvents.length > 0) {
        // warningHandler.set(new Warning(C.WARNING_STATUS.EVENT_MODIFY,))
        const existingEventSample = existingEvents[0]; // All recurring events maintain the same selected days
        for (let day = 0; day < 7; day++) {
          // Modify existing events if the day remains selected (was true, stays true).
          if (existingEventSample.selectedDays[day] === true && recurringEvent.selectedDays[day] === true) {
            // From that day in the groupID I want the unique IDs of those events to modify them.
            const idsToModify: Set<string> = calendar.current.recurringEventIDs[day].get(groupID!)!;
            idsToModify.forEach((id: string) => {
              const eventToModify = calendar.current.events.get(id)!; // eventToModify has the reference of the event to avoid mutation
              const modifiedEvent: Event = { ...recurringEvent, id: recurringEvent.id, date: recurringEvent.date };
              modifiedEvent.id = eventToModify.id;
              modifiedEvent.date = eventToModify.date;
              eventsToModify.push(modifiedEvent);
            });
          }
          // Delete existing events for the unselected day (was true, now false)
          else if (existingEventSample.selectedDays[day] === true && recurringEvent.selectedDays[day] === false) {
            // From that day in the groupID I want the unique IDs of those events to delete them.
            const idsToDelete: Set<string> = calendar.current.recurringEventIDs[day].get(groupID!)!;
            idsToDelete.forEach((id: string) => eventsToDelete.push(calendar.current.events.get(id)!));
          }
        }

        for (let date = F.addDateBy(startDate, 1); date <= endDate!; date = F.addDateBy(date, 1)) {
          const day: number = F.getDay(date);
          // Create new events for the newly selected day (was false, now true)
          if (existingEventSample.selectedDays[day] === false && recurringEvent.selectedDays[day] === true) {
            const newEvent: Event = { ...recurringEvent, id: recurringEvent.id, date: recurringEvent.date };
            newEvent.id = uuidv4(); // new unique Id
            newEvent.date = new Date(date); // its date
            eventsToCreate.push(newEvent); // everything remains the same just add it
          }
        }
        // Concatenate both arrays.
        eventsToModify.forEach((event: Event) => eventsToSet.push(event));
        eventsToCreate.forEach((event: Event) => eventsToSet.push(event));
        // Dont forget to update both data structres
        eventsToDelete.forEach((event: Event) => {
          calendarHandler.deleteEvent(event)
          calendarHandler.deleteRecurringEventID(event)
        })
      } else {
        eventsToSet.push(recurringEvent);
        for (let date = F.addDateBy(startDate, 1); date <= endDate!; date = F.addDateBy(date, 1)) {
          const day: number = F.getDay(date);
          // Create new events for the newly selected day (was false, now true)
          if (recurringEvent.selectedDays[day] === false) continue;
          const newEvent: Event = { ...recurringEvent, id: recurringEvent.id, date: recurringEvent.date };
          newEvent.id = uuidv4();
          newEvent.date = new Date(date); // its date
          eventsToSet.push(newEvent); // everything remains the same just add it
        }
      }

      eventsToSet.forEach((event: Event) => {
        conflictEvents.concat(F.getConflictingEvents(event, calendarHandler.getEvents()))
      });

      // Because here I have a return the handaling of events is delegated to Warning Handeler
      if (conflictEvents.length > 0) {
        warningHandler.set(new Warning(
          C.WARNING_STATUS.EVENT_CONFLICT,
        ))
        return;
      }

      // Dont forget to update both data structres
      eventsToSet.forEach((event: Event) => {
        calendarHandler.setEvent(event);
        calendarHandler.setReccurringEventIDs(event);
      });
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


    getEventsByGroupID: (groupID: string): Event[] => {
      const recurringEventsIDs: string[] = [];

      Object.values(calendar.current.recurringEventIDs).forEach((map) => {
        const groupEventIDs: Set<string> | undefined = map.get(groupID!);
        if (groupEventIDs) {
          groupEventIDs.forEach((id: string) => recurringEventsIDs.push(id));
        }
      });

      const groupEvents: Event[] = [];
      recurringEventsIDs.forEach((id: string) => {
        const event = calendar.current.events!.get(id);
        if (event) groupEvents.push(event);
      });

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

  return <React.Fragment >
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
    />
    }
    {
      (warning.status !== C.WARNING_STATUS.NONE) && <WarningModal
        warning={warning}
        warningHandler={warningHandler}
        calendarHandler={calendarHandler}
      />
    }
  </React.Fragment >
};

export default CalendarHub;
