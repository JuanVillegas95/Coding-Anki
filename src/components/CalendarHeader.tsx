import React, { useState, useEffect } from 'react';
import * as S from '@/utils/style.calendar';
import * as I from '@/utils/icons';
import * as F from '@/utils/functions';
import * as T from '@/utils/types';


const CalendarHeader: React.FC<{
    mondayDate: Date,
    weekHandler: T.WeekHandler
    linkIcon: string;
    toggleLink: () => void;
}> = ({ weekHandler, mondayDate, linkIcon, toggleLink }) => {

    return <S.ContainerHeader>
        <S.CalendarNameDiv>
            <S.CalendarNameInput value={undefined} onChange={undefined} />
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
