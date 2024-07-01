/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useRef} from "react";
import * as C from "@/utils/constants"
import * as F from "@/utils/functions"
import * as S from "@/styles/WeeklyCalendar.styles"
import { Event, Time } from "@/utils/classes"
import EventModal from "@/components/EventModal";
import HourLine from "@/components/HourLine";



const WeeklyCalendar: React.FC = () => {
  const [events, setEvent] = useState<Map<string, Event>>(new Map());
  const event = useRef<Event>(new Event());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [startingTime, setStartingTime] = useState<Time>(new Time(4,30));
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);


  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, date: Date): void => {
    e.preventDefault();
    // Do not continue if it's not the left mouse click button
    if(e.button !== 0) return;
  };

  const handleOnMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();

  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();

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
      <S.DaysOfTheWeek>{C.DAYS.map((day, i) => <S.Day key={i}>{day}</S.Day>)}</S.DaysOfTheWeek>
      <S.Main>
        <S.AsideTime>{F.generate24HourIntervals(startingTime).map((hour: string, i: number) => <S.Hour key={i}>{hour}</S.Hour>)}</S.AsideTime>
        <S.Events onMouseMove={(e) => handleOnMouseMove(e)}>
          {C.DAYS.map((day, i) => {
            const isToday = F.areDatesTheSame(F.addDateBy(F.getMonday(), i), currentTime);
            return (
              <S.DayColumn
                key={i}
                onMouseDown={(e) => handleMouseDown(e, F.addDateBy(F.getMonday(), i))}
                onMouseUp={(e) => handleMouseUp(e)}
              >
                {Array.from({ length: 48 }, (_, j) => <S.Cell key={j} />)} 

                {isToday && <S.HourLineDot $fromTop={F.getFromTop(currentTime.getHours(), currentTime.getMinutes())} />}
              </S.DayColumn>
            );
          })}
        </S.Events>
        <HourLine currentTime={currentTime}/>
      </S.Main>
      <EventModal
        handleModalClose={handleModalClose}
        isModalOpen={isModalOpen}
      />
      
    </S.Container>
  );
};



export default WeeklyCalendar;
