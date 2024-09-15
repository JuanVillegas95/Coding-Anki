import React from 'react';
import * as S from '@/styles/CalendarHub.styles';
import * as I from '@/utils/CalendarHub/icons';

const LongEvent: React.FC<{
    color: string;
    startHours: string;
    startMinutes: string;
    endHours: string;
    endMinutes: string;
    icon: React.ComponentType;
    title: string;
    description: string;
}> = ({ color, startHours, startMinutes, endHours, endMinutes, icon, title, description }) => {
    return (
        <S.ContainerLongEventDiv>
            <S.LongEventHeader $color={color}>
                <S.LongEventIconDiv $color={'white'} $size={13} $svgSize={13}>
                    {React.createElement(icon)}
                </S.LongEventIconDiv>
                <S.LongEventTimeDiv>
                    <S.LongEventStartDiv>
                        {startHours}:{startMinutes}
                    </S.LongEventStartDiv>
                    <S.LongEventArrowDiv $color={'white'} $size={14} $svgSize={14}>
                        <I.rightArrow />
                    </S.LongEventArrowDiv>
                    <S.LongEventEndDiv>
                        {endHours}:{endMinutes}
                    </S.LongEventEndDiv>
                </S.LongEventTimeDiv>
            </S.LongEventHeader>
            <S.LongEventBodyDiv>
                <S.LongEventTitleP>{title}</S.LongEventTitleP>
                <S.LongEventDescriptionP>{description}</S.LongEventDescriptionP>
                <S.LongEventIconBodyDiv $color={color} $size={40} $svgSize={40}>
                    {React.createElement(icon)}
                </S.LongEventIconBodyDiv>
            </S.LongEventBodyDiv>
        </S.ContainerLongEventDiv>
    );
};

export default LongEvent;
