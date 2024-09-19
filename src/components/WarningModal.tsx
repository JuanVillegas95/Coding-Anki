import React from 'react';
import * as S from '@/styles/CalendarHub.styles';
import * as F from '@/utils/CalendarHub/functions';
import * as C from '@/utils/CalendarHub/constants';
import LongEvent from './LongEvent';
import { Event } from '@/utils/CalendarHub/classes';

const WarningModal: React.FC<{
    currentEvent: Event;
    conflictEvent: Event;
    calendarHandler: {
        setEvent: (event: Event) => void;
        deleteEvent: (event: Event) => void;
        getEvents: () => Map<string, Event>;
    };
    warningHandler: {
        setConflicting: (conflictEvent: Event) => void;
        setCurrent: (conflictEvent: Event) => void;
        clearEvents: () => void;
    }
}> = ({ currentEvent, conflictEvent, calendarHandler, warningHandler }) => {
    const isGroupID: boolean = conflictEvent.eventGroupID ? true : false;
    const isSingleEvent: string = isGroupID ? "Delete only this conflicting event" : "Delete conflicting event"

    const handleCloseModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        e.preventDefault();
        warningHandler.clearEvents();
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData: FormData = new FormData(e.currentTarget);
        const action: FormDataEntryValue | null = formData.get("warning");
        switch (action) {
            case 'deleteSingle': {
                calendarHandler.deleteEvent(conflictEvent);
                const updatedEvent: Event = {
                    ...currentEvent,
                    duration: F.calculateEventDuration(currentEvent),
                    height: F.calculateEventHeight(currentEvent),
                };
                calendarHandler.setEvent(updatedEvent);
            } break;
            case 'deleteGroup': { } break;
            case 'skipEvent': { } break;
            default:
                break;
        }
        warningHandler.clearEvents();
    };

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
                <S.WarningForm onSubmit={handleSubmit}>
                    <S.OptionWrapperDiv>
                        <S.WarningInput id={"deleteSingle"} value={"deleteSingle"} />
                        <S.WarningLabel htmlFor="deleteSingle"> {isSingleEvent} </S.WarningLabel>
                    </S.OptionWrapperDiv>
                    {isGroupID && <React.Fragment>
                        <S.OptionWrapperDiv>
                            <S.WarningInput id={"deleteGroup"} value={"deleteGroup"} />
                            <S.WarningLabel htmlFor="deleteGroup" > Delete all events in the conflicting group </S.WarningLabel>
                        </S.OptionWrapperDiv> <S.OptionWrapperDiv>
                            <S.WarningInput id={"skipEvent"} value={"skipEvent"} />
                            <S.WarningLabel htmlFor="skipEvent"> Skip this event and proceed with others</S.WarningLabel>
                        </S.OptionWrapperDiv>
                    </React.Fragment>}
                    <S.WarningFooter>
                        <S.DeleteButton onClick={(e) => handleCloseModal(e)}>
                            Cancel
                        </S.DeleteButton>
                        <S.SaveButton type="submit">
                            Apply Changes
                        </S.SaveButton>
                    </S.WarningFooter>
                </S.WarningForm>
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
