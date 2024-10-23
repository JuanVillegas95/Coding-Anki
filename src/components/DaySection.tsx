import React, { useEffect } from 'react';
import * as S from '../utils/style.calendar';
import { MyDate } from '@/classes/MyDate';
const DaySection: React.FC<{ monday: MyDate }> = ({ monday }) => {
  // useEffect(() => {
  //   console.log(monday)
  // }, [monday])
  return (
    <S.ContainerSection>
      {MyDate.DAYS.map((day, i) => {
        const temp: MyDate = new MyDate(monday.getJsDate())
        temp.addBy(i);
        const isToday: boolean = temp.areDatesTheSame(new Date())
        return <S.SectionDayDiv key={i}>
          <S.DayNameP>{day.slice(0, 3)}</S.DayNameP>
          <S.ContianerNumberDiv $isToday={isToday}>
            <S.DayNumberP $isToday={isToday}>{temp.getJsDate().getDate()}</S.DayNumberP>
          </S.ContianerNumberDiv>
        </S.SectionDayDiv>
      })}
    </S.ContainerSection>
  );
};

export default DaySection;
