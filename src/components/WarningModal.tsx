import React from 'react';
import * as S from '@/styles/CalendarHub.styles';
import * as F from '@/utils/CalendarHub/functions';
import * as C from '@/utils/CalendarHub/constants';
import LongEvent from './LongEvent';
import { Event } from '@/utils/CalendarHub/classes';

const WarningModal: React.FC<{ currentEvent: Event, conflictEvent: Event }> = ({ currentEvent, conflictEvent }) => {

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
                <S.WarningForm>
                    <S.OptionWrapperDiv>
                        <S.WarningInput />
                        <S.WarningLabel> Delete only this conflicting event </S.WarningLabel>
                    </S.OptionWrapperDiv>
                    {true && <React.Fragment>
                        <S.OptionWrapperDiv>
                            <S.WarningInput />
                            <S.WarningLabel> Delete all events in the conflicting group </S.WarningLabel>
                        </S.OptionWrapperDiv> <S.OptionWrapperDiv>
                            <S.WarningInput />
                            <S.WarningLabel> Skip this event and proceed with others</S.WarningLabel>
                        </S.OptionWrapperDiv>
                    </React.Fragment>}
                    <S.WarningFooter>
                        <S.DeleteButton  >Cancel</S.DeleteButton>
                        <S.SaveButton type="submit">Apply Changes</S.SaveButton>
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
