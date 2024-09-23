import React, { useState } from 'react';
import * as S from '@/styles/CalendarHub.styles';
import * as I from '@/utils/icons';
import * as F from '@/utils/functions';

const CalendarHeader: React.FC<{
    mondayDate: Date,
    name: string,
    changeCalendarName: (e: React.ChangeEvent<HTMLInputElement>) => void,
    weekHandler: {
        nextWeek: () => void;
        previousWeek: () => void;
        currentWeek: () => void;
    };
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
                onClick={weekHandler.previousWeek}
            >
                <I.left />
            </S.ChangeWeekButton>
            <S.TodayButton onClick={weekHandler.currentWeek}>Today</S.TodayButton>
            <S.ChangeWeekButton
                $color={'black'}
                $size={30}
                $svgSize={15}
                onClick={weekHandler.nextWeek}
            >
                <I.right />
            </S.ChangeWeekButton>
        </S.ChangeWeekDiv>
    </S.ContainerHeader>
};

export default CalendarHeader;
