"use client"
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';
import { Event, Calendar, Toast, User } from "@/utils/classes";
import { v4 as uuidv4 } from 'uuid';
import CalendarHeader from "@/components/CalendarHeader"
import TimeColumnAside from "@/components/TimeColumnAside"
import DaySection from "@/components/DaySection"
import ScheduleGridMain from "@/components/ScheduleGridMain";
import MenuAside from "@/components/MenuAside";
import ToastMessage from "@/components/ToastMessage";
import { StatusModal } from "@/components/StatusModal";
import useToast from "@/hooks/useToast";
import * as C from '@/utils/constants';
import * as F from '@/utils/functions';
import * as T from '@/utils/types';
import * as I from '@/utils/icons';
import * as S from '@/utils/style.calendar';

import { STATUS } from "@/utils/constants";

const currentCalendar = new Calendar("yes", "hi");
const currentCalId: string = currentCalendar.getId()
export default function Calendars() {
    const [calendars, setCalendars] = useState<Map<string, Calendar>>(new Map([[currentCalId, currentCalendar]]));
    const [mondayDate, setMondayDate] = useState<Date>(F.getMostRecentMonday());
    const [toasts, setToasts] = useState<Map<string, Toast>>(new Map())
    const [linkedCalendar, setLinkedCalendar] = useState<string>("")
    const [linkIcon, setLinkIcon] = useState<string>(I.linkOut.src)
    const asideRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<STATUS>(STATUS.OK);
    const { pushToast, ToastComponent } = useToast();

    const [timeZone, setTimeZone] = useState<string>("")


    const [calendar, setCalendar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const calendarId = '1';
    const userId = "juan_id";

    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const response = await fetch(`/api/${userId}/calendars/`);

                if (!response.ok) throw new Error('Failed to fetch calendar');
                const data = await response.json();
                console.log(data);
            }
            catch (err) {
                if (err instanceof Error) setError(err.message);
                else setError("An unexpected error occurred");
            }
            finally {
                setLoading(false);
            }
        };

        fetchCalendar();
    }, [calendarId]);

    const toggleLink = (): void => {
        const icon: string = (linkIcon === I.linkIn.src) ? I.linkOut.src : I.linkIn.src;
        setLinkIcon(icon);
    }

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


    const weekHandler: T.WeekHandler = {
        next: () => setMondayDate(F.addDateBy(mondayDate, 7)),
        prev: () => setMondayDate(F.addDateBy(mondayDate, -7)),
        curr: () => setMondayDate(F.getMostRecentMonday()),
    };

    const setTimeZoneSelect = (timeZone: string): void => setTimeZone(timeZone)

    const setLinkedCalendarFriend = (e: React.ChangeEvent<HTMLSelectElement>): void => setLinkedCalendar(e.target.value)

    const setEvent = (eventToSet: Event): void => {
        const currentCalendar: Calendar = getCurrentCalendar();
        const newStatus: STATUS = currentCalendar.auditStatus(eventToSet);
        if (newStatus === STATUS.OK) commitEventRevisions();
        else setStatus(newStatus)
    };

    const commitEventRevisions = (): void => {
        setStatus(STATUS.OK)
        setCalendars((prevCalendars: Map<string, Calendar>): Map<string, Calendar> => {
            const currentCalendar: Calendar = getCurrentCalendar();
            currentCalendar.commitEventRevisions();
            currentCalendar.clearEventStates()
            const updatedCalendars: Map<string, Calendar> = new Map(prevCalendars);
            updatedCalendars.set(currentCalId, currentCalendar);
            return updatedCalendars;
        });
    }

    const cancelEventRevisions = (): void => {
        setStatus(STATUS.OK)
        setCalendars((prevCalendars: Map<string, Calendar>): Map<string, Calendar> => {
            const currentCalendar: Calendar = getCurrentCalendar();
            currentCalendar.clearEventStates();
            const updatedCalendars: Map<string, Calendar> = new Map(prevCalendars);
            updatedCalendars.set(currentCalId, currentCalendar);
            return updatedCalendars;
        });
    }

    const deleteEvent = (event: Event): void => {
        const currentCalendar: Calendar = getCurrentCalendar();
        currentCalendar.deleteEventSubmit(event);
        setCalendars((prevCalendars: Map<string, Calendar>): Map<string, Calendar> => {
            const updatedCalendars: Map<string, Calendar> = new Map(prevCalendars);
            updatedCalendars.set(currentCalId, currentCalendar);
            return updatedCalendars;
        });
    };

    const getCurrentCalendar = (): Calendar => calendars!.get(currentCalId) as Calendar;

    const getEvents = (date: string): Event[] => getCurrentCalendar().getEventsByDate(date);



    return <React.Fragment >
        <S.CalendarWrapperDiv>
            <S.CalendarContainerDiv>
                <CalendarHeader
                    mondayDate={mondayDate}
                    weekHandler={weekHandler}
                    linkIcon={linkIcon}
                    toggleLink={toggleLink}
                    setTimeZoneSelect={setTimeZoneSelect}
                />
                <TimeColumnAside asideRef={asideRef} />
                <DaySection mondayDate={mondayDate} />
                <ScheduleGridMain
                    setEvent={setEvent}
                    deleteEvent={deleteEvent}
                    getEvents={getEvents}
                    mondayDate={mondayDate}
                    pushToast={pushToast}
                    mainRef={mainRef}
                    isLinked={(linkIcon === I.linkIn.src)}
                />
            </S.CalendarContainerDiv>
            <MenuAside
                // setCalendarName={setCalendarName}
                setLinkedCalendar={setLinkedCalendarFriend}
            />
        </S.CalendarWrapperDiv>
        <ToastComponent />
        {(status !== STATUS.OK) && <StatusModal
            status={status}
            conflictDetails={getCurrentCalendar().getConflictDetails()}
            cancelEventRevisions={cancelEventRevisions}
            commitEventRevisions={commitEventRevisions}
        />}
    </React.Fragment >
};

