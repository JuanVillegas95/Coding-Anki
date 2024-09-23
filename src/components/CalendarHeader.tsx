import React, { useState } from 'react';
import * as S from '@/utils/styles';
import * as I from '@/utils/icons';
import * as F from '@/utils/functions';
import * as T from '@/utils/types';

const CalendarHeader: React.FC<{
    mondayDate: Date,
    name: string,
    changeCalendarName: (e: React.ChangeEvent<HTMLInputElement>) => void,
    weekHandler: T.WeekHandler
}> = ({ name, changeCalendarName, weekHandler, mondayDate }) => {
    return <S.ContainerHeader>
        <S.CalendarNameDiv>
            <S.CalendarNameInput value={name} onChange={changeCalendarName} />
        </S.CalendarNameDiv>
        <S.ChangeWeekDiv>
            <S.MonthP>{F.getMonth(mondayDate)}</S.MonthP>
            <S.ChangeWeekButton
                $color={'black'}
                $size={30}
                $svgSize={15}
                onClick={weekHandler.prev}
            >
                <I.left />
            </S.ChangeWeekButton>
            <S.TodayButton onClick={weekHandler.curr}>Today</S.TodayButton>
            <S.ChangeWeekButton
                $color={'black'}
                $size={30}
                $svgSize={15}
                onClick={weekHandler.next}
            >
                <I.right />
            </S.ChangeWeekButton>
        </S.ChangeWeekDiv>
    </S.ContainerHeader>
};

export default CalendarHeader;
