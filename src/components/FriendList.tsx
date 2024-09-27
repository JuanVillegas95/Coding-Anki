import React, { useRef, useState } from 'react';
import * as S from '@/utils/style.calendar';
import * as I from '@/utils/icons';
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

const FriendList: React.FC<{
    label: string;
    icon: React.ComponentType;
    closeFriendList: () => void;
    setLinkedCalendar: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ closeFriendList, label, icon, setLinkedCalendar }) => {
    return <S.FriendsWrapperDiv>
        <S.FriendHeader onClick={closeFriendList}>
            <S.MenuP>{label}</S.MenuP>
            {React.createElement(icon)}
        </S.FriendHeader>
        <S.FindFriendSection>
            <S.FriendSearchDiv>
                <S.FriendSearchIcon $size={20} $svgSize={15} $color={'black'}>
                    {React.createElement(I.search)}
                </S.FriendSearchIcon>
                <S.FriendSearchInput />
            </S.FriendSearchDiv>
        </S.FindFriendSection>
        <S.FriendsContainerDiv>
            {/* {USER.friendIds.map((friend, i) => {
                return (
                    <S.FriendLi key={i}>
                        <S.FriendP>
                            {friend.id}
                        </S.FriendP>
                        <S.FriendCalendarButton
                            $color={"black"}
                            $size={29}
                            $svgSize={17}
                        >
                            {React.createElement(I.calendar)}
                            <S.FriendCalendarSelect
                                onChange={(e) => setLinkedCalendar(e)}
                            >
                                {friend.calendars.map((calendar: string, index: number) => {
                                    return <option key={index}>{calendar}</option>
                                })}
                            </S.FriendCalendarSelect>
                        </S.FriendCalendarButton>

                    </S.FriendLi>
                )
            })} */}
        </S.FriendsContainerDiv>
    </S.FriendsWrapperDiv>
}

export default FriendList;
