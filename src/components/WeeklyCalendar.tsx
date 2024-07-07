import React, { useState, useEffect, useRef } from "react";
import * as C from "@/utils/constants";
import * as F from "@/utils/functions";
import * as S from "@/styles/WeeklyCalendar.styles";
import { Event, Time } from "@/utils/classes";
import EventModal from "@/components/EventModal";
import HourLine from "@/components/HourLine";
import Events from "./Events";

const WeeklyCalendar: React.FC = () => {
  const [events, setEvents] = useState<Map<string, Event>>(new Map());
  const event = useRef<Event>(C.NULL_EVENT);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
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
    if (e.button !== C.LEFT_MOUSE_CLICK) return;

    setIsMouseDown(true);

    const newEventStart: Time = F.calculateEventStart(e);
    const eventOverlapping = F.isEventOverlapping(date, newEventStart, events);
    if (eventOverlapping) return;
    event.current = new Event(date, newEventStart);

  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();

    if(!isMouseDown) return;

    const newEvent: Event = new Event(event.current.date,event.current.start);
    newEvent.height = F.calculateEventHeight(e, newEvent);
    newEvent.end = F.calculateEventEnd(newEvent);
    newEvent.id = event.current.id;

    const newEventValid: Boolean= F.isNewEventValid(newEvent,events);

    if (!newEventValid) return;

    event.current.height = newEvent.height
    event.current.end = newEvent.end

    setEvents((prevEvents) => new Map([...prevEvents, [event.current.id, event.current]]));
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();
    setIsMouseDown(false);

    const newEventValid: Boolean= F.isNewEventValid(event.current,events);

    if (!newEventValid) {
      setEvents((prevEvents) => {
        const updatedEvents = new Map(prevEvents);
        updatedEvents.delete(event.current.id);
        return updatedEvents;
      });
    }

    event.current = C.NULL_EVENT;
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
          {F.generate24HourIntervals().map((hour: string, i: number) => (
            <S.Hour key={i}>{hour}</S.Hour>
          ))}
        </S.AsideTime>
        <S.Cells onMouseMove={handleMouseMove} onMouseLeave={()=>setIsMouseDown(false)}>
          {C.DAYS.map((day, i) => {
            const currentTime: Time = new Time(currentDate.getHours(), currentDate.getMinutes());
            const mondayDate = F.getMostRecentMonday();
            const dayDate: Date = F.addDateBy(mondayDate, i);
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
                {Array.from({ length: 48 }, (_, j) => <S.Cell key={j} />)}

                <Events events={filteredEvents} />
                
                {isToday && <S.HourLineDot $fromTop={F.calculateTopOffset(currentTime)} />}
              </S.DayColumn>
            );
          })}
        </S.Cells>
        <HourLine currentDate={currentDate} />
      </S.Main>
      {/* <EventModal handleModalClose={handleModalClose} isModalOpen={isModalOpen} /> */}
    </S.Container>
  );
};

export default WeeklyCalendar;
