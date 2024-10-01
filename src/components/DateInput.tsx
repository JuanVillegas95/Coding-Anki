import React from 'react';
import * as S from '@/utils/style.calendar';
import * as F from '@/utils/functions';

const DateInput: React.FC<{
    text: string;
    date: string;
    handleDate: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ text, date, handleDate }) => {
    const isDisabled: boolean = (text === "Start");

    return <S.TimeContainerDiv>
        <S.TimeP>{text}</S.TimeP>
        <S.DayInputDate value={date} onChange={isDisabled ? undefined : (e) => handleDate(e)} $isDisabled={isDisabled} />
    </S.TimeContainerDiv>
};

export default DateInput;
