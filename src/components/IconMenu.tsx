import React from 'react';
import * as S from '@/utils/style.calendar';

const IconMenu: React.FC<{
    isIconMenu: boolean;
    toggleIconMenu: () => void;
    currentEventIcon: React.ComponentType;
    handleIcon: (icon: React.ComponentType) => void;
    iconArray: React.ComponentType[];
}> = ({ toggleIconMenu, isIconMenu, handleIcon, currentEventIcon, iconArray }) => {
    return (
        <S.IconMenuButton $color={""} $size={50} $svgSize={25} onClick={toggleIconMenu}>
            {React.createElement(currentEventIcon)}
            {isIconMenu && (
                <S.ContainerMenuDiv $block={isIconMenu ? 'block' : 'none'}>
                    <S.MenuItemDiv>
                        {iconArray.map((icon, index) => (
                            <S.ItemButton key={index} $color={""} $size={49} $svgSize={30} onClick={() => handleIcon(icon)}>
                                {React.createElement(icon)}
                            </S.ItemButton>
                        ))}
                    </S.MenuItemDiv>
                </S.ContainerMenuDiv>
            )}
        </S.IconMenuButton>
    );
};

export default IconMenu;
