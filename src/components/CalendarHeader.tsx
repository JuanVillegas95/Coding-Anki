import React, { useState } from 'react';
import * as S from '@/styles/CalendarHub.styles';
import * as I from '@/utils/CalendarHub/icons';
import * as C from '@/utils/CalendarHub/constants';
import * as F from '@/utils/CalendarHub/functions';

const CalendarHeader: React.FC<{
    toastHandeler: {
        push: (newToast: Toast) => void;
        pop: () => void;
        getTail: () => Toast;
    }
    mondayDate: Date,
    name: string,
    changeCalendarName: (e: React.ChangeEvent<HTMLInputElement>) => void,
    weekHandler: {
        nextWeek: () => void;
        previousWeek: () => void;
        currentWeek: () => void;
    };
}> = ({ name, changeCalendarName, weekHandler, mondayDate }) => {
    const [isCalendarName, setIsCalendarName] = useState<boolean>(false);
    const toggleCalendarNameMenu = () => setIsCalendarName(!isCalendarName);

    return (
        <S.ContainerHeader>
            <S.CalendarNameDiv>
                <S.DropdownButton
                    $size={30}
                    $svgSize={15}
                    $color={"black"}
                    $isClicked={isCalendarName}
                    onClick={toggleCalendarNameMenu}
                >
                    <I.dropdown />
                </S.DropdownButton>
                <S.CalendarNameInput value={name} onChange={changeCalendarName} />
                {
                    isCalendarName && (
                        <S.CalendarNameUl>
                            {
                                Array.from(C.USER.calendars.values()).map((calendar, index) => (
                                    <S.CalendarNameLi key={index} $isVisible={!isCalendarName} $delay={(index + 1) * 0.30}>
                                        {calendar.name}
                                    </S.CalendarNameLi>
                                ))
                            }
                        </S.CalendarNameUl>
                    )
                }
            </S.CalendarNameDiv>
            <S.ChangeWeekDiv>
                <S.MonthP>{F.getMonth(mondayDate)}</S.MonthP>
                <S.ChangeWeekButton
                    $color={'black'}
                    $size={30}
                    $svgSize={15}
                    onClick={weekHandler.previousWeek}
                >
                    <I.left />
                </S.ChangeWeekButton>
                <S.TodayButton onClick={weekHandler.currentWeek}>Today</S.TodayButton>
                <S.ChangeWeekButton
                    $color={'black'}
                    $size={30}
                    $svgSize={15}
                    onClick={weekHandler.nextWeek}
                >
                    <I.right />
                </S.ChangeWeekButton>
            </S.ChangeWeekDiv>
        </S.ContainerHeader>
    );
};

export default CalendarHeader;
