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

export default function Calendars() {
    const [calendars, setCalendars] = useState<Map<string, Calendar>>(new Map([[currentCalendar.id, currentCalendar]]));
    const [mondayDate, setMondayDate] = useState<Date>(F.getMostRecentMonday());
    const [toasts, setToasts] = useState<Map<string, Toast>>(new Map())
    const [linkedCalendar, setLinkedCalendar] = useState<string>("")
    const [linkIcon, setLinkIcon] = useState<string>(I.linkOut.src)
    const asideRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<STATUS>(STATUS.OK);
    const { pushToast, ToastComponent } = useToast();


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


    const setLinkedCalendarFriend = (event: React.ChangeEvent<HTMLSelectElement>): void => setLinkedCalendar(event.target.value)

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
            updatedCalendars.set(currentCalendar.id, currentCalendar);
            return updatedCalendars;
        });
    }

    const cancelEventRevisions = (): void => {
        setStatus(STATUS.OK)
        setCalendars((prevCalendars: Map<string, Calendar>): Map<string, Calendar> => {
            const currentCalendar: Calendar = getCurrentCalendar();
            currentCalendar.clearEventStates();
            const updatedCalendars: Map<string, Calendar> = new Map(prevCalendars);
            updatedCalendars.set(currentCalendar.id, currentCalendar);
            return updatedCalendars;
        });
    }

    const deleteEvent = (event: Event): void => {
        const currentCalendar: Calendar = getCurrentCalendar();
        currentCalendar.deleteEventSubmit(event);
        setCalendars((prevCalendars: Map<string, Calendar>): Map<string, Calendar> => {
            const updatedCalendars: Map<string, Calendar> = new Map(prevCalendars);
            updatedCalendars.set(currentCalendar.id, currentCalendar);
            return updatedCalendars;
        });
    };

    const getCurrentCalendar = (): Calendar => calendars!.get(currentCalendar.id) as Calendar;

    const getEvents = (date: string): Event[] => getCurrentCalendar().getEventsByDate(date);



    return <React.Fragment >
        <S.CalendarWrapperDiv>
            <S.CalendarContainerDiv>
                <CalendarHeader
                    mondayDate={mondayDate}
                    weekHandler={weekHandler}
                    linkIcon={linkIcon}
                    toggleLink={toggleLink}
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

