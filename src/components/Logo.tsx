import React from "react";
import { logo } from "@/utils/icons";
import { LogoTextT, LogoWrapperDiv } from "@/utils/style.base";
import Image from "next/image";

const Logo: React.FC = () => (
    <LogoWrapperDiv>
        <Image
            src={logo.src}
            alt="Purrfect Timing Logo"
            width={200}
            height={200}
            style={{
                border: "5px solid black",
                borderRadius: "50%"
            }}
        />
    </LogoWrapperDiv>
);

export default Logo;
