import React, { useState, useEffect } from 'react';
import * as S from '../utils/style.calendar';
import * as I from '../utils/icons';
import { timeZone } from "../utils/icons";
import { ClickableSvgDiv } from "../utils/style.base";
import { Select } from "@/components/Select";
import { timeZones } from "../utils/timeZones"
import { MyDate } from '@/classes/MyDate';
const CalendarHeader: React.FC<{
    monday: MyDate,
    prevWeek: () => void,
    nextWeek: () => void,
    currWeek: () => void,

    // linkIcon: string;
    // toggleLink: () => void;
    // setTimeZoneSelect: (timeZone: string) => void;
}> = ({ monday, nextWeek, prevWeek, currWeek
    // linkIcon, toggleLink, setTimeZoneSelect 
}) => {
        const [isTimeZone, setIsTimeZone] = useState<boolean>(false)
        const toggleTimeZone = (): void => setIsTimeZone((prevValue) => !prevValue);

        return <S.ContainerHeader>
            <S.CalendarNameDiv>
                <S.CalendarNameInput value={undefined} onChange={undefined} />
            </S.CalendarNameDiv>
            <S.HeaderRigthestWrapperDiv>
                <S.MonthP>{monday.getFormattedMonth()}</S.MonthP>
                <S.ChangeWeekDiv>
                    <S.ChangeWeekButton
                        $color={'black'}
                        $size={30}
                        $svgSize={15}
                        onClick={prevWeek}
                    >
                        {React.createElement(I.left)}
                    </S.ChangeWeekButton>
                    <S.TodayButton onClick={currWeek}>Today</S.TodayButton>
                    <S.ChangeWeekButton
                        $color={'black'}
                        $size={30}
                        $svgSize={15}
                        onClick={nextWeek}
                    >
                        {React.createElement(I.right)}
                    </S.ChangeWeekButton>
                </S.ChangeWeekDiv>
            </S.HeaderRigthestWrapperDiv>
            {/* <S.LinkIconImg src={linkIcon} onClick={toggleLink} />
            <Select
                icon={timeZone}
                size="40px"
                svgSize="40px"
                width={200}
                options={timeZones}
                isOpen={isTimeZone}
                toggleSelect={toggleTimeZone}
                setOption={setTimeZoneSelect}
            /> */}
        </S.ContainerHeader>
    };

export default CalendarHeader;
