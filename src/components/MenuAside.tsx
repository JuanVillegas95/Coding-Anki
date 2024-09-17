import React, { useEffect, useState } from 'react';
import * as S from '@/styles/CalendarHub.styles';
import * as C from '@/utils/CalendarHub/constants';
import * as I from '@/utils/CalendarHub/icons';
import FriendList from '@/components/FriendList';
import CalendarList from '@/components/CalendarList';


const MenuAside: React.FC = () => {
    const [isFriend, setIsFriend] = useState<boolean>(false)
    const [isChange, setIsChange] = useState<boolean>(false)


    const closeFriendList = () => setIsFriend(false);
    const closeCalendarList = () => setIsChange(false);


    const handleButtonClick = (label: string) => {
        switch (label) {
            case "Friends": { setIsFriend(true) }; break;
            case "Change": { setIsChange(true) }; break;
            case "Print": { window.print() }; break;
        }
    }
    return (
        <S.MenuWrapperAside>
            <S.MenuContainerDiv>
                {Object.entries(C.MENU).map(([label, icon], index: number) => {
                    const isFriendsList: boolean = isFriend && label === "Friends";
                    const isCalendarList: boolean = isChange && label === "Change";

                    // Set onClick only if neither isFriendsList nor isCalendarList is true
                    const handleClick = !isFriendsList && !isCalendarList ? () => handleButtonClick(label) : undefined;

                    return (
                        <S.MenuButton
                            key={index}
                            $size={150}
                            $svgSize={20}
                            $color={'black'}
                            $isFriendsList={isFriendsList}
                            $isCalendarList={isCalendarList}
                            onClick={handleClick} // Assign onClick conditionally
                        >
                            {isCalendarList ? (
                                <CalendarList
                                    label={label}
                                    icon={icon}
                                    closeCalendarList={closeCalendarList}
                                />
                            ) : isFriendsList ? (
                                <FriendList
                                    label={label}
                                    icon={icon}
                                    closeFriendList={closeFriendList}
                                />
                            ) : (
                                <S.MenuWrapperDiv>
                                    <S.MenuP>{label}</S.MenuP>
                                    {React.createElement(icon)}
                                </S.MenuWrapperDiv>
                            )}
                        </S.MenuButton>
                    );
                })}
            </S.MenuContainerDiv>

        </S.MenuWrapperAside>
    );
};

export default MenuAside;
