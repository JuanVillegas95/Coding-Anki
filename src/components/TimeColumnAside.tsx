import React from 'react';
import * as S from '../utils/style.calendar';
import { MyTime } from '@/classes/MyTime';

const TimeColumnAside: React.FC<{
    asideRef: React.RefObject<HTMLDivElement>
}> =
    ({
        asideRef
    }) => <S.ContainerAside ref={asideRef}>
            {MyTime.generate24HourIntervals().map((hour, i) => (
                <S.HourDiv key={i} $marginBottom={i === 0 ? 2 : 0} $isEven={i % 2 !== 0}>
                    {hour}
                </S.HourDiv>
            ))}
        </S.ContainerAside>

export default TimeColumnAside;
