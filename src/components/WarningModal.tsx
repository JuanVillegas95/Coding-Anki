import React from 'react';
import * as S from '@/styles/CalendarHub.styles';
import * as F from '@/utils/functions';
import * as C from '@/utils/constants';
import LongEvent from './LongEvent';
import { Event, Warning } from '@/utils/classes';

const WarningModal: React.FC<{
    warning: Warning;
    clearWarning: () => void;
    calendarHandler: {
        setEvent: (event: Event) => void;
        deleteEvent: (event: Event) => void;
        getEvents: () => Map<string, Event>;
    };

}> = ({ clearWarning, calendarHandler, warning }) => {
    const { type, conflictEvent, currentEvent } = warning;
    const handleCloseModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        e.preventDefault();
        clearWarning();
    };

    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     const formData: FormData = new FormData(e.currentTarget);
    //     const action: FormDataEntryValue | null = formData.get("warning");
    //     switch (action) {
    //         case 'deleteSingle': {
    //             calendarHandler.deleteEvent(conflictEvent);
    //             const updatedEvent: Event = {
    //                 ...currentEvent,
    //                 duration: F.calculateEventDuration(currentEvent),
    //                 height: F.calculateEventHeight(currentEvent),
    //             };
    //             calendarHandler.setEvent(updatedEvent);
    //         } break;
    //         case 'deleteGroup': { } break;
    //         case 'skipEvent': { } break;
    //         default:
    //             break;
    //     }
    //     warningHandler.clearEvents();
    // };
    switch (type) {
        case C.WARNING_TYPE.DELETE_SINGLE: return <></>
        case C.WARNING_TYPE.DELETE_RECURRING_SERIES: return <p>Are you sure you want to delete the entire series of events?</p>;
        case C.WARNING_TYPE.CONVERT_TO_SINGLE: return <p>Are you sure you want to convert this event to a single event?</p>;
        case C.WARNING_TYPE.DELETE_SERIES_ON_DAY: return <p>Are you sure you want to delete all events on this day?</p>;
        case C.WARNING_TYPE.NONE: <SingleWarning currentEvent={currentEvent!} conflictEvent={conflictEvent!} />
    }

};

const SingleWarning: React.FC<{ currentEvent: Event; conflictEvent: Event }> = ({ currentEvent, conflictEvent }) => {

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
                    <WarningEvent event={conflictEvent} label={"Conflicting Event"} />
                </S.WarningMain>
            </S.WarningContainerDiv>
        </S.WarningWrapperDiv >
    );
};



const WarningEvent: React.FC<{ event: Event, label: string }> = ({ event, label }) => {
    const { id, height, start, end, duration, color, icon, title, description } = event;

    // Style to override the existing style from EventDiv
    const warningStyle: React.CSSProperties = {
        position: "static",
        width: "150px",
        cursor: "default",
    };

    return <S.WarrningEventWrapperDiv>
        <S.WarrningEventh2>{label}</S.WarrningEventh2>
        <S.EventDiv
            key={id}
            $fromTop={0}
            $height={200}
            $backgroundColor={C.COLORS[color].secondary}
            $borderColor={C.COLORS[color].primary}
            $isDragged={false}
            style={warningStyle}
        >
            <S.EventTopDiv
                $color={C.COLORS[color].primary}
            />
            <S.EventBodyDiv >
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
};

export default WarningModal;
