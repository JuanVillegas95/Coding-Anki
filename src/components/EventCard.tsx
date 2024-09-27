import React from 'react';
import { Event } from '@/utils/classes';
import ShortEvent from './ShortEvent';
import LongEvent from './LongEvent';
import * as S from '@/utils/style.calendar';
import * as F from '@/utils/functions';
import * as C from '@/utils/constants';
import * as T from '@/utils/types';

const EventCard: React.FC<{
    event: Event;
    isEventDragging: boolean;
    eventOnMouseDown: T.EventOnMouseDownType;
    isLinked: boolean
    eventOnClick: ((e: React.MouseEvent<HTMLDivElement>, event: Event) => void) | (() => void);
}> = ({ event, isEventDragging, eventOnMouseDown, eventOnClick, isLinked }) => {
    const { id, height, start, end, duration, color, icon, title, description, groupID, isFriendEvent } = event;
    // console.log(eventOnClick)
    const totalMinutes = F.timeToMinutes(duration);
    const topOffset = F.calculateTopOffset(start);
    const isShortEvent = totalMinutes < C.SHORT_DURATION_THRESHOLD;
    const borderStyle: string = groupID ? "solid" : "dotted";
    return <S.EventDiv
        key={id}
        $fromTop={topOffset}
        $height={height}
        $backgroundColor={C.COLORS[color].secondary}
        $borderColor={C.COLORS[color].primary}
        $isDragged={isEventDragging}
        $borderStyle={borderStyle}
        onClick={(e) => eventOnClick(e, event)}
        $isFriendEvent={isFriendEvent}
        $isLinked={isLinked}
    >
        <S.EventTopDiv
            $color={isShortEvent ? "transparent" : C.COLORS[color].primary}
            onMouseDown={(e) => eventOnMouseDown.top(e, event)}
            onClick={(e) => { e.stopPropagation() }}
        />
        <S.EventBodyDiv onMouseDown={(e) => eventOnMouseDown.drag(e, event)}
        >
            {isShortEvent ?
                <ShortEvent title={title} />
                :
                <LongEvent
                    color={color}
                    startHours={F.formatTime(start.hours)}
                    startMinutes={F.formatTime(start.minutes)}
                    endHours={F.formatTime(end.hours)}
                    endMinutes={F.formatTime(end.minutes)}
                    icon={icon}
                    title={title}
                    description={description}
                    isLinked={isLinked}
                />
            }
        </S.EventBodyDiv>
        <S.EventBottomDiv
            onClick={(e) => { e.stopPropagation() }}
            onMouseDown={(e) => eventOnMouseDown.bottom(e, event)}
        />
    </S.EventDiv>
};

export default EventCard;
