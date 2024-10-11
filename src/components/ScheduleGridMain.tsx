import React, { useState, useEffect, useRef } from 'react';
import * as S from '@/utils/style.calendar';
import * as F from '@/utils/functions';
import * as C from '@/utils/constants';
import * as T from "@/utils/types"
import * as I from "@/utils/icons"
import { Event, Time, Toast, User, Calendar } from '@/utils/classes';
import EventCard from './EventCard';
import EventModal from './EventModal';
import { v4 as uuidv4 } from 'uuid';
import { TOAST_TYPE } from '@/utils/constants';
import { throttle } from 'lodash';
import { strigifyDate } from "@/utils/functions"

const ScheduleGridMain: React.FC<{
    setEvent: (event: Event) => void;
    deleteEvent: (event: Event) => void;
    getEvents: (date: string) => Event[];
    pushToast: (id: string, description: string, type: TOAST_TYPE) => void;
    mondayDate: Date;
    mainRef: React.RefObject<HTMLDivElement>;
    isLinked: boolean;
}> = ({ mainRef, mondayDate, pushToast, isLinked, setEvent, getEvents, deleteEvent }) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isEventCreating, setIsEventCreating] = useState<boolean>(false);
    const [isEventResizingTop, setIsEventResizingTop] = useState<boolean>(false);
    const [isEventResizingBottom, setIsEventResizingBottom] = useState<boolean>(false);
    const [isEventDragging, setIsEventDragging] = useState<boolean>(false);
    const dragStartTime = useRef<Date>(new Date());
    const dragThreshold = useRef<boolean>(false);
    const columnDivRefs: React.RefObject<HTMLDivElement>[] = Array.from(
        { length: 7 },
        () => useRef<HTMLDivElement>(null)
    );


    const event = useRef<Event | null>(null);

    // Effect to update the 'HourLineDiv' every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const closeModal = (): void => {
        setIsModalOpen(false);
        event.current = null
    };
    const openModal = (): void => setIsModalOpen(true);

    // Handlers for mouse events
    const eventOnMouseDown = {
        drag: (e: React.MouseEvent<HTMLDivElement>, dragEvent: Event) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.button !== C.LEFT_MOUSE_CLICK) return;
            dragStartTime.current = new Date();
            dragThreshold.current = false;
            setIsEventDragging(true);
            event.current = { // Deep copying object attributes
                ...dragEvent,
                start: { ...dragEvent.start },
                end: { ...dragEvent.end },
                selectedDays: [...dragEvent.selectedDays]
            };
        },

        create: (e: React.MouseEvent<HTMLDivElement>, date: Date) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.button !== C.LEFT_MOUSE_CLICK) return;
            const newEventStart: Time = F.calculateEventTime(e, columnDivRefs[0]);
            if (F.isEventOverlapping(getEvents(F.strigifyDate(date)), newEventStart)) return;

            setIsEventCreating(true);
            event.current = structuredClone(new Event(strigifyDate(date), newEventStart))

        },


        bottom: (e: React.MouseEvent<HTMLDivElement>, resizeEvent: Event) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.button !== C.LEFT_MOUSE_CLICK) return;

            setIsEventResizingBottom(true);
            event.current = { ...resizeEvent, end: { ...resizeEvent.end } }; // Deep copying object attributes
        },

        top: (e: React.MouseEvent<HTMLDivElement>, resizeEvent: Event) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.button !== C.LEFT_MOUSE_CLICK) return;

            setIsEventResizingTop(true);
            event.current = { ...resizeEvent, start: { ...resizeEvent.start } };  // Deep copying object attributes
        },


    };


    const eventOnMouseMove = {
        drag: (e: React.MouseEvent<HTMLDivElement>, colRef: React.RefObject<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isEventDragging || e.button !== C.LEFT_MOUSE_CLICK || !event.current) return;

            dragThreshold.current = ((new Date().getTime() - dragStartTime.current.getTime()) >= C.DRAG_THRESHOLD);

            if (!dragThreshold.current) return;

            const previousStart = event.current.start;
            const previousEnd = event.current.end;

            if (!event.current.groupId) {
                // const currentEventDayWeek: number = F.getDay(event.current.date);
                // const enteredEventDayWeek: number = parseInt(colRef.current!.dataset.key as string);
                // event.current.date = F.strigifyDate(
                //     F.addDateBy(
                //         F.parseDateStringToUTC(event.current.date),
                //         Math.sign(enteredEventDayWeek - currentEventDayWeek)
                //     )
                // );
                // event.current.selectedDays = new Array(7).fill(false);
                // event.current.selectedDays[F.getDay(event.current.date)] = true;
            }

            const [start, end] = F.calculateTimeOnDrag(e, colRef, event.current);
            event.current.start = start;
            event.current.end = end;

            // Perform validation while dragging
            if (!F.isNewEventValid(event.current, getEvents(event.current.date))) {
                // If invalid, revert to the previous position
                event.current.start = previousStart;
                event.current.end = previousEnd;
                return;
            }

            setEvent(event.current);
        },

        create: (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.button !== C.LEFT_MOUSE_CLICK || !isEventCreating || !event.current) return;

            event.current.end = F.calculateEventTime(e, columnDivRefs[0]);
            event.current.height = F.calculateEventHeight(event.current);
            event.current.duration = F.calculateEventDuration(event.current.start, event.current.end);
            event.current.selectedDays[F.getDay(event.current.date)] = true;
            event.current.groupId = null;

            if (!F.isNewEventValid(event.current, getEvents(event.current.date))) return;
            setEvent(event.current);
        },

        bottom: (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.button !== C.LEFT_MOUSE_CLICK || !isEventResizingBottom || !event.current) return;

            event.current.end = F.calculateEventTime(e, columnDivRefs[0]);
            event.current.height = F.calculateEventHeight(event.current);
            event.current.duration = F.calculateEventDuration(event.current.start, event.current.end);

            if (!F.isNewEventValid(event.current, getEvents(event.current.date))) return;

            setEvent(event.current);
        },

        top: (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.button !== C.LEFT_MOUSE_CLICK || !isEventResizingTop || !event.current) return;

            event.current.start = F.calculateEventTime(e, columnDivRefs[0]);
            event.current.height = F.calculateEventHeight(event.current);
            event.current.duration = F.calculateEventDuration(event.current.start, event.current.end);

            if (!F.isNewEventValid(event.current, getEvents(event.current.date))) return;

            setEvent(event.current);
        },


    };

    const stopEventAction = (): void => {
        if (isEventCreating &&
            event.current &&
            F.isNewEventValid(event.current, getEvents(event.current.date))
        ) openModal();

        setIsEventCreating(false);
        setIsEventDragging(false);
        setIsEventResizingBottom(false);
        setIsEventResizingTop(false);
    };

    const eventOnClick = (e: React.MouseEvent<HTMLDivElement>, clickedEvent: Event): void => {
        e.preventDefault();
        e.stopPropagation();
        event.current = clickedEvent;
        openModal();
    };


    return <S.ContainerMain
        ref={mainRef}
        onMouseLeave={stopEventAction}
        onMouseUp={stopEventAction}
    >
        {columnDivRefs.map((colRef, index) => {
            const date: Date = F.addDateBy(mondayDate, index);
            const filteredEvents: Event[] = getEvents(F.strigifyDate(date));

            return <S.CellColumnDiv
                ref={colRef}
                data-key={index}
                key={index}
                onMouseDown={(e) => eventOnMouseDown.create(e, date)}
                onMouseMove={(e) => {
                    if (isEventCreating) eventOnMouseMove.create(e);
                    else if (isEventDragging) eventOnMouseMove.drag(e, colRef);
                    else if (isEventResizingTop) eventOnMouseMove.top(e);
                    else if (isEventResizingBottom) eventOnMouseMove.bottom(e);
                }}
            >
                {F.range(48).map((j) => <S.CellDiv key={j} />)}
                {filteredEvents.map((event: Event, idx: number) => (
                    <EventCard
                        key={idx}
                        event={event}
                        isEventDragging={isEventDragging}
                        eventOnMouseDown={eventOnMouseDown}
                        eventOnClick={dragThreshold.current == false ? eventOnClick : () => { }}
                        isLinked={isLinked}
                    />
                ))}
            </S.CellColumnDiv>
        })}
        <S.HourLineDiv
            $fromTop={F.calculateTopOffset(new Time(currentDate.getHours(), currentDate.getMinutes()))}
        />
        {isModalOpen && <EventModal
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            event={event}
            pushToast={pushToast}
            setEvent={setEvent}
            deleteEvent={deleteEvent}
        />}

    </S.ContainerMain>

};

export default ScheduleGridMain;
