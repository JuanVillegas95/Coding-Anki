"use client"
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { brownCat, whiteCat, appTitle, acctually, cross } from "@/utils/icons";
import { WrapperCenterDiv, ContainerDiv, ButtonInput, MedTextP, ModalWrapperDiv, ModalContainerDiv, CrossIconDiv, ListLi, ListOl, BigTextP } from "@/utils/style.base"


export default function Home() {
    const [isWhyModal, setIsWhyModal] = useState<boolean>(false);
    const router = useRouter();

    // const handleLogin = async () => {
    //     try {
    //         const response = await fetch("/login/api/?oauth_id=juan_oauth_id", { method: "GET" });
    //         const data: UserData = await response.json();
    //         if (response.ok) {
    //             console.log(data)
    //             console.log(data.user)
    //             console.log(data.user.ID)

    //             console.log(`/calendar/${data.user.ID}`)
    //             router.push(`/calendar/${data.user.ID}`);
    //         }
    //         else {
    //             // Means i have to create the user
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    const openWhyModal = (): void => setIsWhyModal(true);
    const closeWhyModal = (): void => setIsWhyModal(false);
    const handleAuth = (): void => { };

    return <React.Fragment>
        <WrapperCenterDiv>
            <ContainerDiv $direction="column" $height="500px" $width="900px" $gap="20px" $padding="100px" $isBorder={true}>
                <ContainerDiv $direction="row" $gap="20px">
                    <Image src={appTitle.src} alt={"Purrfect Timing"} width={660} height={120.12} />
                </ContainerDiv>
                <ContainerDiv $direction="row" $gap="20px" >
                    <Image src={brownCat.src} alt={"Brown cat"} width={150} height={150} />
                    <ContainerDiv $direction="column" $gap="30px" >
                        <ButtonInput
                            text="Authenticate"
                            $width="325px"
                            $padding="15px"
                            $margin="30px 0 0 0"
                            onClick={handleAuth}
                        />
                        <MedTextP onClick={openWhyModal} $hover={true}>
                            Why are we using Oracle for login?
                        </MedTextP>
                    </ContainerDiv>
                    <Image src={whiteCat.src} alt={"White cat"} width={150} height={150} />
                </ContainerDiv>
            </ContainerDiv>
        </WrapperCenterDiv>
        {isWhyModal && <ModalWrapperDiv $zIndex={1} $gap="20px"  >
            <ModalContainerDiv $width="800px" $height="800px" $padding="30px 40px" $gap="20px" $isBorder={true}>
                <ContainerDiv $direction="row" $wrap="nowrap" $alignItems="center">
                    <BigTextP style={{ textAlign: "center" }}>Why are we using Oracle for Authentication?</BigTextP>
                    <Image src={acctually.src} height={250} width={250} alt={"Actually"} />
                    <CrossIconDiv $isBackgroundGrey={true} $size={"40px"} $svgSize={"20px"} onClick={closeWhyModal}>
                        {React.createElement(cross)}
                    </CrossIconDiv>
                </ContainerDiv>
                <MedTextP>
                    At PurrfectTiming, we take your privacy and security seriously. That’s why we’ve chosen Oracle OAuth 2.0 for managing user authentication. By using Oracle, we ensure that:
                </MedTextP>
                <ListOl $gap="10px">
                    <ListLi>
                        <strong>We Never Store Your Credentials:</strong> We don’t handle or store sensitive information like passwords or emails directly. Oracle securely manages all aspects of your login process, so you don’t have to worry about us storing or processing your credentials.
                    </ListLi>
                    <ListLi>
                        <strong>Enterprise-Level Security:</strong> Oracle's authentication system is built with advanced security protocols, ensuring that your data is protected with the same standards used by top global organizations.
                    </ListLi>
                    <ListLi>
                        <strong>Convenience and Trust:</strong> Using Oracle simplifies your login experience by allowing you to use their trusted authentication service, giving you peace of mind that your data is safe and secure.
                    </ListLi>
                </ListOl>
                <MedTextP>
                    Rest assured, all sensitive information is handled by Oracle, and we only store the necessary data needed to personalize your experience within the app—nothing more.
                </MedTextP>
            </ModalContainerDiv>
        </ModalWrapperDiv>}
    </React.Fragment >
};

