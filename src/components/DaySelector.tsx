import React from 'react';
import * as S from '@/utils/style.calendar';
import * as C from '@/utils/constants';
import * as F from '@/utils/functions';

const DaySelector: React.FC<{
    selectedDays: boolean[];
    startDate: string;
    handleSelectedDays: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
    groupId: string | null;
}> = ({ startDate, handleSelectedDays, selectedDays, groupId }) => {
    return <React.Fragment>
        {C.DAYS.map((day, index) => (
            <S.DayLabel key={index}>
                <S.DaySpan>{day.charAt(0)}</S.DaySpan>
                <S.EventInputCheckBox
                    checked={selectedDays[index]}
                    onChange={(e) => handleSelectedDays(e, index)}
                    disabled={groupId ? undefined : F.shouldBeLocked(startDate, index)}
                />
            </S.DayLabel>
        ))}
    </React.Fragment>
};

export default DaySelector;
