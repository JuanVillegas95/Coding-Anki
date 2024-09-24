import React, { useState, useEffect } from 'react';
import * as S from '@/utils/styles';
import * as I from '@/utils/icons';
import * as F from '@/utils/functions';
import * as T from '@/utils/types';


const CalendarHeader: React.FC<{
    mondayDate: Date,
    name: string,
    changeCalendarName: (e: React.ChangeEvent<HTMLInputElement>) => void,
    weekHandler: T.WeekHandler
    linkIcon: string;
    toggleLink: () => void;
}> = ({ name, changeCalendarName, weekHandler, mondayDate, linkIcon, toggleLink }) => {

    return <S.ContainerHeader>
        <S.CalendarNameDiv>
            <S.CalendarNameInput value={name} onChange={changeCalendarName} />
        </S.CalendarNameDiv>
        <S.HeaderRigthestWrapperDiv>
            <S.MonthP>{F.getMonth(mondayDate)}</S.MonthP>
            <S.ChangeWeekDiv>
                <S.ChangeWeekButton
                    $color={'black'}
                    $size={30}
                    $svgSize={15}
                    onClick={weekHandler.prev}
                >
                    {React.createElement(I.left)}
                </S.ChangeWeekButton>
                <S.TodayButton onClick={weekHandler.curr}>Today</S.TodayButton>
                <S.ChangeWeekButton
                    $color={'black'}
                    $size={30}
                    $svgSize={15}
                    onClick={weekHandler.next}
                >
                    {React.createElement(I.right)}
                </S.ChangeWeekButton>
            </S.ChangeWeekDiv>
        </S.HeaderRigthestWrapperDiv>
        <S.LinkIconImg src={linkIcon} onClick={toggleLink} />
    </S.ContainerHeader>
};

export default CalendarHeader;
