import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { brownCat, whiteCat, appTitle, acctually, cross } from "@/utils/icons";
import { WrapperCenterDiv, ContainerDiv, ButtonInput, MedTextP, ModalWrapperDiv, ModalContainerDiv, CrossIconDiv, ListLi, ListOl } from "@/utils/style.base"


const Home: React.FC = () => {
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
            <ContainerDiv $direction="column" $height={"500px"} $width={"900px"} $gap={"20px"}>
                <ContainerDiv
                    $direction="row"
                    $height={"auto"}
                    $width={"900px"}
                    $gap={"20px"}
                >
                    <Image
                        src={appTitle.src}
                        alt={"Purrfect Timing"}
                        width={660}
                        height={120.12}
                    />
                </ContainerDiv>
                <ContainerDiv
                    $direction="row"
                    $height={"auto"}
                    $width={"400px"}
                    $gap="20px"
                >
                    <Image
                        src={brownCat.src}
                        alt={"Brown cat"}
                        width={150}
                        height={150}
                    />

                    <ContainerDiv $direction="column" $height={"auto"} $width={"450px"} $gap={"20px"} >
                        <ButtonInput
                            text="Authenticate"
                            $width="325px"
                            $padding="15px"
                            onClick={handleAuth} />
                        <MedTextP onClick={openWhyModal} >
                            Why are we using Oracle for login?
                        </MedTextP>
                    </ContainerDiv>
                    <Image
                        src={whiteCat.src}
                        alt={"White cat"}
                        width={150}
                        height={150}
                    />
                </ContainerDiv>
            </ContainerDiv>
        </WrapperCenterDiv>
        {isWhyModal && <ModalWrapperDiv $zIndex={1} $gap="20px" $padding="20px" >
            <ModalContainerDiv $width={"600px"} $height={"auto"}>
                <CrossIconDiv
                    $isBackgroundGrey={true}
                    $size={"40px"}
                    $svgSize={"20px"}
                    $color={"black"}
                    onClick={closeWhyModal}
                >
                    {React.createElement(cross)}
                </CrossIconDiv>
                <ContainerDiv $direction="row" $width="auto" $height="auto">
                    <MedTextP>Why Are We Using Oracle for Login?</MedTextP>
                    <Image
                        src={acctually.src}
                        height={200}
                        width={200}
                        alt={"Oracle Logo"}
                        objectFit={"cover"}
                        style={{ marginLeft: "10px" }}
                    />
                </ContainerDiv>
                <MedTextP>
                    At PurrfectTiming, we take your privacy and security seriously. That’s why we’ve chosen Oracle OAuth 2.0 for managing user authentication. By using Oracle, we ensure that:
                </MedTextP>
                <ListOl>
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
    </React.Fragment>
};

export default Home;
