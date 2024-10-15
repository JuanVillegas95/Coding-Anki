import React from 'react';
import ShortEvent from './ShortEvent';
import LongEvent from './LongEvent';
import * as S from '../utils/style.calendar';
import { Event, COLORS } from "@/classes/Event";
import { MyTime } from '@/classes/MyTime';

const EventCard: React.FC<{
    event: Event;
    // isEventDragging: boolean;
    // eventOnMouseDown: T.EventOnMouseDownType;
    // isLinked: boolean
    // eventOnClick: ((e: React.MouseEvent<HTMLDivElement>, event: Event) => void) | (() => void);
}> = ({ event }) => {
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
        $isDragged={false}
        $borderStyle={borderStyle}
        // onClick={(e) => eventOnClick(e, event)}
        $isFriendEvent={false}
        $isLinked={false}
    >
        <S.EventTopDiv
            $color={isShortEvent ? "transparent" : COLORS[color].primary}
            // onMouseDown={(e) => eventOnMouseDown.top(e, event)}
            onClick={(e) => { e.stopPropagation() }}
        />
        {/* <S.EventBodyDiv onMouseDown={(e) => eventOnMouseDown.drag(e, event)} */}
        <S.EventBodyDiv>
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
        // onMouseDown={(e) => eventOnMouseDown.bottom(e, event)}
        />
    </S.EventDiv>
};

export default EventCard;
