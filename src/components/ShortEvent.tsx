import React from 'react';
import * as S from '../utils/style.calendar';

const ShortEvent: React.FC<{ title: string }> = ({ title }) => {
    return (
        <S.ContainerShortEventDiv>
            <S.ShortEventTitleP>
                {title}
            </S.ShortEventTitleP>
        </S.ContainerShortEventDiv>
    );
};

export default ShortEvent;
