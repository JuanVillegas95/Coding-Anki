import React from 'react';
import * as S from '@/utils/style.calendar';
import * as C from '@/utils/constants';
import * as F from '@/utils/functions';

const DaySection: React.FC<{ mondayDate: Date }> = ({ mondayDate }) => {
  return (
    <S.ContainerSection>
      {C.DAYS.map((day, i) => {
        const dayOfTheMonth = F.addDateBy(mondayDate, i);
        const dayOfTheMonthNumber = dayOfTheMonth.getUTCDate().toString();
        const isToday = F.areDatesTheSame(dayOfTheMonth, new Date());

        return <S.SectionDayDiv key={i}>
          <S.DayNameP>{day.slice(0, 3)}</S.DayNameP>
          <S.ContianerNumberDiv $isToday={isToday}>
            <S.DayNumberP $isToday={isToday}>{dayOfTheMonthNumber}</S.DayNumberP>
          </S.ContianerNumberDiv>
        </S.SectionDayDiv>
      })}
    </S.ContainerSection>
  );
};

export default DaySection;
