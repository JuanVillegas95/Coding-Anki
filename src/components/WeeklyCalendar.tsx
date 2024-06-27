/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from 'uuid';
import EventModal from './EventModal';

export class EventProps {
  id: string;
  date: Date;
  startTime: { hours: number; minutes: number };
  endTime: { hours: number; minutes: number };
  title: string;
  description: string;
  height: number;
  color: string;

  constructor(
    date: Date,
    startTime: { hours: number; minutes: number },
    endTime: { hours: number; minutes: number } = {hours: 0, minutes: 0 },
    title: string = "",
    description: string = "",
    height: number = 0,
    color: string = "gray"
  ) {
    this.id = uuidv4();
    this.date = date;
    this.startTime = { hours: startTime.hours, minutes: startTime.minutes };
    this.endTime = { hours: endTime.hours, minutes:endTime.minutes };
    this.title = title;
    this.description = description;
    this.height = height;
    this.color = color;
  }
}

// Constants
const HOUR_WIDTH: number = 40;
const HOUR_HEIGHT: number = 50;
const HEADER_HEIGHT: number = 60;
const DAYS_OF_THE_WEEK_HEIGHT: number = 70;
export const DAYS: Array<string> = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];


// Styled Components
const Container = styled.div`
  width: 90%;
  max-width: 1200px;
  height: 80vh;
  margin: 0 50px;
  border-radius: 2%;
  background-color: white;

  display: grid;
  grid-template-rows: ${HEADER_HEIGHT}px ${DAYS_OF_THE_WEEK_HEIGHT}px 1fr;
`;

const Header = styled.div`
  padding: 5px;
  box-shadow: 0 .2px 0 0 slategray;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  text-align: left; 
  font-family: 'Poppins', sans-serif;
  font-weight: 600; 
  position: relative;
  display: inline-block;
  margin-bottom: 10px;

  &::after {
    content: '';
    display: block;
    width: 100%;
    border-bottom: 2px dashed #A0A0A0; 
    margin-top: 5px; 
  }
`;

const Buttons = styled.div`
  text-align: right; 
`;

const DaysOfTheWeek = styled.div`
  align-items: center; 

  font-family: 'Poppins', sans-serif;
  font-weight: 600; 

  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-left: ${HOUR_WIDTH}px;
`;

const Day = styled.div`
  text-align: center; 
`;

const Main = styled.div`
  position: relative;
  overflow-y: scroll;

  display: grid;
  grid-template-columns: ${HOUR_WIDTH}px 1fr;
`;

const AsideTime = styled.div`
  text-align: center; 
  align-items: center; 
  justify-items: center; 
`;

const Hour = styled.div`
  font-family: 'Poppins', sans-serif;
  font-weight: 500; 
  height: ${HOUR_HEIGHT}px;
`;

const DayColumn = styled.div`
  position: relative;
`;

const Events = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const Event = styled.div<{ $fromTop: number, $height: number, $color: string }>`
  position: absolute;
  z-index: 40;
  width: calc(100% - 5px);
  left: 2.5px;
  top: ${({ $fromTop }) => $fromTop}px;
  background: green;
  margin: 0;
  height: ${({ $height }) => $height}px;
  border: 1px solid var(--primary-${({ $color }) => $color});
  background-color: var(--secondary-${({ $color }) => $color});
  border-width: 2px;
  border-radius: 0.5rem;
  padding: 5px; /* Adjust padding if necessary */

  white-space: normal; /* Ensure text wrapping */
  overflow: hidden; /* Prevent overflow */

  &:hover {
    cursor: pointer;
  }

  strong {
    display: block;
  }
`;


const HourLine = styled.div<{ $fromTop: number }>`
  position: absolute;
  margin-left: 5px;
  z-index: 2;
  width: calc(100% - 5px);
  top: ${({ $fromTop }) => $fromTop}px;
  color: red; 
  font-size: 15px; 
  display: flex;
  align-items: center;
  font-family: 'Poppins', sans-serif;
  font-weight: 500; 
  pointer-events: none;
`;

const LineAfterHour = styled.div`
  flex: 1;
  height: 1px;
  background-color: red; 
`;

const HourLineDot = styled.div<{ $fromTop: number }>`
  position: absolute;
  width: 10px; 
  height: 10px; 
  border-radius: 50%; 
  background-color: orange; 
  top: ${({ $fromTop }) => $fromTop}px;
  left: calc(50% - 5px);
  transform: translateX(-50%);
`;

const Cell = styled.div`
  height: calc(${HOUR_HEIGHT}px / 2);
  box-shadow: .2px .2px 0 0 slategray;
`;

// Main
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
    if (newHeight < (30 / 60) * HOUR_HEIGHT) return;

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
    const durationInMinutes: number = currentEvent.height / HOUR_HEIGHT * 60;
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
    <Container>
      <Header>
        <Title>Header</Title>
        <Buttons>Hi</Buttons>
      </Header>
      <DaysOfTheWeek>{DAYS.map((day, i) => <Day key={i}>{day}</Day>)}</DaysOfTheWeek>
      <Main>
        <AsideTime>{range(24).map((hour, i) => <Hour key={i}>{hour}</Hour>)}</AsideTime>
        <Events onMouseMove={(e) => handleOnMouseMove(e)}>
          {DAYS.map((day, i) => {
            const isToday = areDatesTheSame(addDateBy(getMonday(), i), currentTime);
            return (
              <DayColumn
                key={i}
                onMouseDown={(e) => handleMouseDown(e, addDateBy(getMonday(), i))}
                onMouseUp={(e) => handleMouseUp(e)}
              >
                {Array.from({ length: 48 }, (_, j) => <Cell key={j} />)} 

                {events
                  .filter(event => areDatesTheSame(event.date, addDateBy(getMonday(), i)))
                  .map((event, j) => (
                    <Event
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
                    </Event>
                  ))
                }

                {isToday && <HourLineDot $fromTop={getFromTop(currentTime.getHours(), currentTime.getMinutes())} />}
              </DayColumn>
            );
          })}
        </Events>
        <HourLine $fromTop={getFromTop(currentTime.getHours(), currentTime.getMinutes())}>
          {currentTime.getHours()}:{currentTime.getMinutes()}
          <LineAfterHour />
        </HourLine>
      </Main>

      <EventModal
        handleEventChange={handleEventChange}
        handleModalClose={handleModalClose}
        updateCurrentEvent={updateCurrentEvent}
        isModalOpen={isModalOpen}
        currentEvent={currentEvent}
        deleteEvent={deleteEvent}
      />
    </Container>
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

const getFromTop = (hours: number, minutes: number): number => hours * HOUR_HEIGHT + (minutes / 60) * HOUR_HEIGHT;

const calculateEventHeight = (startTime: { hours: number, minutes: number }, endTime: { hours: number, minutes: number }): number => {
  const startInMinutes = startTime.hours * 60 + startTime.minutes;
  const endInMinutes = endTime.hours * 60 + endTime.minutes;
  const durationInMinutes = endInMinutes - startInMinutes;
  return (durationInMinutes / 60) * HOUR_HEIGHT;
};

const calculateEventTime = (mouseInitialPositionY: number, mainTop: number): [number, number] => {
  const yPos = mouseInitialPositionY - mainTop;
  const startHour = Math.floor(yPos / HOUR_HEIGHT);
  const startMinutes = Math.floor(((yPos % HOUR_HEIGHT) / HOUR_HEIGHT) * 60);
  return [startHour, startMinutes];
};


const detectCollision = (newEvent: EventProps, events: EventProps[]): boolean => {
  for (const event of events) {
    if (areDatesTheSame(newEvent.date, event.date)) {
      const newEventStart = newEvent.startTime.hours * 60 + newEvent.startTime.minutes;
      const newEventEnd = newEventStart + (newEvent.height / HOUR_HEIGHT) * 60;
      const eventStart = event.startTime.hours * 60 + event.startTime.minutes;
      const eventEnd = eventStart + event.height / HOUR_HEIGHT * 60;

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
