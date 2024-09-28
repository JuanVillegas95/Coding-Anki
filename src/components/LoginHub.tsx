import React, { useState } from "react";
import { oracle, cross, acctually } from "@/utils/icons";
import Logo from "@/components/Logo"
import Image from "next/image";
import * as S from "@/utils/style.login";

const LoginHub: React.FC = () => {
    const [isWhyModal, setIsWhyModal] = useState<boolean>(false);
    const openWhyModal = (): void => setIsWhyModal(true);
    const closeWhyModal = (): void => setIsWhyModal(false);

    return <React.Fragment>
        <S.LoginWrapperDiv>
            <S.LoginContainerDiv $height={"400px"} $width={"600px"} $gap={"20px"}>
                <Logo />
                <S.LoginTitleWrapperDiv>
                    <S.LoginTitleP>Login with Oracle</S.LoginTitleP>
                    <Image
                        src={oracle.src}
                        height={50}
                        width={80}
                        alt={"Oracle Logo"}
                        objectFit={"cover"}
                        style={{ marginLeft: "10px" }}
                    />
                </S.LoginTitleWrapperDiv>
                <S.LoginButtonInput />
                <S.LoginWhyP onClick={openWhyModal}>Why are we using Oracle for login?</S.LoginWhyP>
            </S.LoginContainerDiv>
        </S.LoginWrapperDiv>
        {isWhyModal && <S.LoginModalWrapperDiv $zIndex={1} >
            <S.LoginModalContainerDiv $width={"600px"} $height={"auto"}>
                <Image
                    src={acctually.src}
                    height={200}
                    width={200}
                    alt={"Oracle Logo"}
                    objectFit={"cover"}
                    style={{ marginLeft: "10px" }}
                />
                <S.LoginCloseDiv
                    $isBackgroundGrey={true}
                    $size={"40px"}
                    $svgSize={"20px"}
                    $color={"black"}
                    onClick={closeWhyModal}
                >
                    {React.createElement(cross)}
                </S.LoginCloseDiv>
                <S.LoginTitleP>Why Are We Using Oracle for Login?</S.LoginTitleP>
                <S.LoginTextP>
                    At PurrfectTiming, we take your privacy and security seriously. That’s why we’ve chosen Oracle OAuth 2.0 for managing user authentication. By using Oracle, we ensure that:
                </S.LoginTextP>
                <S.LoginListOl>
                    <S.LoginListLi>
                        <strong>We Never Store Your Credentials:</strong> We don’t handle or store sensitive information like passwords or emails directly. Oracle securely manages all aspects of your login process, so you don’t have to worry about us storing or processing your credentials.
                    </S.LoginListLi>
                    <S.LoginListLi>
                        <strong>Enterprise-Level Security:</strong> Oracle's authentication system is built with advanced security protocols, ensuring that your data is protected with the same standards used by top global organizations.
                    </S.LoginListLi>
                    <S.LoginListLi>
                        <strong>Convenience and Trust:</strong> Using Oracle simplifies your login experience by allowing you to use their trusted authentication service, giving you peace of mind that your data is safe and secure.
                    </S.LoginListLi>
                </S.LoginListOl>
                <S.LoginTextP>
                    Rest assured, all sensitive information is handled by Oracle, and we only store the necessary data needed to personalize your experience within the app—nothing more.
                </S.LoginTextP>
            </S.LoginModalContainerDiv>
        </S.LoginModalWrapperDiv>}
    </React.Fragment>

};

export default LoginHub;
