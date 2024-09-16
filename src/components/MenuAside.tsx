import React, { useEffect, useState } from 'react';
import * as S from '@/styles/CalendarHub.styles';
import * as C from '@/utils/CalendarHub/constants';
import FriendList from '@/components/FriendList';

// THIS MIGHT BE A GOOD IDEA
const mountedStyle = {
    animation: "inAnimation 250ms ease-in"
};
const unmountedStyle = {
    animation: "outAnimation 270ms ease-out",
    animationFillMode: "forwards"
};

const MenuAside: React.FC = () => {
    const [isFriends, setIsFriends] = useState<boolean>(false)

    const closeFriendList = () => setIsFriends(false);

    const handleButtonClick = (label: string) => {
        switch (label) {
            case "Friends": { setIsFriends(!isFriends) }; break;
            case "Print": { window.print() }; break;
        }
    }
    return (
        <S.MenuWrapperAside>
            <S.MenuContainerDiv>
                {Object.entries(C.MENU).map(([label, icon], index: number) => {
                    return <React.Fragment>
                        <S.MenuButton
                            key={index}
                            $size={150}
                            $svgSize={20}
                            $color={'black'}
                            onClick={() => handleButtonClick(label)}
                        >
                            <S.MenuP>{label}</S.MenuP>
                            {React.createElement(icon)}
                        </S.MenuButton>
                        {isFriends && label === "Friends" && <S.FriendContainerDiv>
                            <FriendList closeFriendList={closeFriendList} />
                        </S.FriendContainerDiv>
                        }
                    </React.Fragment>
                })}
            </S.MenuContainerDiv>
        </S.MenuWrapperAside>
    );
};

export default MenuAside;
