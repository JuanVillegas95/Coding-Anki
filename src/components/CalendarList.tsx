import React, { useRef, useState } from 'react';
import * as S from '@/styles/CalendarHub.styles';
import * as C from '@/utils/CalendarHub/constants';
import { Calendar } from '@/utils/CalendarHub/classes';

const CalendarList: React.FC<{
    label: string;
    icon: React.ComponentType;
    closeCalendarList: () => void;
}>
    = ({ closeCalendarList, label, icon }) => {
        const [selectedCalendar, setSelectedCalendar] = useState<string>("")

        const handleOnClick = (name: string) => setSelectedCalendar(name)



        return <S.FriendsWrapperDiv>
            <S.FriendHeader onClick={closeCalendarList}>
                <S.MenuP>{label}</S.MenuP>
                {React.createElement(icon)}
            </S.FriendHeader>
            <S.CalendarListContainerDiv>
                {Array.from(C.USER.calendars.values()).map((calendar: Calendar, index: number) => {
                    return (
                        <S.CalerndarLi key={index} onClick={() => handleOnClick(calendar.name)}>
                            <S.FriendP >
                                {calendar.name}
                            </S.FriendP>
                        </S.CalerndarLi>
                    )
                })}
            </S.CalendarListContainerDiv>
        </S.FriendsWrapperDiv>
    }

export default CalendarList;
