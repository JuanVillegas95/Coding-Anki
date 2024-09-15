import React, { useState } from 'react';
import * as S from '@/styles/CalendarHub.styles';
import { Toast } from '@/utils/CalendarHub/classes';
import { TOAST_TYPE } from '@/utils/CalendarHub/constants';

const ToastMessage: React.FC<{
    toast: Toast,
    popToast: () => void;
}> = ({ toast, popToast }) => {
    const [isVisible, setIsVisible] = useState<boolean>(true);

    const onAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
        if (e.animationName === "wiggle") {
            setTimeout(() => {
                setIsVisible(!isVisible);
            }, 1000)
        }
        if (e.animationName === "toastAnimOut") {
            setTimeout(() => {
                setIsVisible(!isVisible);
                popToast();
            }, 1000)
        }
    }
    return <S.ToastWrapperDiv>
        <S.ToastContainerDiv
            $isVisible={isVisible}
            onAnimationEndCapture={(e) => onAnimationEnd(e)}
        >
            <S.ToatstIconDiv
                $color={"black"}
                $size={20}
                $svgSize={20}
            >
                {React.createElement(TOAST_TYPE[toast.type])}
            </S.ToatstIconDiv>
            <S.ToastDescriptionP>
                {toast.description}
            </S.ToastDescriptionP>
        </S.ToastContainerDiv>
    </S.ToastWrapperDiv>
};

export default ToastMessage;
