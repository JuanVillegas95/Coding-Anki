import React from 'react';
import { Event, Time } from "@/utils/classes";
import * as S from "@/styles/Events.style";
import * as F from "@/utils/functions";

const Events: React.FC<{ events: Event[] }> = ({ events }) => {
  return (
    <div>
      {events.map(({ id, height, start, end, color, title, description }) => {
        const formatTime = (unit: number): string => (unit < 10 ? `0${unit}` : `${unit}`)
        const startHours: string = formatTime(start.hours);
        const startMinutes: string = formatTime(start.minutes);
        const endHours: string = formatTime(end.hours);
        const endMinutes: string = formatTime(end.minutes);

        return(
        <S.Event
          key={id}
          $height={height}
          $fromTop={F.calculateTopOffset(start)}
          $color={color}
        >
          {startHours}:{startMinutes}
          <span>-</span>
          {endHours}:{endMinutes} <br />
          <strong>{title}</strong> <br />
          {description}
        </S.Event>)
      })}
    </div>
  );
};

export default Events;
