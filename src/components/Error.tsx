import React from "react";
import Image from "next/image";
import { ContainerDiv, WrapperCenterDiv, BigTextP } from "@/utils/style.base";
import { catError } from "@/utils/icons";

const Error: React.FC = () => <WrapperCenterDiv>
    <ContainerDiv $direction="row" $height={"400px"} $width={"800px"} $gap={"30px"} >
        <Image src={catError.src} alt={"Cat Error"} width={250} height={200} />
        <BigTextP>Error 404<br />This page  could not be found</BigTextP>
    </ContainerDiv>
</WrapperCenterDiv>

export default Error;