import React from 'react';
import * as S from '@/utils/styles';
import { Event } from '@/utils/classes';
import * as F from '@/utils/functions';
import * as C from '@/utils/constants';
import ShortEvent from './ShortEvent';
import LongEvent from './LongEvent';

const EventCard: React.FC<{
    event: Event;
    isEventDragging: boolean;
    eventOnMouseDown: {
        create: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, date: Date) => void;
        drag: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, event: Event) => void;
        bottom: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, event: Event) => void;
        top: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, event: Event) => void;
    };
    eventOnClick: (e: React.MouseEvent<HTMLDivElement>, event: Event) => void;
}> = ({ event, isEventDragging, eventOnMouseDown, eventOnClick }) => {
    const { id, height, start, end, duration, color, icon, title, description, eventGroupID } = event;

    const totalMinutes = F.timeToMinutes(duration);
    const topOffset = F.calculateTopOffset(start);
    const isShortEvent = totalMinutes < C.SHORT_DURATION_THRESHOLD;
    const borderStyle: string = eventGroupID ? "solid" : "dotted";
    return <S.EventDiv
        key={id}
        $fromTop={topOffset}
        $height={height}
        $backgroundColor={C.COLORS[color].secondary}
        $borderColor={C.COLORS[color].primary}
        $isDragged={isEventDragging}
        $borderStyle={borderStyle}
        onClick={(e) => eventOnClick(e, event)}
    >
        <S.EventTopDiv
            $color={isShortEvent ? "transparent" : C.COLORS[color].primary}
            onMouseDown={(e) => eventOnMouseDown.top(e, event)}
            onClick={(e) => { e.stopPropagation() }}
        />
        <S.EventBodyDiv onMouseDown={(e) => eventOnMouseDown.drag(e, event)}
        >
            {isShortEvent ? (
                <ShortEvent title={title} />
            ) : (
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
            )}
        </S.EventBodyDiv>
        <S.EventBottomDiv
            onClick={(e) => { e.stopPropagation() }}
            onMouseDown={(e) => eventOnMouseDown.bottom(e, event)}
        />
    </S.EventDiv>
};

export default EventCard;
