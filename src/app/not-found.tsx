"use client"
import React from "react";
import Image from "next/image";
import { ContainerDiv, WrapperCenterDiv, BigTextP } from "../utils/style.base";
import { catError } from "../utils/icons";

export default function NotFound() {
    return <WrapperCenterDiv >
        <ContainerDiv $direction="row" $height="400px" $width="800px" $gap="30px" $padding="80px" $isBorder={true} $isBorderRad={true} $justifyContent="center">
            <ContainerDiv $direction="column" $alignItems="center">
                <Image src={catError.src} alt={"Cat Error"} width={250} height={200} />
                <BigTextP>
                    <strong>Error 404</strong>
                </BigTextP>
            </ContainerDiv>
            <BigTextP style={{ marginTop: "20px" }}>This page  could not be found</BigTextP>
        </ContainerDiv>
    </WrapperCenterDiv>

}