import React, { useState } from 'react';
import { ClickableSvgDiv, ContainerDiv, TinyTextP, SelectOption } from "@/utils/style.base";
import { SearchBar } from "@/components/SearchBar";
import { TOAST_TYPE } from "@/utils/constants";
import useToast from "@/hooks/useToast";

export const Select: React.FC<{
    icon: string;
    size: string;
    svgSize: string;
    options: string[];
    width: number;
    toggleSelect: () => void;
    setOption: (option: string) => void;
    isOpen: boolean
}> = ({ icon, size, svgSize, options, toggleSelect, width, isOpen, setOption }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredOptions, setFilteredOptions] = useState<string[]>(options)
    const { pushToast, ToastComponent } = useToast();


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = (): void => {
        setFilteredOptions(
            options.filter(option =>
                option.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    };

    const onClick = (option: string): void => {
        setOption(option);
        toggleSelect();
        setFilteredOptions(options)
        pushToast("select Time", "The time has been successfully selected", TOAST_TYPE.SUCCESS)

    }

    return <ClickableSvgDiv
        $isSelect={true}
        $svgSize={svgSize}
        $size={size}
        onClick={toggleSelect}
    >
        {React.createElement(icon)}
        {isOpen && <ContainerDiv
            $position="absolute"
            $width={`${width}px`}
            $height="400px"
            $direction="column"
            $isBorder={true}
            $isBorderRad={true}
            $alignItems="center"
            $padding="10px"
            $gap="10px"
            style={{ top: "50px", zIndex: 5 }}
            onClick={(e) => e.stopPropagation()}
        >
            <SearchBar
                onClick={handleSearch}
                onChange={handleSearchChange}
                buttonWidth="50px"
                buttonText="Filter"
                fontSize="16px"
                padding="5px"
                width="180px"
            />
            <ContainerDiv
                $direction="column"
                $padding="20px"
                $width={`${width - 5}px`}
                style={{ textOverflow: "ellipsis", overflowY: "scroll" }}
                $gap="5px"
            >
                {filteredOptions.map((option: string, index: number) => (
                    <SelectOption key={index} onClick={() => onClick(option)}>
                        <TinyTextP>
                            {option}
                        </TinyTextP>
                    </SelectOption>
                ))}
            </ContainerDiv>
        </ContainerDiv>}
        <ToastComponent />
    </ClickableSvgDiv>
}