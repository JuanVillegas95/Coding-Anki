import React from 'react';
import * as S from '../utils/style.calendar';
import * as I from '../utils/icons';
import { ICONS, ICON, COLOR, COLORS } from '@/classes/Event';
const LongEvent: React.FC<{
    color: COLOR;
    startHours: string;
    startMinutes: string;
    endHours: string;
    endMinutes: string;
    icon: ICON;
    title: string;
    description: string;
    isLinked: boolean;
}> = ({ color, startHours, startMinutes, endHours, endMinutes, title, description, isLinked, icon }) => {
    return (
        <S.ContainerLongEventDiv>
            <S.LongEventHeader
                $color={COLORS[color].primary}
                $isLinked={isLinked}
            >
                {!isLinked && <S.LongEventIconDiv $color={'white'} $size={13} $svgSize={13}>
                    {React.createElement(ICONS[icon])}
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
                <S.LongEventIconBodyDiv $color={COLORS[color].tertiary} $size={40} $svgSize={40}>
                    {React.createElement(ICONS[icon])}
                </S.LongEventIconBodyDiv>
            </S.LongEventBodyDiv>
        </S.ContainerLongEventDiv>
    );
};

export default LongEvent;
