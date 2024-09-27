import React from 'react';
import * as S from '@/app/styles/dashboard';
import * as F from '@/utils/functions';
import { Time } from '@/utils/classes';

const TimeInput: React.FC<{
    handleTime: (e: React.ChangeEvent<HTMLSelectElement>, tag: string) => void;
    text: string;
    time: Time;
}> = ({ text, time, handleTime }) => {
    const hours = F.generate24Hours();
    const minutes = F.generate60Minutes();
    const hourTag = `${text}Hour`;
    const minuteTag = `${text}Minute`;

    return (
        <S.TimeContainerDiv>
            <S.TimeP>{text}</S.TimeP>
            <S.TimeSelect value={F.formatTime(time.hours)} onChange={(e) => handleTime(e, hourTag)}>
                {hours.map((hour, index) => (
                    <option key={index} value={hour}>
                        {hour}
                    </option>
                ))}
            </S.TimeSelect>
            <S.TimeSelect value={F.formatTime(time.minutes)} onChange={(e) => handleTime(e, minuteTag)}>
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
