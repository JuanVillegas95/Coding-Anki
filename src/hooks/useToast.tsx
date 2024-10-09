import React, { useState, useEffect } from "react";
import * as S from "@/utils/style.calendar";
import { Toast } from "@/utils/classes";
import { TOAST_ICON } from "@/utils/constants";

const useToast = (): [React.FC<{}>, (newToast: Toast) => void] => {
    const [toasts, setToasts] = useState<Map<string, Toast>>(new Map());
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const pushToast = (newToast: Toast): void => {
        setToasts((prevToasts) => {
            if (prevToasts.has(newToast.id)) return prevToasts;
            const updatedToasts = new Map(prevToasts);
            updatedToasts.set(newToast.id, newToast);
            return updatedToasts;
        });
        setIsVisible(true);
    };

    const popToast = (): void => {
        setToasts((prevToasts) => {
            if (prevToasts.size === 0) return prevToasts;
            const updatedToasts = new Map(prevToasts);
            const lastKey = Array.from(updatedToasts.keys()).pop();
            if (lastKey) updatedToasts.delete(lastKey);
            return updatedToasts;
        });
    };

    const tailToast = (): Toast | undefined => {
        const toastsArray = Array.from(toasts.values());
        return toastsArray[toastsArray.length - 1];
    };

    const ToastComponent: React.FC<{}> = () => {
        const currentToast = tailToast();
        const onAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>): void => {
            if (e.animationName === "toastAnimIn") {
                setTimeout(() => {
                    setIsVisible(false);
                }, 2000);
            }
            if (e.animationName === "toastAnimOut") {
                setTimeout(() => {
                    popToast(); // Call popToast directly after animation
                }, 1000);
            }
        };

        useEffect(() => {
            if (currentToast) {
                setIsVisible(true);
            }
        }, [currentToast]);

        if (!currentToast) return null;

        return (
            <S.ToastWrapperDiv>
                <S.ToastContainerDiv
                    $isVisible={isVisible}
                    onAnimationEnd={onAnimationEnd}
                >
                    <S.ToastIconDiv
                        $color={"black"}
                        $size={20}
                        $svgSize={20}
                    >
                        {React.createElement(TOAST_ICON[currentToast.type])}
                    </S.ToastIconDiv>
                    <S.ToastDescriptionP>
                        {currentToast.description}
                    </S.ToastDescriptionP>
                </S.ToastContainerDiv>
            </S.ToastWrapperDiv>
        );
    };

    return [ToastComponent, pushToast];
};

export default useToast;
