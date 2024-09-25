import React from 'react';
import * as S from '@/utils/styles';
import * as F from '@/utils/functions';

const TimeColumnAside: React.FC<{ asideRef: React.RefObject<HTMLDivElement> }> = ({ asideRef }) => {
    return (
        <S.ContainerAside ref={asideRef}>
            {F.generate24HourIntervals().map((hour, i) => (
                <S.HourDiv key={i} $marginBottom={i === 0 ? 2 : 0} $isEven={i % 2 !== 0}>
                    {hour}
                </S.HourDiv>
            ))}
        </S.ContainerAside>
    );
};

export default TimeColumnAside;
