import React, { useState, useEffect } from 'react';
import * as S from '@/utils/style.calendar';
import { Toast } from '@/utils/classes';
import { TOAST_ICON } from '@/utils/constants';

const ToastMessage: React.FC<{
    toast: Toast,
    popToast: () => void;
}> = ({ toast, popToast }) => {
    const [isVisible, setIsVisible] = useState<boolean>(true);

    const onAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>): void => {
        if (e.animationName === "toastAnimIn") {
            setTimeout(() => {
                setIsVisible(!isVisible);
            }, 2000);
        }
        if (e.animationName === "toastAnimOut") {
            setTimeout(() => {
                setIsVisible(!isVisible);
                popToast();
            }, 1000);
        }
    };

    return (
        <S.ToastWrapperDiv>
            <S.ToastContainerDiv
                $isVisible={isVisible}
                onAnimationEndCapture={onAnimationEnd}
            >
                <S.ToastIconDiv
                    $color={"black"}
                    $size={20}
                    $svgSize={20}
                >
                    {React.createElement(TOAST_ICON[toast.type])}
                </S.ToastIconDiv>
                <S.ToastDescriptionP>
                    {toast.description}
                </S.ToastDescriptionP>
            </S.ToastContainerDiv>
        </S.ToastWrapperDiv>
    );
};

export default ToastMessage;
