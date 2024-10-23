"use client"
import React, { useState, useEffect, useRef } from "react";
import CalendarHeader from "@/components/CalendarHeader"
import TimeColumnAside from "@/components/TimeColumnAside"
import DaySection from "@/components/DaySection"
import ScheduleGridMain from "@/components/ScheduleGridMain";
import MenuAside from "@/components/MenuAside";
import { StatusModal } from "@/components/StatusModal";
import useToast from "@/hooks/useToast";
import { Calendar, calendarId } from "@/classes/Calendar";
import { MyDate, stringifiedDate } from "@/classes/MyDate";
import { Event } from "@/classes/Event";
import { RecurringDetails, recurringId } from "@/classes/RecurringDetails"
import EventModal from "@/components/EventModal"

import * as S from "@/utils/style.calendar";

export default function Calendars() {
    const calendar: Calendar = new Calendar("1", "yes", null);
    const calendarId: calendarId = calendar.getCalendarId();
    const [calendars, setCalendars] = useState<Map<calendarId, Calendar>>(new Map([[calendarId, calendar]]));
    const [isEventModal, setIsEventModal] = useState<boolean>(false);
    const [monday, setMonday] = useState<MyDate>(new MyDate(true));
    const asideRef = useRef<HTMLDivElement | null>(null);
    const mainRef = useRef<HTMLDivElement | null>(null);
    const event = useRef<Event | null>(null);
    const { pushToast, ToastComponent, TOAST_TYPE } = useToast();

    // const [linkedCalendar, setLinkedCalendar] = useState<string>("")
    // const [linkIcon, setLinkIcon] = useState<string>(I.linkOut.src)

    // const [status, setStatus] = useState<STATUS>(STATUS.OK);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null);

    // const calendarId = '1';
    // const userId = "juan_id";

    // useEffect(() => {
    //     const fetchCalendar = async () => {
    //         try {
    //             const response = await fetch(`/api/${userId}/calendars/`);

    //             if (!response.ok) throw new Error('Failed to fetch calendar');
    //             const data = await response.json();
    //             console.log(data);
    //         }
    //         catch (err) {
    //             if (err instanceof Error) setError(err.message);
    //             else setError("An unexpected error occurred");
    //         }
    //         finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchCalendar();
    // }, [calendarId]);

    // const toggleLink = (): void => {
    //     const icon: string = (linkIcon === I.linkIn.src) ? I.linkOut.src : I.linkIn.src;
    //     setLinkIcon(icon);
    // }

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

    const prevWeek = (): void => setMonday((prev) => { prev.addBy(-7); return new MyDate(prev); });
    const nextWeek = (): void => setMonday((prev) => { prev.addBy(7); return new MyDate(prev); });
    const currWeek = (): void => setMonday(new MyDate(true));


    // const setTimeZoneSelect = (timeZone: string): void => setTimeZone(timeZone)

    // const setLinkedCalendarFriend = (e: React.ChangeEvent<HTMLSelectElement>): void => setLinkedCalendar(e.target.value)

    const getCurrentCalendar = (): Calendar => calendars!.get(calendarId) as Calendar;

    const getEvents = (date: stringifiedDate): Event[] => getCurrentCalendar().getEventsByDate(date);

    const getRecurringdDetails = (recurringId: recurringId): RecurringDetails | null => getCurrentCalendar().getRecurringDetails(recurringId);

    const setEvent = (eventToSet: Event, recurringDetails: RecurringDetails | null): void => {
        setCalendars((prevCalendars: Map<string, Calendar>): Map<string, Calendar> => {
            const currentCalendar: Calendar = getCurrentCalendar();
            currentCalendar.setEvent(eventToSet, recurringDetails);
            const updatedCalendars: Map<string, Calendar> = new Map(prevCalendars);
            updatedCalendars.set(calendarId, currentCalendar);
            return updatedCalendars;
        });
    }

    const closeModal = (): void => {
        event.current = null;
        setIsEventModal(false)
    };

    const openModal = (): void => {
        setIsEventModal(true)
    };


    return <React.Fragment >
        <S.CalendarWrapperDiv>
            <S.CalendarContainerDiv>
                <CalendarHeader
                    monday={monday}
                    nextWeek={nextWeek}
                    prevWeek={prevWeek}
                    currWeek={currWeek}
                // linkIcon={linkIcon}
                // toggleLink={toggleLink}
                // setTimeZoneSelect={setTimeZoneSelect}
                />
                <TimeColumnAside asideRef={asideRef} />
                <DaySection monday={monday} />
                <ScheduleGridMain
                    monday={monday}
                    setEvent={setEvent}
                    getEvents={getEvents}
                    mainRef={mainRef}
                    openModal={openModal}
                    closeModal={closeModal}
                    event={event}
                // pushToast={pushToast}
                // isLinked={(linkIcon === I.linkIn.src)}
                />
            </S.CalendarContainerDiv>
            {/* <MenuAside
                // setCalendarName={setCalendarName}
                setLinkedCalendar={setLinkedCalendarFriend}
            /> */}
        </S.CalendarWrapperDiv>
        {isEventModal && <EventModal
            isEventModal={isEventModal}
            closeModal={closeModal}
            event={event}
            setEvent={setEvent}
            getRecurringdDetails={getRecurringdDetails}
        // pushToast={pushToast}
        // deleteEvent={deleteEvent}
        />}
        {/* <ToastComponent /> */}
        {/* {(status !== STATUS.OK) && <StatusModal
            status={status}
            conflictDetails={getCurrentCalendar().getConflictDetails()}
            cancelEventRevisions={cancelEventRevisions}
            commitEventRevisions={commitEventRevisions}
        />} */}
    </React.Fragment >
};

