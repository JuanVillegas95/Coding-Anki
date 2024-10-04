import React from 'react';
import { HomeButtonInput, HomeContainerDiv, HomeWrapperDiv } from "@/utils/style.home"
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
    const router = useRouter();
    const handleButtonClick = () => router.push("/login");

    return <HomeWrapperDiv>
        <HomeContainerDiv $height={"500px"} $width={"800px"} $gap={"20px"}>
            <HomeButtonInput onClick={handleButtonClick} />
        </HomeContainerDiv>
    </HomeWrapperDiv>

};

export default Home;
