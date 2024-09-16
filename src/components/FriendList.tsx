import React, { useState, useEffect } from 'react';
import * as S from '@/styles/CalendarHub.styles';
import * as I from '@/utils/CalendarHub/icons';
import * as C from '@/utils/CalendarHub/constants';

const FriendList: React.FC<{
    closeFriendList: () => void;
}>
    = ({ closeFriendList }) => {
        const [linkedCalendar, setLinkedCalendar] = useState<string>("");
        const [linkedUser, setLinkedUser] = useState<string>("");

        const handleSetLinkedUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, name: string) => {
            if (name === linkedUser) setLinkedUser("");
            else setLinkedUser(name);
        };

        const handleSetLinkedCalendar = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, name: string) => {
            if (name === linkedCalendar) setLinkedCalendar("");
            else setLinkedCalendar(name);
        };


        return <>
            <S.FriendHeader>
                <S.FriendCloseButton $size={10} $svgSize={10} $color={'black'} onClick={closeFriendList}>
                    <I.cross />
                </S.FriendCloseButton>
                <S.FriendSearchDiv>
                    <S.FriendSearchIcon $size={20} $svgSize={15} $color={'black'}>
                        <I.search />
                    </S.FriendSearchIcon>
                    <S.FriendSearchInput />
                </S.FriendSearchDiv>
            </S.FriendHeader>
            <S.FriendUl>
                {C.USER.friends.map((friend, index) => (
                    <React.Fragment key={index}>
                        <S.FriendNameLi>
                            <S.FriendNameP>{friend.name}</S.FriendNameP>
                            <S.DropdownButton
                                $size={30}
                                $svgSize={15}
                                $color={"black"}
                                $isClicked={friend.name === linkedUser}
                                onClick={(e) => handleSetLinkedUser(e, friend.name)}
                            >
                                <I.dropdown />
                            </S.DropdownButton>
                        </S.FriendNameLi>
                        {friend.name === linkedUser && friend.calendars.map((name, idx) => (
                            <S.FriendCalendarNameLi key={idx} $isVisible={name === linkedUser} $delay={(idx + 1) * 0.30}>
                                <S.CalendarNameP>{name}</S.CalendarNameP>
                                <S.LinkedButton
                                    $size={25}
                                    $svgSize={15}
                                    $color={"black"}
                                    onClick={(e) => handleSetLinkedCalendar(e, name)}
                                    $isClicked={name === linkedCalendar}
                                >
                                    {name === linkedCalendar ? <I.fullCircle /> : <I.emptyCircle />}
                                </S.LinkedButton>
                            </S.FriendCalendarNameLi>
                        ))}
                    </React.Fragment>
                ))}
            </S.FriendUl>
        </>
    };

export default FriendList;
