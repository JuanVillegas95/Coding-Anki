// import React, { useState, useEffect } from "react";
// import { Toast } from "@/utils/classes";
// import { ToastHandler } from "@/utils/types";
// import { TOAST_TYPE, TOAST_ICON } from "@/utils/constants";
// import * as S from "@/utils/style.calendar";

// const useToast = (): ToastHandler & { toasts: Map<string, Toast>, ToastComponent: JSX.Element | null } => {
//     const [toasts, setToasts] = useState<Map<string, Toast>>(new Map());
//     const [isVisible, setIsVisible] = useState<boolean>(false);

//     const push = (newToast: Toast): void => {
//         setToasts((prevToasts) => {
//             if (prevToasts.has(newToast.id)) return prevToasts;
//             const updatedToasts = new Map(prevToasts);
//             updatedToasts.set(newToast.id, newToast);
//             return updatedToasts;
//         });
//         setIsVisible(true); // Show the toast
//     };

//     const pop = (): void => {
//         setToasts((prevToasts) => {
//             if (prevToasts.size === 0) return prevToasts;
//             const updatedToasts = new Map(prevToasts);
//             const lastKey = Array.from(updatedToasts.keys()).pop();
//             if (lastKey) updatedToasts.delete(lastKey);
//             return updatedToasts;
//         });
//         setIsVisible(false); // Hide the toast
//     };

//     const getTail = (): Toast | undefined => {
//         const toastsArray = Array.from(toasts.values());
//         return toastsArray[toastsArray.length - 1];
//     };


//     // ToastMessage Component
//     const ToastMessage: React.FC<{
//         toast: Toast,
//         popToast: () => void;
//     }> = ({ toast, popToast }) => {
//         const [isVisible, setIsVisible] = useState<boolean>(true);

//         const onAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>): void => {
//             if (e.animationName === "toastAnimIn") {
//                 setTimeout(() => {
//                     setIsVisible(!isVisible);
//                 }, 2000);
//             }
//             if (e.animationName === "toastAnimOut") {
//                 setTimeout(() => {
//                     setIsVisible(!isVisible);
//                     popToast();
//                 }, 1000);
//             }
//         };

//         return (
//             <S.ToastWrapperDiv>
//                 <S.ToastContainerDiv
//                     $isVisible={isVisible}
//                     onAnimationEndCapture={onAnimationEnd}
//                 >
//                     <S.ToastIconDiv
//                         $color={"black"}
//                         $size={20}
//                         $svgSize={20}
//                     >
//                         {React.createElement(TOAST_ICON[toast.type])}
//                     </S.ToastIconDiv>
//                     <S.ToastDescriptionP>
//                         {toast.description}
//                     </S.ToastDescriptionP>
//                 </S.ToastContainerDiv>
//             </S.ToastWrapperDiv>
//         );
//     };

//     const toastTail = getTail();

//     const ToastComponent = toasts.size > 0 && toastTail ? (
//         <ToastMessage toast={toastTail} popToast={pop} />
//     ) : null;

//     return { toasts, push, pop, getTail, ToastComponent };
// };

// export default useToast;
