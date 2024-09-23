import React, { useRef, useState } from 'react';
import * as S from '@/styles/CalendarHub.styles';
import * as I from '@/utils/icons';
import * as C from '@/utils/constants';
import { Calendar, Friend, User } from '@/utils/classes';
const USER: User = new User(
    "a", // Generating a unique user ID
    "rosie@example.com", // Email address
    "Rosie", // Username
    "securepassword123", // Password
    new Map([
        ["work", new Calendar("work", "Work Calendar")],
        ["personal", new Calendar("personal", "Personal Calendar asdkjhbasjhdajshdjhasgd")],
        ["yeah", new Calendar("yeah", "School Calendar")],
    ]), // Initializes a map with two calendars
    [
        new Friend("yeah", "Rosie", ["yeah1", "yeah2", "yeah3"], C.FRIEND_STATUS.ACCEPTED), // Initializes friends list with one accepted friend
        new Friend("yeah", "Juan", ["yeah4", "yeah5", "yeah6"], C.FRIEND_STATUS.PENDING), // Another friend with a pending request
    ]
);

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
                {USER.friends.map((friend, i) => {
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
