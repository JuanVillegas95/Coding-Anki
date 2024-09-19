import React, { useState, useEffect, useRef } from 'react';
import * as S from '@/styles/CalendarHub.styles';
import * as F from '@/utils/CalendarHub/functions';
import * as C from '@/utils/CalendarHub/constants';
import { Event, Time, Toast } from '@/utils/CalendarHub/classes';
import EventCard from './EventCard';
import EventModal from './EventModal';
import WarningModal from './WarningModal';

const ScheduleGridMain: React.FC<{
    addToast: (newToast: Toast) => void;
    mondayDate: Date;
    events: Map<string, Event>;
    mainRef: React.RefObject<HTMLDivElement>;
    calendarHandler: {
        setEvent: (event: Event) => void;
        deleteEvent: (event: Event) => void;
        getEvents: () => Map<string, Event>;
    };
}> = ({ mainRef, events, mondayDate, calendarHandler, addToast }) => {
    const [currentEvent, setCurrentEvent] = useState<Event>(C.NULL_EVENT);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isEventCreating, setIsEventCreating] = useState<boolean>(false);
    const [isEventDragging, setIsEventDragging] = useState<boolean>(false);
    const [isEventResizingTop, setIsEventResizingTop] = useState<boolean>(false);
    const [isEventResizingBottom, setIsEventResizingBottom] = useState<boolean>(false);
    const columnDivRefs: React.RefObject<HTMLDivElement>[] = Array.from(
        { length: 7 },
        () => useRef<HTMLDivElement>(null)
    );

    // Effect to update the 'HourLineDiv' every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const updateCurrentEvent = (newEvent: Event): void => setCurrentEvent((prevEvent) => ({ ...prevEvent, ...newEvent }));

    const closeModal = (): void => setIsModalOpen(false);
    const openModal = (): void => setIsModalOpen(true);

    // Handlers for mouse events
    const eventOnMouseDown = {
        create: (e: React.MouseEvent<HTMLDivElement>, date: Date) => {
            e.preventDefault();
            e.stopPropagation();

            if (e.button !== C.LEFT_MOUSE_CLICK) return;

            const newEventStart: Time = F.calculateEventTime(e, columnDivRefs[0]);

            if (F.isEventOverlapping(events, date, newEventStart)) return;

            setIsEventCreating(true);
            setCurrentEvent(new Event(date, newEventStart));
        },

        drag: (e: React.MouseEvent<HTMLDivElement>, event: Event) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.button !== C.LEFT_MOUSE_CLICK) return;

            setIsEventDragging(true);
            setCurrentEvent(event);
        },

        bottom: (e: React.MouseEvent<HTMLDivElement>, event: Event) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.button !== C.LEFT_MOUSE_CLICK) return;

            setIsEventResizingBottom(true);
            setCurrentEvent(event);
        },

        top: (e: React.MouseEvent<HTMLDivElement>, event: Event) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.button !== C.LEFT_MOUSE_CLICK) return;

            setIsEventResizingTop(true);
            setCurrentEvent(event);
        },
    };

    const eventOnMouseMove = {
        create: (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.button !== C.LEFT_MOUSE_CLICK || !isEventCreating) return;

            const newEvent: Event = { ...currentEvent }
            newEvent.end = F.calculateEventTime(e, columnDivRefs[0]);
            newEvent.height = F.calculateEventHeight(newEvent);
            newEvent.duration = F.calculateEventDuration(newEvent);
            newEvent.id = currentEvent.id;
            newEvent.selectedDays[F.getDay(newEvent.startDate)] = true;

            if (!F.isNewEventValid(newEvent, events)) return;
            setCurrentEvent(newEvent);
            calendarHandler.setEvent(newEvent);
        },

        drag: (e: React.MouseEvent<HTMLDivElement>, colRef: React.RefObject<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.button !== C.LEFT_MOUSE_CLICK || !isEventDragging) return;

            const [start, end] = F.calculateTimeOnDrag(e, colRef, currentEvent);
            const currentEventDayWeek = F.getDay(currentEvent.startDate);
            const enteredEventDayWeek = parseInt(colRef.current!.dataset.key as string);
            const startDate = F.addDateBy(currentEvent.startDate, Math.sign(enteredEventDayWeek - currentEventDayWeek));

            const updatedEvent: Event = { ...currentEvent, start, end, startDate };
            if (!F.isNewEventValid(updatedEvent, events)) return;
            setCurrentEvent(updatedEvent);
            calendarHandler.setEvent(updatedEvent);
        },

        bottom: (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.button !== C.LEFT_MOUSE_CLICK || !isEventResizingBottom) return;

            const newEnd: Time = F.calculateEventTime(e, columnDivRefs[0]);
            const updatedEvent: Event = {
                ...currentEvent,
                end: newEnd,
                height: F.calculateEventHeight({ ...currentEvent, end: newEnd }),
                duration: F.calculateEventDuration({ ...currentEvent, end: newEnd }),
            };
            if (!F.isNewEventValid(updatedEvent, events)) return;

            setCurrentEvent(updatedEvent);
            calendarHandler.setEvent(updatedEvent);
        },

        top: (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.button !== C.LEFT_MOUSE_CLICK || !isEventResizingTop) return;

            const newStart: Time = F.calculateEventTime(e, columnDivRefs[0]);
            const updatedEvent: Event = {
                ...currentEvent,
                start: newStart,
                height: F.calculateEventHeight({ ...currentEvent, start: newStart }),
                duration: F.calculateEventDuration({ ...currentEvent, start: newStart }),
            };
            if (!F.isNewEventValid(updatedEvent, events)) return;

            setCurrentEvent(updatedEvent);
            calendarHandler.setEvent(updatedEvent);
        },
    };

    const stopEventAction = (): void => {
        if (isEventCreating && F.isNewEventValid(currentEvent, events)) openModal();
        setIsEventCreating(false);
        setIsEventDragging(false);
        setIsEventResizingBottom(false);
        setIsEventResizingTop(false);
    };

    const eventOnClick = (e: React.MouseEvent<HTMLDivElement>, event: Event): void => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentEvent(event);
        openModal();
    };

    return (
        <S.ContainerMain
            ref={mainRef}
            onMouseLeave={stopEventAction}
            onMouseUp={stopEventAction}
        >
            {columnDivRefs.map((colRef, index) => {
                const day: Date = F.addDateBy(mondayDate, index);
                const filteredEvents: Event[] = F.getSameDateEvents(events, day);

                return (
                    <S.CellColumnDiv
                        ref={colRef}
                        data-key={index}
                        key={index}
                        onMouseDown={(e) => eventOnMouseDown.create(e, day)}
                        onMouseMove={(e) => {
                            eventOnMouseMove.create(e);
                            eventOnMouseMove.drag(e, colRef);
                            eventOnMouseMove.top(e);
                            eventOnMouseMove.bottom(e);
                        }}
                    >
                        {F.range(48).map((j) => <S.CellDiv key={j} />)}
                        {filteredEvents.map((event: Event, idx: number) => (
                            <EventCard
                                key={idx}
                                event={event}
                                isEventDragging={isEventDragging}
                                eventOnMouseDown={eventOnMouseDown}
                                eventOnClick={eventOnClick}
                            />
                        ))}
                    </S.CellColumnDiv>
                );
            })}
            <S.HourLineDiv
                $fromTop={F.calculateTopOffset(new Time(currentDate.getHours(), currentDate.getMinutes()))}
            />
            {isModalOpen &&
                <EventModal
                    events={calendarHandler.getEvents()}
                    calendarHandler={calendarHandler}
                    closeModal={closeModal}
                    currentEvent={currentEvent}
                    isModalOpen={isModalOpen}
                    addToast={addToast}
                    updateCurrentEvent={updateCurrentEvent}
                />
            }
        </S.ContainerMain>
    );
};

export default ScheduleGridMain;
