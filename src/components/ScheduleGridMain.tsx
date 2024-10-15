import React, { useState, useEffect, useRef } from 'react';
import * as S from '../utils/style.calendar';
import EventCard from './EventCard';
import { Event } from "@/classes/Event";
import { MyDate, stringifiedDate } from "@/classes/MyDate"
import { MyTime, hoursMinutes, pixels } from '@/classes/MyTime';

const LEFT_MOUSE_CLICK: number = 0;

const ScheduleGridMain: React.FC<{
    monday: MyDate;
    setEvent: (eventToSet: Event) => void;
    getEvents: (date: stringifiedDate) => Event[];
    // pushToast: (id: string, description: string, type: TOAST_TYPE) => void;
    mainRef: React.RefObject<HTMLDivElement>;
    // isLinked: boolean;
}> = ({ mainRef, monday, setEvent, getEvents }) => {
    // const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isCreate, setIsCreate] = useState<boolean>(false);
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


    // const closeModal = (): void => {
    //     setIsModalOpen(false);
    //     event.current = null
    // };
    // const openModal = (): void => setIsModalOpen(true);

    const createOnMouseDown = (e: React.MouseEvent<HTMLDivElement>, columnDate: MyDate) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.button !== LEFT_MOUSE_CLICK) return;
        const distanceFromTop: pixels = (e.clientY - columnDivRefs[0].current!.getBoundingClientRect().top);
        const startTime: MyTime = new MyTime(distanceFromTop);
        if (Event.isOverlapping(getEvents(columnDate.getStringifiedDate()), startTime)) return;

        setIsCreate(true);
        event.current = new Event(columnDate, startTime);
    }

    const createOnMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.button !== LEFT_MOUSE_CLICK || !isCreate || !event.current) return;

        const distanceFromTop: pixels = (e.clientY - columnDivRefs[0].current!.getBoundingClientRect().top);
        const endTime: MyTime = new MyTime(distanceFromTop);
        event.current.setEndTime(endTime);
        console.log(event.current.getSummary())
        if (event.current.getDurationMinutes() < Event.VALID_MINUTES) return;
        setEvent(event.current);
    }

    // // Handlers for mouse events
    // const eventOnMouseDown = {
    //     drag: (e: React.MouseEvent<HTMLDivElement>, dragEvent: Event) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         if (e.button !== C.LEFT_MOUSE_CLICK) return;
    //         dragStartTime.current = new Date();
    //         dragThreshold.current = false;
    //         setIsEventDragging(true);
    //         event.current = { // Deep copying object attributes
    //             ...dragEvent,
    //             start: { ...dragEvent.start },
    //             end: { ...dragEvent.end },
    //             selectedDays: [...dragEvent.selectedDays]
    //         };
    //     },

    //     bottom: (e: React.MouseEvent<HTMLDivElement>, resizeEvent: Event) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         if (e.button !== C.LEFT_MOUSE_CLICK) return;

    //         setIsEventResizingBottom(true);
    //         event.current = { ...resizeEvent, end: { ...resizeEvent.end } }; // Deep copying object attributes
    //     },

    //     top: (e: React.MouseEvent<HTMLDivElement>, resizeEvent: Event) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         if (e.button !== C.LEFT_MOUSE_CLICK) return;

    //         setIsEventResizingTop(true);
    //         event.current = { ...resizeEvent, start: { ...resizeEvent.start } };  // Deep copying object attributes
    //     },


    // };

    // const eventOnMouseMove = {
    //     drag: (e: React.MouseEvent<HTMLDivElement>, colRef: React.RefObject<HTMLDivElement>) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         if (!isEventDragging || e.button !== C.LEFT_MOUSE_CLICK || !event.current) return;

    //         dragThreshold.current = ((new Date().getTime() - dragStartTime.current.getTime()) >= C.DRAG_THRESHOLD);

    //         if (!dragThreshold.current) return;

    //         const previousStart = event.current.start;
    //         const previousEnd = event.current.end;

    //         if (!event.current.groupId) {
    //             // const currentEventDayWeek: number = F.getDay(event.current.date);
    //             // const enteredEventDayWeek: number = parseInt(colRef.current!.dataset.key as string);
    //             // event.current.date = F.strigifyDate(
    //             //     F.addDateBy(
    //             //         F.parseDateStringToUTC(event.current.date),
    //             //         Math.sign(enteredEventDayWeek - currentEventDayWeek)
    //             //     )
    //             // );
    //             // event.current.selectedDays = new Array(7).fill(false);
    //             // event.current.selectedDays[F.getDay(event.current.date)] = true;
    //         }

    //         const [start, end] = F.calculateTimeOnDrag(e, colRef, event.current);
    //         event.current.start = start;
    //         event.current.end = end;

    //         // Perform validation while dragging
    //         if (!F.isNewEventValid(event.current, getEvents(event.current.date))) {
    //             // If invalid, revert to the previous position
    //             event.current.start = previousStart;
    //             event.current.end = previousEnd;
    //             return;
    //         }

    //         setEvent(event.current);
    //     },

    //     bottom: (e: React.MouseEvent<HTMLDivElement>) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         if (e.button !== C.LEFT_MOUSE_CLICK || !isEventResizingBottom || !event.current) return;

    //         event.current.end = F.calculateEventTime(e, columnDivRefs[0]);
    //         event.current.height = F.calculateEventHeight(event.current);
    //         event.current.duration = F.calculateEventDuration(event.current.start, event.current.end);

    //         if (!F.isNewEventValid(event.current, getEvents(event.current.date))) return;

    //         setEvent(event.current);
    //     },

    //     top: (e: React.MouseEvent<HTMLDivElement>) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         if (e.button !== C.LEFT_MOUSE_CLICK || !isEventResizingTop || !event.current) return;

    //         event.current.start = F.calculateEventTime(e, columnDivRefs[0]);
    //         event.current.height = F.calculateEventHeight(event.current);
    //         event.current.duration = F.calculateEventDuration(event.current.start, event.current.end);

    //         if (!F.isNewEventValid(event.current, getEvents(event.current.date))) return;

    //         setEvent(event.current);
    //     },
    // };

    // const stopEventAction = (): void => {
    //     if (isEventCreating &&
    //         event.current &&
    //         F.isNewEventValid(event.current, getEvents(event.current.date))
    //     ) openModal();

    //     setIsEventCreating(false);
    //     setIsEventDragging(false);
    //     setIsEventResizingBottom(false);
    //     setIsEventResizingTop(false);
    // };

    // const eventOnClick = (e: React.MouseEvent<HTMLDivElement>, clickedEvent: Event): void => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     event.current = clickedEvent;
    //     openModal();
    // };

    return <S.ContainerMain
        ref={mainRef}
        onMouseLeave={() => { if (isCreate) setIsCreate(false) }}
        onMouseUp={() => { if (isCreate) setIsCreate(false) }}
    >
        {columnDivRefs.map((colRef, index) => {
            const columnDate: MyDate = new MyDate(monday.getMyDate());
            columnDate.addBy(index);
            const filteredEvents: Event[] = getEvents(columnDate.getStringifiedDate());

            return <S.CellColumnDiv
                ref={colRef}
                data-key={index}
                key={index}
                onMouseDown={(e) => createOnMouseDown(e, columnDate)}
                onMouseMove={(e) => {
                    if (isCreate) createOnMouseMove(e);
                    // else if (isEventDragging) eventOnMouseMove.drag(e, colRef);
                    // else if (isEventResizingTop) eventOnMouseMove.top(e);
                    // else if (isEventResizingBottom) eventOnMouseMove.bottom(e);
                }}
            >
                {Array.from({ length: 48 }, (_, j) => <S.CellDiv key={j} />)}
                {filteredEvents.map((event: Event, idx: number) => (
                    <EventCard
                        key={idx}
                        event={event}
                    // isEventDragging={isEventDragging}
                    // eventOnMouseDown={eventOnMouseDown}
                    // eventOnClick={dragThreshold.current == false ? eventOnClick : () => { }}
                    // isLinked={isLinked}
                    />
                ))}
            </S.CellColumnDiv>
        })}
        {/* <S.HourLineDiv
            $fromTop={F.calculateTopOffset(new Time(currentDate.getHours(), currentDate.getMinutes()))}
        /> */}
        {/* {isModalOpen && <EventModal
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            event={event}
            pushToast={pushToast}
            setEvent={setEvent}
            deleteEvent={deleteEvent}
        />} */}

    </S.ContainerMain>

};

export default ScheduleGridMain;
