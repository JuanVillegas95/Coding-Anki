import React from 'react';
import * as S from '@/utils/style.calendar';
import * as F from '@/utils/functions';

const DateInput: React.FC<{
    text: string;
    date: string;
    handleDate: (e: React.ChangeEvent<HTMLInputElement>, label: string) => void;
}> = ({ text, date, handleDate }) => <S.TimeContainerDiv>
    <S.TimeP>{text}</S.TimeP>
    <S.DayInputDate value={date} onChange={(e) => handleDate(e, text)} />
</S.TimeContainerDiv>

export default DateInput;
