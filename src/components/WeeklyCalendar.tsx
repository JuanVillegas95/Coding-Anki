/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useRef} from "react";
import * as CONST from "@/utils/constants"
import * as F from "@/utils/functions"
import * as S from "@/styles/WeeklyCalendar.styles"
import { Event } from "@/utils/classes"
import EventModal from './EventModal';


const WeeklyCalendar: React.FC = () => {
  const [events, setEvent] = useState<Map<string, Event>>(new Map());
  const eventId = useRef<string>("");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);


  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, date: Date): void => {
    e.preventDefault();
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
      <S.DaysOfTheWeek>{CONST.DAYS.map((day, i) => <S.Day key={i}>{day}</S.Day>)}</S.DaysOfTheWeek>
      <S.Main>
        <S.AsideTime>{F.range(24).map((hour, i) => <S.Hour key={i}>{hour}</S.Hour>)}</S.AsideTime>
        <S.Events onMouseMove={(e) => handleOnMouseMove(e)}>
          {CONST.DAYS.map((day, i) => {
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
        <S.HourLine $fromTop={F.getFromTop(currentTime.getHours(), currentTime.getMinutes())}>
          {currentTime.getHours()}:{currentTime.getMinutes()}
          <S.LineAfterHour />
        </S.HourLine>
      </S.Main>

      <EventModal
        handleModalClose={handleModalClose}
        isModalOpen={isModalOpen}
      />
      
    </S.Container>
  );
};

export default WeeklyCalendar;
