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
    const [buttonStates, setButtonStates] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (buttonStates["Print"]) {
            window.print();
        }

    }, [buttonStates])
    const handleButtonClick = (name: string): void => {
        setButtonStates((prevStates) => ({
            ...prevStates,
            [name]: !prevStates[name],
        }));
    };


    return (
        <S.MenuWrapperAside>
            {buttonStates["Friends"] ? <S.FriendContainerDiv>
                <FriendList toggleIsClicked={handleButtonClick} />
            </S.FriendContainerDiv>
                : <S.MenuContainerDiv>
                    {Array.from(C.MENU_MAP.keys()).map(
                        (icon: React.ComponentType, index: number) => {
                            const name: string = C.MENU_MAP.get(icon)!;
                            return (
                                <S.MenuButton
                                    key={index}
                                    $size={150}
                                    $svgSize={25}
                                    $color={'black'}
                                    onClick={() => handleButtonClick(name)}
                                >
                                    <S.MenuP>{name}</S.MenuP>
                                    {React.createElement(icon)}
                                </S.MenuButton>
                            );
                        }
                    )}
                </S.MenuContainerDiv>
            }
        </S.MenuWrapperAside>
    );
};

export default MenuAside;
