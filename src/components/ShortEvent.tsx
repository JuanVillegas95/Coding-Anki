import React from 'react';
import * as S from '@/app/styles/dashboard';

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
