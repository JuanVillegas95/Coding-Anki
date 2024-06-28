/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import * as CONST from "@/utils/constants"
import * as S from "@/styles/WeeklyCalendar.styles"
import { EventProps } from "@/utils/classes"
import EventModal from './EventModal';


const WeeklyCalendar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [events, setEvents] = useState<EventProps[]>([]);
  const [currentEvent, setCurrentEvent] = useState<EventProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);


  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, date: Date): void => {
    e.preventDefault();

    if (e.button !== 0) return; // Only proceed for left mouse button

    const { clientY, currentTarget } = e;
    const topOffset: number = currentTarget.getBoundingClientRect().top;
    const [startHour, startMinutes]: [number, number] = calculateEventTime(clientY, topOffset);

    const newEvent = new EventProps(date, { hours: startHour, minutes: startMinutes });

    if (!detectCollision(newEvent, events)) {
      setEvents(prevEvents => [...prevEvents, newEvent]);
      setCurrentEvent(newEvent);
    }
  };

  const handleOnMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();

    // Only proceed for left mouse button and if currentEvent is not null
    if (e.button !== 0 || !currentEvent) return;

    const { clientY, currentTarget } = e;
    const topOffset = currentTarget.getBoundingClientRect().top;
    const [endHour, endMinutes] = calculateEventTime(clientY, topOffset);
    const newHeight = calculateEventHeight(currentEvent.startTime, { hours: endHour, minutes: endMinutes });

    // Ensure minimum height for the event
    if (newHeight < (30 / 60) * CONST.HOUR_HEIGHT) return;

    setCurrentEvent({
      ...currentEvent,
      height: newHeight,
      endTime: { hours: endHour, minutes: endMinutes }
    });

    // Check for collision with other events except the last one
    if (!detectCollision(currentEvent, events.slice(0, -1))) updateCurrentEvent();
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();
  
    // Only proceed for left mouse button and if currentEvent is not null
    if (e.button !== 0 || !currentEvent) return;
  
    // Ensure the event duration is at least 30 minutes
    const durationInMinutes: number = currentEvent.height / CONST.HOUR_HEIGHT * 60;
    if (durationInMinutes < 30) {
      deleteEvent(currentEvent);
      setCurrentEvent(null);
      alert("Events must be at least 30 minutes long.");
      return;
    }
  
    setIsModalOpen(true);
  };

  const updateCurrentEvent = (): void => {
    if(!currentEvent) return;
    setEvents(prevEvents => prevEvents.map(event => event.id === currentEvent.id ? currentEvent : event));
  };

  const deleteEvent = (eventToDelete: EventProps): void => {
    setEvents(events.filter(event => event.id !== eventToDelete.id));
    setIsModalOpen(false);
  };

  const handleEventClick = (event: EventProps): void => {
    setCurrentEvent(event);
    setIsModalOpen(true);
  };

  const handleModalClose = (): void => {
    setCurrentEvent(null);
    setIsModalOpen(false);
  };


  const handleEventChange = (key: keyof EventProps, value: any): void => {
    if (!currentEvent) return;
  
    let updatedEvent = { ...currentEvent, [key]: value };
  
    if (key === "startTime" || key === "endTime") {
      const startTime = key === "startTime" ? value : updatedEvent.startTime;
      const endTime = key === "endTime" ? value : updatedEvent.endTime;
  
      const startInMinutes = startTime.hours * 60 + startTime.minutes;
      const endInMinutes = endTime.hours * 60 + endTime.minutes;
  
      if (startInMinutes >= endInMinutes) {
        alert("Start time cannot be greater than or equal to end time.");
        return;
      }
  
      updatedEvent.height = calculateEventHeight(startTime, endTime);
    }
  
    const hasCollision = detectCollision(updatedEvent, events.filter(event => event.id !== currentEvent.id));
  
    if (hasCollision) {
      alert("There is already an event scheduled for this time.");
      return;
    }
  
    setCurrentEvent(updatedEvent);
  };
  
  

  return (
    <S.Container>
      <S.Header>
        <S.Title>Header</S.Title>
        <S.Buttons>Hi</S.Buttons>
      </S.Header>
      <S.DaysOfTheWeek>{CONST.DAYS.map((day, i) => <S.Day key={i}>{day}</S.Day>)}</S.DaysOfTheWeek>
      <S.Main>
        <S.AsideTime>{range(24).map((hour, i) => <S.Hour key={i}>{hour}</S.Hour>)}</S.AsideTime>
        <S.Events onMouseMove={(e) => handleOnMouseMove(e)}>
          {CONST.DAYS.map((day, i) => {
            const isToday = areDatesTheSame(addDateBy(getMonday(), i), currentTime);
            return (
              <S.DayColumn
                key={i}
                onMouseDown={(e) => handleMouseDown(e, addDateBy(getMonday(), i))}
                onMouseUp={(e) => handleMouseUp(e)}
              >
                {Array.from({ length: 48 }, (_, j) => <S.Cell key={j} />)} 

                {events
                  .filter(event => areDatesTheSame(event.date, addDateBy(getMonday(), i)))
                  .map((event, j) => (
                    <S.Event
                      key={j}
                      $height={event.height}
                      $fromTop={getFromTop(event.startTime.hours, event.startTime.minutes)}
                      $color={event.color}
                      onClick={() => handleEventClick(event)}
                    >
                      {String(event.startTime.hours).padStart(2, '0')}:{String(event.startTime.minutes).padStart(2, '0')}<span>-</span>
                      {String(event.endTime.hours).padStart(2, '0')}:{String(event.endTime.minutes).padStart(2, '0')} <br />
                      <strong>{event.title}</strong> <br />
                      {event.description}
                    </S.Event>
                  ))
                }

                {isToday && <S.HourLineDot $fromTop={getFromTop(currentTime.getHours(), currentTime.getMinutes())} />}
              </S.DayColumn>
            );
          })}
        </S.Events>
        <S.HourLine $fromTop={getFromTop(currentTime.getHours(), currentTime.getMinutes())}>
          {currentTime.getHours()}:{currentTime.getMinutes()}
          <S.LineAfterHour />
        </S.HourLine>
      </S.Main>

      <EventModal
        handleEventChange={handleEventChange}
        handleModalClose={handleModalClose}
        updateCurrentEvent={updateCurrentEvent}
        isModalOpen={isModalOpen}
        currentEvent={currentEvent}
        deleteEvent={deleteEvent}
      />
      
    </S.Container>
  );
};

// Functions
const range = (keyCount: number): number[] => [...Array(keyCount).keys()];

const areDatesTheSame = (first: Date, second: Date): boolean =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const addDateBy = (date: Date, count: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + count);
  return d;
};

const getMonday = (): Date => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(today.setDate(diff));
};

const getFromTop = (hours: number, minutes: number): number => hours * CONST.HOUR_HEIGHT + (minutes / 60) * CONST.HOUR_HEIGHT;

const calculateEventHeight = (startTime: { hours: number, minutes: number }, endTime: { hours: number, minutes: number }): number => {
  const startInMinutes = startTime.hours * 60 + startTime.minutes;
  const endInMinutes = endTime.hours * 60 + endTime.minutes;
  const durationInMinutes = endInMinutes - startInMinutes;
  return (durationInMinutes / 60) * CONST.HOUR_HEIGHT;
};

const calculateEventTime = (mouseInitialPositionY: number, mainTop: number): [number, number] => {
  const yPos = mouseInitialPositionY - mainTop;
  const startHour = Math.floor(yPos / CONST.HOUR_HEIGHT);
  const startMinutes = Math.floor(((yPos % CONST.HOUR_HEIGHT) / CONST.HOUR_HEIGHT) * 60);
  return [startHour, startMinutes];
};


const detectCollision = (newEvent: EventProps, events: EventProps[]): boolean => {
  for (const event of events) {
    if (areDatesTheSame(newEvent.date, event.date)) {
      const newEventStart = newEvent.startTime.hours * 60 + newEvent.startTime.minutes;
      const newEventEnd = newEventStart + (newEvent.height / CONST.HOUR_HEIGHT) * 60;
      const eventStart = event.startTime.hours * 60 + event.startTime.minutes;
      const eventEnd = eventStart + event.height / CONST.HOUR_HEIGHT * 60;

      if ((newEventStart < eventEnd && newEventEnd > eventStart) ||
        (eventStart < newEventEnd && eventEnd > newEventStart)) {
        return true;
      }
    }
  }
  return false;
};

const generateHours = (timeStart: string): string[] => {
  const hoursArray: string[] = [];
  let hour = parseInt(timeStart.substring(0, 2), 10);
  let minutes = parseInt(timeStart.substring(3, 5), 10);

  for (let i = 0; i < 24; i++) {
    let hourFormatted = hour < 10 ? `0${hour}` : `${hour}`;
    let minutesFormatted = minutes < 10 ? `0${minutes}` : `${minutes}`;
    hoursArray.push(`${hourFormatted}:${minutesFormatted}`);
    hour = (hour + 1) % 24;
  }

  return hoursArray;
};

export default WeeklyCalendar;
