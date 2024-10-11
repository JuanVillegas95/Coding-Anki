"use client"
import React, { useState } from "react";
import { welcome } from "@/utils/icons";
import Image from "next/image";
import { TOAST_TYPE } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { WrapperCenterDiv, ContainerDiv, MedTextP, SmallTextP, HugeTextP } from "@/utils/style.base"
import useToast from "@/hooks/useToast";
import { SearchBar } from "@/components/SearchBar";
export default function Welcome() {
    const { pushToast, ToastComponent } = useToast();
    const [isCopied, setIsCopied] = useState(false);
    const [username, setUsername] = useState<string>("");
    const [userID, setUserID] = useState<string>("ced266c7-d7e3-4681-a343-0828ae597fc8");
    const router = useRouter();

    const handleUserNameInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const username: string = e.target.value;
        setUsername(username);
    }

    const handleCopy = (): void => {
        navigator.clipboard.writeText(userID).then(() => {
            pushToast("Text Copy", "ID was copied in your clipboard!", TOAST_TYPE.SUCCESS);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const handleButtonClick = () => router.replace("/calendar");

    return <React.Fragment>
        <WrapperCenterDiv>
            <ContainerDiv
                $direction="column"
                $height="500px"
                $width="800px" $gap="20px"
                $padding="60px"
                $isBorder={true}
                $isBorderRad={true}
                $justifyContent="center"
                $alignItems="center"
            >
                <HugeTextP>Welcome!</HugeTextP>
                <ContainerDiv $direction="row" $gap="40px">
                    <Image
                        src={welcome.src}
                        width={200}
                        height={200}
                        alt={"Welcome Cat"}
                    />
                    <ContainerDiv $direction="column" $gap="15px">
                        <MedTextP style={{ paddingRight: "80px" }}>
                            This is your ID share it with your friends so they can add you!
                        </MedTextP>
                        <SmallTextP onClick={handleCopy} $hover={true}>
                            {userID}
                        </SmallTextP>
                        <SearchBar width="400px" buttonWidth="100px" buttonText="Next" padding="20px" fontSize="20px" />
                    </ContainerDiv>
                </ContainerDiv>
            </ContainerDiv>
        </WrapperCenterDiv>
        <ToastComponent />
    </React.Fragment>
};


