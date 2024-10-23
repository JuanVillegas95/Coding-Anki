import React, { useState, useEffect, useRef } from 'react';
import * as S from '../utils/style.calendar';
import EventCard from './EventCard';
import { Event } from "@/classes/Event";
import { MyDate, stringifiedDate } from "@/classes/MyDate"
import { MyTime, hoursMinutes, pixels } from '@/classes/MyTime';
import { RecurringDetails } from "@/classes/RecurringDetails"
import { HourLine } from './HourLine';

const LEFT_MOUSE_CLICK: number = 0;

const ScheduleGridMain: React.FC<{
    monday: MyDate;
    event: React.MutableRefObject<Event | null>;
    setEvent: (eventToSet: Event, recurringDetails: RecurringDetails | null) => void;
    getEvents: (date: stringifiedDate) => Event[];
    closeModal: () => void;
    openModal: () => void;
    // pushToast: (id: string, description: string, type: TOAST_TYPE) => void;
    mainRef: React.RefObject<HTMLDivElement>;
    // isLinked: boolean;
}> = ({ mainRef, monday, setEvent, getEvents, event, closeModal, openModal }) => {
    const columnDivRefs: React.RefObject<HTMLDivElement>[] = new Array(7).fill(null).map(() => useRef<HTMLDivElement>(null));
    const [isCreate, setIsCreate] = useState<boolean>(false);
    const [isDrag, setIsDrag] = useState<boolean>(false);
    const [isTop, setIsTop] = useState<boolean>(false);
    const [isBot, setIsBot] = useState<boolean>(false);
    const dragThreshold = useRef<boolean>(false);

    const createOnMouseDown = (e: React.MouseEvent<HTMLDivElement>, columnDate: MyDate) => {
        e.preventDefault(); e.stopPropagation();
        if (e.button !== LEFT_MOUSE_CLICK) return;
        const distanceFromTop: pixels = (e.clientY - columnDivRefs[0].current!.getBoundingClientRect().top);
        const startTime: MyTime = new MyTime(distanceFromTop);

        if (Event.isOverlapping(getEvents(columnDate.getStringifiedDate()), startTime)) return;

        event.current = new Event(columnDate, startTime);
        setIsCreate(true);
    }

    const topOnMouseDown = (e: React.MouseEvent<HTMLDivElement>, eventToResize: Event) => {
        e.preventDefault(); e.stopPropagation();
        if (e.button !== LEFT_MOUSE_CLICK) return;
        event.current = eventToResize;
        setIsTop(true)
    }

    const botOnMouseDown = (e: React.MouseEvent<HTMLDivElement>, eventToResize: Event) => {
        e.preventDefault(); e.stopPropagation();
        if (e.button !== LEFT_MOUSE_CLICK) return;
        event.current = eventToResize;
        setIsBot(true)
    }

    const dragOnMouseDown = (e: React.MouseEvent<HTMLDivElement>, eventToDrag: Event) => {
        e.preventDefault(); e.stopPropagation();
        if (e.button !== LEFT_MOUSE_CLICK) return;
        // dragThreshold.current = false;
        event.current = eventToDrag;
        setIsDrag(true);
    };

    const createOnMouseMove = (e: React.MouseEvent<HTMLDivElement>, events: Event[]) => {
        e.preventDefault(); e.stopPropagation();
        if (e.button !== LEFT_MOUSE_CLICK || !isCreate || !event.current) return;

        const clonedEvent: Event = event.current.clone();
        const distanceFromTop: pixels = (e.clientY - columnDivRefs[0].current!.getBoundingClientRect().top);
        clonedEvent.setEndTime(new MyTime(distanceFromTop));

        if (!clonedEvent.isValid(events)) return;
        setEvent(clonedEvent, null);
        event.current = clonedEvent;
    };

    const topOnMouseMove = (e: React.MouseEvent<HTMLDivElement>, events: Event[]) => {
        e.preventDefault(); e.stopPropagation();
        if (e.button !== LEFT_MOUSE_CLICK || !isTop || !event.current) return;

        const clonedEvent: Event = event.current.clone();
        const distanceFromTop: pixels = (e.clientY - columnDivRefs[0].current!.getBoundingClientRect().top);
        clonedEvent.setStartTime(new MyTime(distanceFromTop));

        if (!clonedEvent.isValid(events)) return;

        setEvent(clonedEvent, null);
    };

    const botOnMouseMove = (e: React.MouseEvent<HTMLDivElement>, events: Event[]) => {
        e.preventDefault(); e.stopPropagation();
        if (e.button !== LEFT_MOUSE_CLICK || !isBot || !event.current) return;

        const clonedEvent: Event = event.current.clone();
        const distanceFromTop: pixels = (e.clientY - columnDivRefs[0].current!.getBoundingClientRect().top);
        clonedEvent.setEndTime(new MyTime(distanceFromTop));

        if (!clonedEvent.isValid(events)) return;

        setEvent(clonedEvent, null);
    };

    const dragOnMouseMove = (e: React.MouseEvent<HTMLDivElement>, events: Event[], colRef: React.RefObject<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation();
        if (e.button !== LEFT_MOUSE_CLICK || !isDrag || !event.current) return;

        // dragThreshold.current = ((new Date().getTime() - dragStartTime.current.getTime()) >= DRAG_THRESHOLD);
        // if (!dragThreshold.current) return;

        const clonedEvent: Event = event.current.clone();
        const enterDayWeek: number = parseInt(colRef.current!.dataset.key as string);
        const distanceFromTop: pixels = e.clientY - columnDivRefs[0].current!.getBoundingClientRect().top;
        clonedEvent.adjustTime(distanceFromTop);
        clonedEvent.adjustDate(enterDayWeek);

        if (!clonedEvent.isValid(events)) return;

        setEvent(clonedEvent, null);
    };

    const stopAction = (): void => {
        if (isCreate && event.current) openModal();
        setIsBot(false);
        setIsDrag(false);
        setIsTop(false);
        setIsCreate(false);
    };

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>, events: Event[], colRef: React.RefObject<HTMLDivElement>): void => {
        if (isCreate) createOnMouseMove(e, events);
        else if (isTop) topOnMouseMove(e, events);
        else if (isBot) botOnMouseMove(e, events);
        else if (isDrag) dragOnMouseMove(e, events, colRef);
    };

    const eventOnClick = (e: React.MouseEvent<HTMLDivElement>, clickedEvent: Event): void => {
        e.preventDefault(); e.stopPropagation();
        event.current = clickedEvent;
        openModal();
    };

    return <S.ContainerMain ref={mainRef} onMouseLeave={stopAction} onMouseUp={stopAction}>
        {columnDivRefs.map((colRef: React.RefObject<HTMLDivElement>, i: number) => {
            const columnDate: MyDate = new MyDate(monday.getJsDate());
            columnDate.addBy(i);
            const filteredEvents: Event[] = getEvents(columnDate.getStringifiedDate());

            return <S.CellColumnDiv
                onMouseDown={(e) => createOnMouseDown(e, columnDate)}
                onMouseMove={(e) => onMouseMove(e, filteredEvents, colRef)}
                ref={colRef}
                data-key={i}
                key={i}
            >
                {filteredEvents.map((event: Event, idx: number) => (
                    <EventCard
                        key={idx}
                        event={event}
                        topOnMouseDown={topOnMouseDown}
                        botOnMouseDown={botOnMouseDown}
                        dragOnMouseDown={dragOnMouseDown}
                        isDrag={isDrag}
                        eventOnClick={dragThreshold.current == false ? eventOnClick : () => { }}
                    // isLinked={isLinked}
                    />
                ))}
                {Array.from({ length: 48 }, (_, j) => <S.CellDiv key={j} />)}
            </S.CellColumnDiv>
        })}
        <HourLine />
    </S.ContainerMain >
};

export default ScheduleGridMain;
