import React from 'react';
import * as S from '@/styles/CalendarHub.styles';
import * as F from '@/utils/CalendarHub/functions';

const DateInput: React.FC<{
    text: string;
    date: Date | null;
    handleDate: (e: React.ChangeEvent<HTMLInputElement>, tag: string) => void;
}> = ({ text, date, handleDate }) => {
    const dateTag = `${text}Date`;
    const formatedDate: string = date ? F.formatDate(date) : "";

    return <S.TimeContainerDiv>
        <S.TimeP>{text}</S.TimeP>
        <S.DayInputDate value={formatedDate} onChange={(e) => handleDate(e, dateTag)} />
    </S.TimeContainerDiv>
};

export default DateInput;
