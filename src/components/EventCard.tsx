import React from 'react';
import ShortEvent from './ShortEvent';
import LongEvent from './LongEvent';
import * as S from '../utils/style.calendar';
import { Event, COLORS } from "@/classes/Event";
import { MyTime } from '@/classes/MyTime';

const EventCard: React.FC<{
    eventOnClick: ((e: React.MouseEvent<HTMLDivElement>, event: Event) => void) | (() => void);
    topOnMouseDown: (e: React.MouseEvent<HTMLDivElement>, eventToResize: Event) => void;
    botOnMouseDown: (e: React.MouseEvent<HTMLDivElement>, eventToResize: Event) => void;
    dragOnMouseDown: (e: React.MouseEvent<HTMLDivElement>, eventToDrag: Event) => void;
    event: Event;
    isDrag: boolean;

    // eventOnMouseDown: T.EventOnMouseDownType;
    // isLinked: boolean
}> = ({ event, topOnMouseDown, botOnMouseDown, dragOnMouseDown, isDrag, eventOnClick }) => {
    const { startTime, endTime, color, title, description, icon, recurringId } = event.getAttributes();
    const totalMinutes = event.getDurationMinutes();
    const topOffset = startTime.getTimeInPixels();
    const height = event.getHeight();
    const isShortEvent = totalMinutes < Event.THRESHOLD_MINUTES;
    const borderStyle: string = recurringId ? "solid" : "dotted";

    return <S.EventDiv
        $fromTop={topOffset}
        $height={height}
        $backgroundColor={COLORS[color].secondary}
        $borderColor={COLORS[color].primary}
        $isDragged={isDrag}
        $borderStyle={borderStyle}
        onClick={(e) => eventOnClick(e, event)}
        $isFriendEvent={false}
        $isLinked={false}
    >
        <S.EventTopDiv
            $color={isShortEvent ? "transparent" : COLORS[color].primary}
            onMouseDown={(e) => topOnMouseDown(e, event)}
        />
        <S.EventBodyDiv onMouseDown={(e) => dragOnMouseDown(e, event)}>
            {isShortEvent ?
                <ShortEvent title={title ? title : ""} />
                :
                <LongEvent
                    color={color}
                    startHours={MyTime.formatTime(startTime.getHours())}
                    startMinutes={MyTime.formatTime(startTime.getMinutes())}
                    endHours={MyTime.formatTime(endTime.getHours())}
                    endMinutes={MyTime.formatTime(endTime.getMinutes())}
                    icon={icon}
                    title={title ? title : ""}
                    description={description ? description : ""}
                    isLinked={false}
                />
            }
        </S.EventBodyDiv>
        <S.EventBottomDiv
            onClick={(e) => { e.stopPropagation() }}
            onMouseDown={(e) => botOnMouseDown(e, event)}
        />
    </S.EventDiv>
};

export default EventCard;
