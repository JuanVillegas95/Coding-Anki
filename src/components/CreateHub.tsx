import React, { useState } from "react";
import Image from "next/image";
import * as S from "@/app/styles/create";

const CreateHub: React.FC = () => {
    const [username, setUsername] = useState<string>("");

    const handleUserNameInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const username: string = e.target.value;
        setUsername(username);
    }


    return <React.Fragment>
        <S.CreateWrapperDiv>
            <S.CreateContainerDiv $height={"400px"} $width={"600px"} $gap={"20px"}>
                <S.CreateTitleP>This is your ID share it with your friends so they can add you!</S.CreateTitleP>
                <S.CreateIdP>ced266c7-d7e3-4681-a343-0828ae597fc8</S.CreateIdP>
                <S.CreateUsernameInput onChange={(e) => handleUserNameInput(e)} />
                <S.CreateButtonInput />
            </S.CreateContainerDiv>
        </S.CreateWrapperDiv>
    </React.Fragment>
};

export default CreateHub;
