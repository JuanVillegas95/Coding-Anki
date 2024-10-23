import React from 'react';
import * as S from '../utils/style.calendar';
import { MyDate } from '@/classes/MyDate';

const DateInput: React.FC<{
    text: string;
    date: string;
    handleDate: (e: React.ChangeEvent<HTMLInputElement>, label: string) => void;
}> = ({ text, date, handleDate }) => <S.TimeContainerDiv>
    <S.TimeP>{text}</S.TimeP>
    <S.DayInputDate
        value={date === new MyDate(MyDate.NULL).getStringifiedDate() ? "" : date}
        onChange={(e) => handleDate(e, text)}
    />
</S.TimeContainerDiv>

export default DateInput