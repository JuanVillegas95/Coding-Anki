import React from 'react';
import * as S from '../utils/style.calendar';
import { MyTime } from "@/classes/MyTime";

const TimeInput: React.FC<{
    handleTime: (e: React.ChangeEvent<HTMLSelectElement>, tag: string) => void;
    text: string;
    time: MyTime;
}> = ({ text, time, handleTime }) => {
    const hours = MyTime.generate24Hours();
    const minutes = MyTime.generate60Minutes();
    const hourTag = `${text}Hour`;
    const minuteTag = `${text}Minute`;

    return (
        <S.TimeContainerDiv>
            <S.TimeP>{text}</S.TimeP>
            <S.TimeSelect value={MyTime.formatTime(time.getHours())} onChange={(e) => handleTime(e, hourTag)}>
                {hours.map((hour, index) => (
                    <option key={index} value={hour}>
                        {hour}
                    </option>
                ))}
            </S.TimeSelect>
            <S.TimeSelect value={MyTime.formatTime(time.getMinutes())} onChange={(e) => handleTime(e, minuteTag)}>
                {minutes.map((minute, index) => (
                    <option key={index} value={minute}>
                        {minute}
                    </option>
                ))}
            </S.TimeSelect>
        </S.TimeContainerDiv>
    );
};

export default TimeInput;
