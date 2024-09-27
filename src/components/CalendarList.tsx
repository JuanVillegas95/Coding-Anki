import React, { useRef, useState } from 'react';
import * as S from '@/app/styles/dashboard';
import * as C from '@/utils/constants';
import { Calendar, User } from '@/utils/classes';

const USER: User = new User(
    "a", // Generating a unique user ID
    "Rosie", // Username
    new Map([
        ["work", new Calendar("work", "Work Calendar")],
        ["personal", new Calendar("personal", "Personal Calendar asdkjhbasjhdajshdjhasgd")],
        ["yeah", new Calendar("yeah", "School Calendar")],
    ]), // Initializes a map with two calendars

);

const CalendarList: React.FC<{
    label: string;
    icon: React.ComponentType;
    closeCalendarList: () => void;
    setCalendarName: (name: string) => void;

}>
    = ({ closeCalendarList, label, icon, setCalendarName }) => {
        const [selectedCalendar, setSelectedCalendar] = useState<string>("")

        const handleOnClick = (name: string) => setCalendarName(name)

        return <S.FriendsWrapperDiv>
            <S.FriendHeader onClick={closeCalendarList}>
                <S.MenuP>{label}</S.MenuP>
                {React.createElement(icon)}
            </S.FriendHeader>
            <S.CalendarListContainerDiv>
                {Array.from(USER.calendars.values()).map((calendar: Calendar, index: number) => {
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
