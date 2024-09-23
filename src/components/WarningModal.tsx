import React, { useState } from 'react';
import LongEvent from './LongEvent';
import { Event, Warning, Time } from '@/utils/classes';
import * as S from '@/utils/styles';
import * as F from '@/utils/functions';
import * as C from '@/utils/constants';
import * as I from '@/utils/icons';
import * as T from '@/utils/types';

const WarningModal: React.FC<{
    warning: Warning;
    warningHandler: T.WarningHandler;
    calendarHandler: T.CalendarHandler;
}> = ({ warningHandler, warning, calendarHandler, }) => {
    const { status, currentEvent, conflictEvents, recurringEvents } = warning;

    const deleteEvents = () => {
        conflictEvents!.forEach((event) => calendarHandler.deleteEvent(event));
        recurringEvents!.forEach((event) => calendarHandler.setEvent(event));
        warningHandler.close();
    };

    const deleteEvent = () => {
        calendarHandler.deleteEvent(conflictEvents![0]);
        calendarHandler.setEvent(currentEvent!);
        warningHandler.close();
    };

    const cancelAction = () => warningHandler.close();

    switch (status) {
        case C.WARNING_STATUS.EVENT_CONFLICT: return <EventConflict
            currentEvent={currentEvent!}
            conflictEvents={conflictEvents!}
            deleteEvents={deleteEvents}
            deleteEvent={deleteEvent}
            cancelAction={cancelAction}
        />
        case C.WARNING_STATUS.DELETE_RECURRING_SERIES: return <p>Are you sure you want to delete the entire series of events?</p>;
        case C.WARNING_STATUS.CONVERT_TO_SINGLE: return <p>Are you sure you want to convert this event to a single event?</p>;
        case C.WARNING_STATUS.NONE: return null;
    }

};

const EventConflict: React.FC<{
    currentEvent: Event;
    conflictEvents: Event[];
    cancelAction: () => void;
    deleteEvents: () => void;
    deleteEvent: () => void;
}> = ({ currentEvent, conflictEvents, cancelAction, deleteEvents, deleteEvent }) => {
    const [conflictEventIndex, setConflictEventIndex] = useState<number>(0)
    const conflictCount: number = conflictEvents.length;
    const areConflicts: boolean = conflictCount > 1;

    const moveRight = (): void => {
        setConflictEventIndex((prev) => {
            if (prev === conflictCount - 1) return 0;
            else return prev + 1;
        })
    }

    const moveLeft = (): void => {
        setConflictEventIndex((prev) => {
            if (prev === 0) return conflictCount - 1;
            else return prev - 1;
        })
    }
    return (
        <S.WarningWrapperDiv>
            <S.WarningContainerDiv>
                <S.WarningHeader>
                    <S.Warningh1>
                        Event Conflict Detected
                    </S.Warningh1>
                </S.WarningHeader>
                <S.WarningMain>
                    <WarningEvent event={currentEvent} label={"Current Event"} />
                    <WarningEvent
                        event={conflictEvents[conflictEventIndex]}
                        label={"Conflict Event"}
                        areConflicts={areConflicts}
                        moveLeft={moveLeft}
                        moveRight={moveRight}
                    />
                </S.WarningMain>
                {!areConflicts
                    ? <S.WarningP>
                        There is a conflicting event already scheduled at the time and date where you want to modify or create a new event.
                    </S.WarningP>
                    : <S.WarningP>
                        There are {conflictCount} conflicting events already scheduled at the time and date where you want to modify or create a new event.
                    </S.WarningP>}
                <S.WarningFooter>
                    {!areConflicts
                        ? <S.WarningButton
                            value={"Delete Conflicting Event"}
                            onClick={deleteEvent}
                        />
                        : <S.WarningButton
                            value={`Delete All ${conflictCount} Conflicting Events`}
                            onClick={deleteEvents}
                        />}
                    <S.WarningButton
                        value={"Cancel"} style={{ backgroundColor: 'lightgray' }}
                        onClick={cancelAction}
                    />
                </S.WarningFooter>
            </S.WarningContainerDiv>
        </S.WarningWrapperDiv>
    );
};



const WarningEvent: React.FC<{
    event: Event;
    label: string;
    areConflicts?: boolean;
    moveRight?: () => void;
    moveLeft?: () => void;
}> = ({ event, label, areConflicts, moveRight, moveLeft }) => {
    const { id, height, start, end, duration, color, icon, title, description, eventGroupID } = event;
    const borderStyle: string = eventGroupID ? "solid" : "dotted";

    // Style to override the existing style from EventDiv
    const warningStyle: React.CSSProperties = {
        position: "static",
        width: "150px",
        cursor: "default",
    }

    return (
        <S.WarrningEventWrapperDiv>
            <S.WarningEventsWarningDiv >
                {areConflicts && <S.WarningIconDiv $svgSize={15} $size={25} $color={"black"} onClick={moveLeft}>
                    {React.createElement(I.left)}
                </S.WarningIconDiv>}
                <S.WarrningEventh2>{label}</S.WarrningEventh2>
                {areConflicts && <S.WarningIconDiv $svgSize={15} $size={25} $color={"black"} onClick={moveRight} >
                    {React.createElement(I.right)}
                </S.WarningIconDiv>}
            </S.WarningEventsWarningDiv>

            <S.EventDiv
                key={id}
                $fromTop={0}
                $height={200}
                $backgroundColor={C.COLORS[color].secondary}
                $borderColor={C.COLORS[color].primary}
                $isDragged={false}
                style={warningStyle}
                $borderStyle={borderStyle}
            >
                <S.EventTopDiv $color={C.COLORS[color].primary} />
                <S.EventBodyDiv>
                    <LongEvent
                        color={color}
                        startHours={F.formatTime(start.hours)}
                        startMinutes={F.formatTime(start.minutes)}
                        endHours={F.formatTime(end.hours)}
                        endMinutes={F.formatTime(end.minutes)}
                        icon={icon}
                        title={title}
                        description={description}
                    />
                </S.EventBodyDiv>
                <S.EventBottomDiv />
            </S.EventDiv>
        </S.WarrningEventWrapperDiv>
    );
};


export default WarningModal;
