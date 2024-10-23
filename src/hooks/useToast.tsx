// useToast.ts
import { useState, useCallback, useMemo } from "react";
import * as S from "../utils/style.calendar";

import React from "react";
import { success, info, error } from "@/utils/icons"

enum TOAST_TYPE {
    SUCCESS = "SUCCESS",
    INFO = "INFO",
    ERROR = "ERROR",
}

class Toast {
    id: string;
    description: string;
    type: TOAST_TYPE;
    constructor(id: string, description: string, type: TOAST_TYPE) {
        this.id = id;
        this.description = description;
        this.type = type;
    }

    public static readonly TOAST_TYPE = TOAST_TYPE;

    public static readonly TOAST_ICON: Record<TOAST_TYPE, React.ComponentType> = {
        [TOAST_TYPE.SUCCESS]: success,
        [TOAST_TYPE.INFO]: info,
        [TOAST_TYPE.ERROR]: error,
    };
}

const useToast = () => {
    const [toasts, setToasts] = useState<Map<string, Toast>>(new Map());

    const pushToast = useCallback((id: string, description: string, type: TOAST_TYPE): void => {
        const newToast = new Toast(id, description, type);
        setToasts((prevToasts) => {
            if (prevToasts.has(newToast.id)) return prevToasts;
            const updatedToasts = new Map(prevToasts);
            updatedToasts.set(newToast.id, newToast);
            return updatedToasts;
        });
    }, []);

    const popToast = useCallback((): void => {
        setToasts((prevToasts) => {
            if (prevToasts.size === 0) return prevToasts;
            const updatedToasts = new Map(prevToasts);
            const lastKey = Array.from(updatedToasts.keys()).pop();
            if (lastKey) updatedToasts.delete(lastKey);
            return updatedToasts;
        });
    }, []);

    const tailToast = useCallback((): Toast | undefined => {
        const toastsArray = Array.from(toasts.values());
        return toastsArray[toastsArray.length - 1];
    }, [toasts]);

    // Toast component encapsulated within the hook
    const ToastComponent = useMemo(() => {
        const ToastMessage: React.FC = () => {
            const [isVisible, setIsVisible] = useState<boolean>(true);
            const latestToast = tailToast();

            const onAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>): void => {
                if (e.animationName === "toastAnimIn") {
                    setTimeout(() => {
                        setIsVisible(false);
                    }, 2000);
                }
                if (e.animationName === "toastAnimOut") {
                    setTimeout(() => {
                        setIsVisible(false);
                        popToast();
                    }, 1000);
                }
            };

            if (!latestToast) return null;

            return <S.ToastWrapperDiv>
                <S.ToastContainerDiv
                    $isVisible={isVisible}
                    onAnimationEndCapture={onAnimationEnd}
                >
                    <S.ToastIconDiv
                        $color={"black"}
                        $size={20}
                        $svgSize={20}
                    >
                        {React.createElement(Toast.TOAST_ICON[latestToast.type])}
                    </S.ToastIconDiv>
                    <S.ToastDescriptionP>
                        {latestToast.description}
                    </S.ToastDescriptionP>
                </S.ToastContainerDiv>
            </S.ToastWrapperDiv>
        };

        return ToastMessage;
    }, [toasts, popToast, tailToast]);

    return {
        pushToast,
        ToastComponent,
        TOAST_TYPE,
    };
};

export default useToast;
