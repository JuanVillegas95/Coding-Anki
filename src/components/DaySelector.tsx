import React from 'react';
import * as S from '@/styles/CalendarHub.styles';
import * as C from '@/utils/constants';
import * as F from '@/utils/functions';

const DaySelector: React.FC<{
    selectedDays: boolean[];
    startDate: Date;
    handleSelectedDays: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
}> = ({ startDate, handleSelectedDays, selectedDays }) => {
    return (
        <>
            {C.DAYS.map((day, index) => (
                <S.DayLabel key={index}>
                    <S.DaySpan>{day.charAt(0)}</S.DaySpan>
                    <S.EventInputCheckBox
                        checked={selectedDays[index]}
                        onChange={(e) => handleSelectedDays(e, index)}
                        disabled={F.shouldBeLocked(startDate, index)}
                    />
                </S.DayLabel>
            ))}
        </>
    );
};

export default DaySelector;
