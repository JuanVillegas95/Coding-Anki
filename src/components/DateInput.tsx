import React from 'react';
import * as S from '@/utils/style.calendar';
import * as F from '@/utils/functions';

const DateInput: React.FC<{
    text: string;
    date: Date | null;
    handleDate: (e: React.ChangeEvent<HTMLInputElement>, tag: string) => void;
}> = ({ text, date, handleDate }) => {
    const dateTag = `${text}Date`;
    const formatedDate: string = date ? F.formatDate(date) : "";
    const isDisabled: boolean = (text === "Start");

    return <S.TimeContainerDiv>
        <S.TimeP>{text}</S.TimeP>
        <S.DayInputDate value={formatedDate} onChange={isDisabled ? undefined : (e) => handleDate(e, dateTag)} $isDisabled={isDisabled} />
    </S.TimeContainerDiv>
};

export default DateInput;
