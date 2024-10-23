import React from 'react';
import * as S from '../utils/style.calendar';
import { MyDate } from '@/classes/MyDate';

const DaySelector: React.FC<{
    selectedDays: boolean[];
    startDate: string;
    handleSelectedDays: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
}> = ({ startDate, handleSelectedDays, selectedDays, }) => {
    return <React.Fragment>
        {MyDate.DAYS.map((day: string, i: number) => (
            <S.DayLabel key={i}>
                <S.DaySpan>{day.charAt(0)}</S.DaySpan>
                <S.EventInputCheckBox
                    checked={selectedDays[i]}
                    onChange={(e) => handleSelectedDays(e, i)}
                // disabled={groupId ? undefined : F.shouldBeLocked(startDate, index)}
                />
            </S.DayLabel>
        ))}
    </React.Fragment>
};

export default DaySelector;
