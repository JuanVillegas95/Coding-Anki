import React, { useState } from "react";
import { welcome } from "@/utils/icons";
import { Toast } from "@/utils/classes";
import { ToastHandler } from "@/utils/types";
import ToastMessage from "@/components/ToastMessage";
import Image from "next/image";
import { TOAST_TYPE, TOAST_ICON } from "@/utils/constants";
import * as S from "@/utils/style.create";
import { useRouter } from "next/navigation";


const CreateHub: React.FC = () => {
    const [isCopied, setIsCopied] = useState(false);
    const [toasts, setToasts] = useState<Map<string, Toast>>(new Map())
    const [username, setUsername] = useState<string>("");
    const [userID, setUserID] = useState<string>("ced266c7-d7e3-4681-a343-0828ae597fc8");
    const router = useRouter();

    const handleUserNameInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const username: string = e.target.value;
        setUsername(username);
    }

    const handleCopy = (): void => {
        navigator.clipboard.writeText(userID).then(() => {
            toastHandeler.push(new Toast("Text Copy", "ID was copied in your clipboard!", TOAST_TYPE.SUCCESS))
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const toastHandeler: ToastHandler = {
        push: (newToast: Toast): void => {
            setToasts((prevToasts) => {
                if (prevToasts.has(newToast.id)) return prevToasts;
                const updatedToasts = new Map(prevToasts);
                updatedToasts.set(newToast.id, newToast);
                return updatedToasts;
            });
        },

        pop: (): void => {
            setToasts((prevToasts) => {
                if (prevToasts.size === 0) return prevToasts;
                const updatedToasts = new Map(prevToasts);
                const lastKey = Array.from(updatedToasts.keys()).pop();
                if (lastKey) updatedToasts.delete(lastKey);
                return updatedToasts;
            });
        },

        getTail: (): Toast => {
            const toastsArray = Array.from(toasts.values());
            return toastsArray[toastsArray.length - 1];
        },
    }

    const handleButtonClick = () => router.replace("/calendar");


    return <React.Fragment>
        <S.CreateWrapperDiv>
            <S.CreateContainerDiv $height={"500px"} $width={"800px"} $gap={"20px"}>
                <S.CreateWelcomeP>Welcome!</S.CreateWelcomeP>
                <S.CreateWrapperMain>
                    <Image
                        src={welcome.src}
                        width={200}
                        height={200}
                        alt={"Welcome Cat"}
                    />
                    <S.CreateWrapperHeader>
                        <S.CreateIdWrapperDiv>
                            <S.CreateIdExplanationP>
                                This is your ID share it with your friends so they can add you!
                            </S.CreateIdExplanationP>
                            <S.CreateIdP onClick={handleCopy}>
                                {userID}
                            </S.CreateIdP>
                        </S.CreateIdWrapperDiv>
                        <S.CreateWrapperFooter>
                            <S.CreateUsernameInput onChange={(e) => handleUserNameInput(e)} />
                        </S.CreateWrapperFooter>
                    </S.CreateWrapperHeader>
                </S.CreateWrapperMain>
            </S.CreateContainerDiv>
        </S.CreateWrapperDiv>
        {(toasts.size > 0) && <ToastMessage
            toast={toastHandeler.getTail()}
            popToast={toastHandeler.pop}
        />}
    </React.Fragment>
};

export default CreateHub;
