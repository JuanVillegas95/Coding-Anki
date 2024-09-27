import React, { useState, useEffect, useRef } from 'react';
import * as S from '@/app/styles/dashboard';
import * as F from '@/utils/functions';
import * as C from '@/utils/constants';
import * as T from "@/utils/types"
import * as I from "@/utils/icons"
import { Event, Time, Toast, Warning, User, Calendar } from '@/utils/classes';
import EventCard from './EventCard';
import EventModal from './EventModal';
import { v4 as uuidv4 } from 'uuid';


const eventsDataUser = new Map([
    [
        "1",
        {
            id: "b868bc61-de97-45cd-ba11-ccd3aeca76c4",
            date: new Date("2024-09-23T13:23:07.864Z"),
            start: { hours: 0, minutes: 44 },
            end: { hours: 5, minutes: 0 },
            title: "",
            description: "",
            color: "purple",
            height: 298.6666666666667,
            duration: { hours: 4, minutes: 16 },
            groupID: null,
            selectedDays: [true, false, false, false, false, false, false],
            startDate: new Date("2024-09-23T13:23:07.864Z"),
            endDate: null,
            isFriendEvent: false,
            icon: I.star,
        }
    ],
    [
        "2",
        {
            isFriendEvent: false,
            id: "7d3d6cec-fa95-4c95-9922-6137852b3930",
            date: new Date("2024-09-24T13:23:07.864Z"),
            start: { hours: 0, minutes: 46 },
            end: { hours: 6, minutes: 46 },
            title: "",
            description: "",
            color: "purple",
            height: 420,
            duration: { hours: 6, minutes: 0 },
            groupID: null,
            selectedDays: [false, true, false, false, false, false, false],
            startDate: new Date("2024-09-24T13:23:07.864Z"),
            endDate: null,
            icon: I.star // Add the required icon property here
        }
    ],
    [
        "3",
        {
            isFriendEvent: false,
            id: "8d644ef7-0d7c-482e-89cf-ee8402a6b353",
            date: new Date("2024-09-25T13:23:07.864Z"),
            start: { hours: 0, minutes: 20 },
            end: { hours: 3, minutes: 51 },
            title: "",
            description: "",
            color: "purple",
            height: 246.16666666666666,
            duration: { hours: 3, minutes: 31 },
            groupID: null,
            selectedDays: [false, false, true, false, false, false, false],
            startDate: new Date("2024-09-25T13:23:07.864Z"),
            endDate: null,
            icon: I.star // Add the required icon property here
        }
    ],
    [
        "4",
        {
            isFriendEvent: false,
            id: "acbbc846-265b-4535-9053-d787450b3a70",
            date: new Date("2024-09-26T13:23:07.864Z"),
            start: { hours: 2, minutes: 10 },
            end: { hours: 5, minutes: 54 },
            title: "",
            description: "",
            color: "purple",
            height: 261.33333333333337,
            duration: { hours: 3, minutes: 44 },
            groupID: null,
            selectedDays: [false, false, false, true, false, false, false],
            startDate: new Date("2024-09-26T13:23:07.864Z"),
            endDate: null,
            icon: I.star // Add the required icon property here
        }
    ],
    [
        "5",
        {
            isFriendEvent: false,
            id: "932e788f-cd3e-4014-92c5-94071368af67",
            date: new Date("2024-09-27T13:23:07.864Z"),
            start: { hours: 0, minutes: 30 },
            end: { hours: 3, minutes: 31 },
            title: "",
            description: "",
            color: "purple",
            height: 211.16666666666666,
            duration: { hours: 3, minutes: 1 },
            groupID: null,
            selectedDays: [false, false, false, false, true, false, false],
            startDate: new Date("2024-09-27T13:23:07.864Z"),
            endDate: null,
            icon: I.star // Add the required icon property here
        }
    ],
    [
        "6",
        {
            isFriendEvent: false,
            id: "4e35c113-770f-4e42-8a6c-544847d62836",
            date: new Date("2024-09-28T13:23:07.864Z"),
            start: { hours: 1, minutes: 9 },
            end: { hours: 5, minutes: 35 },
            title: "",
            description: "",
            color: "purple",
            height: 310.3333333333333,
            duration: { hours: 4, minutes: 26 },
            groupID: null,
            selectedDays: [false, false, false, false, false, true, false],
            startDate: new Date("2024-09-28T13:23:07.864Z"),
            endDate: null,
            icon: I.star // Add the required icon property here
        }
    ],
    [
        "7",
        {
            isFriendEvent: false,
            id: "818b0ded-0a98-4f87-bb07-cb6eb6a3d69f",
            date: new Date("2024-09-29T13:23:07.864Z"),
            start: { hours: 0, minutes: 21 },
            end: { hours: 6, minutes: 4 },
            title: "",
            description: "",
            color: "purple",
            height: 400.16666666666663,
            duration: { hours: 5, minutes: 43 },
            groupID: null,
            selectedDays: [false, false, false, false, false, false, true],
            startDate: new Date("2024-09-29T13:23:07.864Z"),
            endDate: null,
            icon: I.star // Add the required icon property here
        }
    ]
]);

const eventsDataFriend = new Map([
    [
        "8",
        {
            isFriendEvent: true,
            id: "b868bc61-de97-45cd-ba11-ccd3aeca76c4",
            date: new Date("2024-09-23T13:23:07.864Z"),
            start: { hours: 0, minutes: 44 },
            end: { hours: 5, minutes: 0 },
            title: "",
            description: "",
            color: "purple",
            height: 298.6666666666667,
            duration: { hours: 4, minutes: 16 },
            groupID: null,
            selectedDays: [true, false, false, false, false, false, false],
            startDate: new Date("2024-09-23T13:23:07.864Z"),
            endDate: null,
            icon: I.star // Add the required icon property here
        }
    ],
    [
        "9",
        {
            isFriendEvent: true,
            id: "7d3d6cec-fa95-4c95-9922-6137852b3930",
            date: new Date("2024-09-24T13:23:07.864Z"),
            start: { hours: 0, minutes: 46 },
            end: { hours: 6, minutes: 46 },
            title: "",
            description: "",
            color: "purple",
            height: 420,
            duration: { hours: 6, minutes: 0 },
            groupID: null,
            selectedDays: [false, true, false, false, false, false, false],
            startDate: new Date("2024-09-24T13:23:07.864Z"),
            endDate: null,
            icon: I.star // Add the required icon property here
        }
    ],
    [
        "10",
        {
            isFriendEvent: true,
            id: "8d644ef7-0d7c-482e-89cf-ee8402a6b353",
            date: new Date("2024-09-25T13:23:07.864Z"),
            start: { hours: 0, minutes: 20 },
            end: { hours: 3, minutes: 51 },
            title: "",
            description: "",
            color: "purple",
            height: 246.16666666666666,
            duration: { hours: 3, minutes: 31 },
            groupID: null,
            selectedDays: [false, false, true, false, false, false, false],
            startDate: new Date("2024-09-25T13:23:07.864Z"),
            endDate: null,
            icon: I.star // Add the required icon property here
        }
    ],
    [
        "11",
        {
            isFriendEvent: true,
            id: "acbbc846-265b-4535-9053-d787450b3a70",
            date: new Date("2024-09-26T13:23:07.864Z"),
            start: { hours: 2, minutes: 10 },
            end: { hours: 5, minutes: 54 },
            title: "",
            description: "",
            color: "purple",
            height: 261.33333333333337,
            duration: { hours: 3, minutes: 44 },
            groupID: null,
            selectedDays: [false, false, false, true, false, false, false],
            startDate: new Date("2024-09-26T13:23:07.864Z"),
            endDate: null,
            icon: I.star // Add the required icon property here
        }
    ],
    [
        "12",
        {
            isFriendEvent: true,
            id: "932e788f-cd3e-4014-92c5-94071368af67",
            date: new Date("2024-09-27T13:23:07.864Z"),
            start: { hours: 0, minutes: 30 },
            end: { hours: 3, minutes: 31 },
            title: "",
            description: "",
            color: "purple",
            height: 211.16666666666666,
            duration: { hours: 3, minutes: 1 },
            groupID: null,
            selectedDays: [false, false, false, false, true, false, false],
            startDate: new Date("2024-09-27T13:23:07.864Z"),
            endDate: null,
            icon: I.star // Add the required icon property here
        }
    ],
    [
        "13",
        {
            isFriendEvent: true,
            id: "4e35c113-770f-4e42-8a6c-544847d62836",
            date: new Date("2024-09-28T13:23:07.864Z"),
            start: { hours: 1, minutes: 9 },
            end: { hours: 5, minutes: 35 },
            title: "",
            description: "",
            color: "purple",
            height: 310.3333333333333,
            duration: { hours: 4, minutes: 26 },
            groupID: null,
            selectedDays: [false, false, false, false, false, true, false],
            startDate: new Date("2024-09-28T13:23:07.864Z"),
            endDate: null,
            icon: I.star // Add the required icon property here
        }
    ],
    [
        "14",
        {
            isFriendEvent: true,
            id: "818b0ded-0a98-4f87-bb07-cb6eb6a3d69f",
            date: new Date("2024-09-29T13:23:07.864Z"),
            start: { hours: 0, minutes: 21 },
            end: { hours: 6, minutes: 4 },
            title: "",
            description: "",
            color: "purple",
            height: 400.16666666666663,
            duration: { hours: 5, minutes: 43 },
            groupID: null,
            selectedDays: [false, false, false, false, false, false, true],
            startDate: new Date("2024-09-29T13:23:07.864Z"),
            endDate: null,
            icon: I.star // Add the required icon property here
        }
    ]
]);


const USER = new User(
    uuidv4(), // Generating a unique user ID
    "user@example.com", // Email address
    new Map([
        ["work", new Calendar("work", "Work Calendar", eventsDataUser)]
    ]),
);

const FRIEND = new User(
    uuidv4(), // Generating a unique friend user ID
    "friend@example.com", // Email address
    new Map([
        ["personal", new Calendar("personal", "Personal Calendar", eventsDataFriend)]
    ]),
);


const ScheduleGridMain: React.FC<{
    addToast: (newToast: Toast) => void;
    mondayDate: Date;
    events: Map<string, Event>;
    mainRef: React.RefObject<HTMLDivElement>;
    isLinked: boolean;
    calendarHandler: T.CalendarHandler;
    warningHandeler: T.WarningHandler;
}> = ({ mainRef, events, mondayDate, calendarHandler, addToast, warningHandeler, isLinked }) => {
    const [currentEvent, setCurrentEvent] = useState<Event>(new Event());
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isEventCreating, setIsEventCreating] = useState<boolean>(false);
    const [isEventResizingTop, setIsEventResizingTop] = useState<boolean>(false);
    const [isEventResizingBottom, setIsEventResizingBottom] = useState<boolean>(false);
    const [isEventDragging, setIsEventDragging] = useState<boolean>(false);
    const beforeDragEvent = useRef<Event | null>(null);
    const dragStartTime = useRef<Date>(new Date());
    const dragThreshold = useRef<boolean>(false);
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
            dragStartTime.current = new Date();
            dragThreshold.current = false;
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
            if (!isEventDragging || e.button !== C.LEFT_MOUSE_CLICK) return;
            dragThreshold.current = ((new Date().getTime() - dragStartTime.current.getTime()) >= C.DRAG_THRESHOLD);

            if (!dragThreshold.current) return;
            if (currentEvent.groupID && beforeDragEvent.current === null) beforeDragEvent.current = currentEvent;

            const [start, end] = F.calculateTimeOnDrag(e, colRef, currentEvent);
            const currentEventDayWeek = F.getDay(currentEvent.date);
            const enteredEventDayWeek = parseInt(colRef.current!.dataset.key as string);

            // Edge case if it belongs to a groupID\
            const date = currentEvent.groupID ? currentEvent.date : F.addDateBy(currentEvent.date, Math.sign(enteredEventDayWeek - currentEventDayWeek));
            const newSelectedDays: boolean[] = currentEvent.groupID ? currentEvent.selectedDays : new Array(7).fill(false);
            newSelectedDays[F.getDay(date)] = true;
            const updatedEvent: Event = {
                ...currentEvent,
                start,
                end,
                date,
                startDate: date,
                selectedDays: newSelectedDays,

            };
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
        setIsEventCreating(false);
        setIsEventDragging(false);
        setIsEventResizingBottom(false);
        setIsEventResizingTop(false);
        if (dragThreshold.current && currentEvent.groupID && isEventDragging) {
            warningHandeler.set(new Warning(C.WARNING_STATUS.EVENT_MODIFY, currentEvent, null, null, beforeDragEvent.current));
            return;
        }
        beforeDragEvent.current = null;
        if (isEventCreating && F.isNewEventValid(currentEvent, events)) openModal();
    };

    const eventOnClick = (e: React.MouseEvent<HTMLDivElement>, event: Event): void => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentEvent(event);
        openModal();
    };




    // !THIS IS JUST FOR TESTING LINKING
    let userEvents: Map<string, Event> = USER.calendars.get("work")!.events;
    const friendEvents: Map<string, Event> = FRIEND.calendars.get("personal")!.events;
    const normalEvnets: Map<string, Event> = events;
    if (isLinked) friendEvents.forEach((event: Event) => userEvents.set(event.id, event));
    else friendEvents.forEach((event: Event) => userEvents.delete(event.id));

    return <S.ContainerMain
        ref={mainRef}
        onMouseLeave={stopEventAction}
        onMouseUp={stopEventAction}
    >
        {columnDivRefs.map((colRef, index) => {
            const day: Date = F.addDateBy(mondayDate, index);
            const filteredEvents: Event[] = F.getSameDateEvents(normalEvnets, day);
            return <S.CellColumnDiv
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
                        eventOnClick={dragThreshold.current == false ? eventOnClick : () => { }}
                        isLinked={isLinked}
                    />
                ))}
            </S.CellColumnDiv>
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
                warningHandeler={warningHandeler}
            />
        }
    </S.ContainerMain>

};

export default ScheduleGridMain;
