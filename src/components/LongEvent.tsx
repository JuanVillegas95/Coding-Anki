import React from 'react';
import * as S from '@/app/styles/dashboard';
import * as I from '@/utils/icons';
import * as C from "@/utils/constants"

const LongEvent: React.FC<{
    color: string;
    startHours: string;
    startMinutes: string;
    endHours: string;
    endMinutes: string;
    icon: React.ComponentType;
    title: string;
    description: string;
    isLinked: boolean;
}> = ({ color, startHours, startMinutes, endHours, endMinutes, icon, title, description, isLinked }) => {
    return (
        <S.ContainerLongEventDiv>
            <S.LongEventHeader
                $color={C.COLORS[color].primary}
                $isLinked={isLinked}
            >
                {!isLinked && <S.LongEventIconDiv $color={'white'} $size={13} $svgSize={13}>
                    {React.createElement(icon)}
                </S.LongEventIconDiv>}
                <S.LongEventTimeDiv $isLinked={isLinked}>
                    <S.LongEventStartDiv $isLinked={isLinked}>
                        {startHours}:{startMinutes}
                    </S.LongEventStartDiv>
                    {!isLinked && <S.LongEventArrowDiv $color={'white'} $size={14} $svgSize={14}>
                        <I.rightArrow />
                    </S.LongEventArrowDiv>}
                    {isLinked && <span>-</span>}
                    <S.LongEventStartDiv $isLinked={isLinked}>
                        {endHours}:{endMinutes}
                    </S.LongEventStartDiv>
                </S.LongEventTimeDiv>
            </S.LongEventHeader>
            <S.LongEventBodyDiv>
                <S.LongEventTitleP>{title}</S.LongEventTitleP>
                <S.LongEventDescriptionP>{description}</S.LongEventDescriptionP>
                <S.LongEventIconBodyDiv $color={C.COLORS[color].tertiary} $size={40} $svgSize={40}>
                    {React.createElement(icon)}
                </S.LongEventIconBodyDiv>
            </S.LongEventBodyDiv>
        </S.ContainerLongEventDiv>
    );
};

export default LongEvent;
