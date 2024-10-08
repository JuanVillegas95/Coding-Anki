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
import WarningModal from "@/components/WarningModal";
import * as C from '@/utils/constants';
import * as F from '@/utils/functions';
import * as T from '@/utils/types';
import * as I from '@/utils/icons';
import * as S from '@/utils/style.calendar';

import { STATUS } from "@/utils/constants";

const currentCalendar = new Calendar("yes", "hi");

export default function CalendarHub() {
    const [calendars, setCalendars] = useState<Map<string, Calendar>>(new Map([[currentCalendar.id, currentCalendar]]));
    const [mondayDate, setMondayDate] = useState<Date>(F.getMostRecentMonday());
    const [toasts, setToasts] = useState<Map<string, Toast>>(new Map())
    const [linkedCalendar, setLinkedCalendar] = useState<string>("")
    const [linkIcon, setLinkIcon] = useState<string>(I.linkOut.src)
    const asideRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const [status, setStatus] = useState<STATUS>(STATUS.OK);

    useEffect(() => {

        // const fetchUserData = async (): Promise<void> => {
        //   try {
        //     if (!pathname) return;
        //     const userId: string | undefined = pathname.split('/').pop();
        //     console.log(userId)
        //     const response = await fetch(`/calendar${userId}/api?userId=${userId}`);
        //     // const data: UserData = await response.json();

        //     if (response.ok) {
        //       // router.replace(`/calendar?userId=${data.user.id}`);
        //     }
        //     else {
        //       // Means i have to create the user
        //     }
        //   } catch (error) {

        //   }
        // }
        // fetchUserData();
    }, [pathname])

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


    const setLinkedCalendarFriend = (event: React.ChangeEvent<HTMLSelectElement>): void => setLinkedCalendar(event.target.value)

    const setEvent = (eventToSet: Event): void => {
        const currentCalendar: Calendar = getCurrentCalendar();
        const newStatus: STATUS = currentCalendar.auditStatus(eventToSet); // Get the new status value
        setStatus(newStatus);

        if (newStatus === STATUS.OK) {
            console.log(newStatus);
            setCalendars((prevCalendars: Map<string, Calendar>): Map<string, Calendar> => {
                currentCalendar.commitEventRevisions();
                const updatedCalendars: Map<string, Calendar> = new Map(prevCalendars);
                updatedCalendars.set(currentCalendar.id, currentCalendar);
                return updatedCalendars;
            });
        }
    };


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
                    addToast={toastHandeler.push}
                    mainRef={mainRef}
                    isLinked={(linkIcon === I.linkIn.src)}
                />
            </S.CalendarContainerDiv>
            <MenuAside
                // setCalendarName={setCalendarName}
                setLinkedCalendar={setLinkedCalendarFriend}
            />
        </S.CalendarWrapperDiv>
        {(toasts.size > 0) && <ToastMessage
            toast={toastHandeler.getTail()}
            popToast={toastHandeler.pop}
        />}
        {/* {
      (warning.status !== C.WARNING_STATUS.NONE) && <WarningModal
        warning={warning}
        warningHandler={warningHandler}
        calendarHandler={calendarHandler}
      />
    } */}
    </React.Fragment >
};

