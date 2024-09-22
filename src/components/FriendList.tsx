import React, { useRef, useState } from 'react';
import * as S from '@/styles/CalendarHub.styles';
import * as I from '@/utils/icons';
import * as C from '@/utils/constants';

const FriendList: React.FC<{
    label: string;
    icon: React.ComponentType;
    closeFriendList: () => void;
}>
    = ({ closeFriendList, label, icon }) => {
        const [selectedCalendar, setSelectedCalendar] = useState<string>("")

        const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedCalendar(event.target.value);
        };

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
                {C.USER.friends.map((friend, i) => {
                    return (
                        <S.FriendLi key={i}>
                            <S.FriendP>
                                {friend.name}
                            </S.FriendP>
                            <S.FriendCalendarButton
                                $color={"black"}
                                $size={29}
                                $svgSize={17}
                            >
                                {React.createElement(I.calendar)}
                                <S.FriendCalendarSelect
                                    onChange={handleSelectChange}
                                >
                                    {friend.calendars.map((calendar: string, index: number) => {
                                        return <option key={index}>{calendar}</option>
                                    })}
                                </S.FriendCalendarSelect>
                            </S.FriendCalendarButton>

                        </S.FriendLi>
                    )
                })}
            </S.FriendsContainerDiv>
        </S.FriendsWrapperDiv>
    }

export default FriendList;
