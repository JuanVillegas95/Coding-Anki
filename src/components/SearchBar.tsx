import React from "react";
import { ContainerDiv, TextInput, ButtonInput } from "@/utils/style.base";

export const SearchBar: React.FC<{
    onClick?: () => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    padding: string;
    width: string;
    buttonWidth: string;
    buttonText: string;
    fontSize: string;
}> = ({ padding, width, buttonWidth, buttonText, fontSize, onChange, onClick }) => <ContainerDiv
    $direction="row"
    $width={width}
    $isBorder={true}
    $isBorderRad={true}
    $justifyContent="space-between">
    <TextInput $padding={padding} $fontSize={fontSize} onChange={onChange ? (e) => onChange(e) : undefined} />
    <ButtonInput
        $padding={padding}
        $width={buttonWidth}
        $text={buttonText}
        $fontSize={fontSize}
        style={{ borderRadius: "0" }}
        onClick={onClick ? onClick : undefined}
    />
</ContainerDiv>



