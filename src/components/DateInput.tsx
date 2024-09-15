import React from 'react';
import * as S from '@/styles/CalendarHub.styles';
import * as F from '@/utils/CalendarHub/functions';

const DateInput: React.FC<{
    text: string;
    date: Date;
    handleDate: (e: React.ChangeEvent<HTMLInputElement>, tag: string) => void;
}> = ({ text, date, handleDate }) => {
    const dateTag = `${text}Date`;

    return (
        <S.TimeContainerDiv>
            <S.TimeP>{text}</S.TimeP>
            <S.DayInputDate value={F.formatDate(date)} onChange={(e) => handleDate(e, dateTag)} />
        </S.TimeContainerDiv>
    );
};

export default DateInput;
