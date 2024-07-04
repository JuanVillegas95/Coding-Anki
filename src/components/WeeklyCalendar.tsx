import React, { useState, useEffect, useRef } from "react";
import * as C from "@/utils/constants";
import * as F from "@/utils/functions";
import * as S from "@/styles/WeeklyCalendar.styles";
import { Event, Time } from "@/utils/classes";
import EventModal from "@/components/EventModal";
import HourLine from "@/components/HourLine";

const WeeklyCalendar: React.FC = () => {
  const [events, setEvents] = useState<Map<string, Event>>(
    new Map([["a", new Event(new Date('2024-07-03'), new Time(13, 0))]])
  );
  const event = useRef<Event>(new Event());
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [calendarStartTime, setCalendarStartTime] = useState<Time>(new Time(4, 30));
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, date: Date): void => {
    e.preventDefault();
    if (e.button !== 0) return;

    setIsMouseDown(true);

    const start: Time = F.calculateEventTime(e, calendarStartTime);
    const isOverlapping = F.isEventOverlapping(date, start, events);
    if (isOverlapping) return;

    event.current = new Event(date, start);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();
    if (!isMouseDown) return;

    event.current.end = F.calculateEventTime(e, calendarStartTime);
    const eventDuration: Time = F.getEventDuration(event.current);
    const isEventColliding: boolean = F.isEventColliding(
      event.current.date,
      event.current,
      events,
      calendarStartTime
    );

    const isEndBefore: boolean= F.isEndBeforeStart(event.current);
    if (eventDuration.minutes < 30 ||
        isEventColliding ||
        isEndBefore
    ) return;

    event.current.height = F.calculateEventHeight(event.current);

    setEvents((prevEvents) => new Map([...prevEvents, [event.current.id, event.current]]));
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();
    setIsMouseDown(false);
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
  };

  return (
    <S.Container>
      <S.Header>
        <S.Title>Header</S.Title>
        <S.Buttons>Hi</S.Buttons>
      </S.Header>
      <S.DaysOfTheWeek>
        {C.DAYS.map((day, i) => (
          <S.Day key={i}>{day}</S.Day>
        ))}
      </S.DaysOfTheWeek>
      <S.Main>
        <S.AsideTime>
          {F.generate24HourIntervals(calendarStartTime).map((hour: string, i: number) => (
            <S.Hour key={i}>{hour}</S.Hour>
          ))}
        </S.AsideTime>
        <S.Events onMouseMove={handleMouseMove}>
          {C.DAYS.map((day, i) => {
            const currentTime: Time = new Time(currentDate.getHours(), currentDate.getMinutes());
            const mondayDate = F.getMonday();
            const dayDate = F.addDateBy(mondayDate, i);
            const isToday = F.areDatesTheSame(dayDate, currentDate);
            const filteredEvents = Array.from(events.values()).filter((event) =>
              F.areDatesTheSame(event.date, dayDate)
            );

            return (
              <S.DayColumn
                key={i}
                onMouseDown={(e) => handleMouseDown(e, dayDate)}
                onMouseUp={handleMouseUp}
              >
                {Array.from({ length: 48 }, (_, j) => (
                  <S.Cell key={j} />
                ))}
                {filteredEvents.map(({ id, height, start, end, color, title, description }) => (
                  <S.Event
                    key={id}
                    $height={height}
                    $fromTop={F.calculateTopOffset(start, calendarStartTime)}
                    $color={color}
                  >
                    {String(start.hours).padStart(2, "0")}:{String(start.minutes).padStart(2, "0")}
                    <span>-</span>
                    {String(end.hours).padStart(2, "0")}:{String(end.minutes).padStart(2, "0")} <br />
                    <strong>{title}</strong> <br />
                    {description}
                  </S.Event>
                ))}
                {isToday && (
                  <S.HourLineDot $fromTop={F.calculateTopOffset(currentTime, calendarStartTime)} />
                )}
              </S.DayColumn>
            );
          })}
        </S.Events>
        <HourLine currentDate={currentDate} calendarStartTime={calendarStartTime} />
      </S.Main>
      <EventModal handleModalClose={handleModalClose} isModalOpen={isModalOpen} />
    </S.Container>
  );
};

export default WeeklyCalendar;
