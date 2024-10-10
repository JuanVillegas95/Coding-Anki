import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Fredoka } from "next/font/google";
import { USER_SELECT_NONE, HIDE_SCROLL_BAR } from "@/utils/constants"

const fredoka = Fredoka({
    weight: ["300", "400", "500", "600", "700"],
    style: ["normal",],
    subsets: ["latin"],
    display: "swap",
  });
export const HugeTextP = styled.p`
  font-family: ${fredoka.style.fontFamily};
  font-size: 100px;
`;


export const BigTextP = styled.p`
  font-family: ${fredoka.style.fontFamily};
  font-size: 50px;
`;

export const MedTextP = styled.p<{ $hover?: boolean}>`
  font-family: ${fredoka.style.fontFamily};
  font-size: 25px;
  ${USER_SELECT_NONE}
  ${({ $hover }) => $hover ? `
    &:hover{
      cursor: pointer;
      color: #C74634;
    }
  ` : null
  }
`;

export const SmallTextP = styled.p<{ $hover?: boolean}>`
  font-family: ${fredoka.style.fontFamily};
  font-size: 20px;
  ${USER_SELECT_NONE}
  ${({ $hover }) => $hover ? `
    &:hover{
      cursor: pointer;
      color: #C74634;
      
    }
  ` : null
  }
`;

export const TinyTextP = styled.p`
  font-family: ${fredoka.style.fontFamily};
  font-size: 14px;
  overflow: hidden;        
  text-overflow: ellipsis;   
`;

export const ListOl = styled.ol<{ $gap?: string }>`
  font-family: ${fredoka.style.fontFamily};
  font-size: 20px;
  display: flex;
  flex-direction: column;

  margin-left: 20px;
  gap: ${({ $gap }) => $gap};
`;

export const ListUl = styled.ul`
  font-family: ${fredoka.style.fontFamily};
`;

export const ListLi = styled.li`
  font-family: ${fredoka.style.fontFamily};
`;


export const WrapperCenterDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const ModalWrapperDiv = styled.div<{ $zIndex: number, $gap?: string, $padding?: string }>`
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    z-index: ${({ $zIndex }) => $zIndex};
    gap: ${({ $gap }) => $gap};
    padding: ${({ $padding }) => $padding};

`;


export const ModalContainerDiv = styled.div<{ 
  $width?: string, 
  $height?: string, 
  $padding?: string,
  $gap?: string,
  $isBorder?: boolean,
}>`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;

    ${({ $isBorder }) => $isBorder ? "border: black solid 3px;" : null }
    gap: ${({ $gap }) => $gap || "auto"};
    width: ${({ $width }) => $width || "auto"};
    height: ${({ $height }) => $height || "auto"};
    padding: ${({ $padding }) => $padding || '0'};
`;



export const SvgDiv = styled.div<{$color?: string, $size: string, $svgSize: string}>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border-style: none;

  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  svg {
    width: ${({ $svgSize }) => $svgSize};
    height: ${({ $svgSize }) => $svgSize};
    path {
      fill: ${({ $color }) => $color};
    }
  }
`;

export const ClickableSvgDiv = styled(SvgDiv)<{ 
  $isBackgroundGrey?: boolean,
  $isSelect?: boolean;
  }>`
  position: ${({ $isSelect }) => $isSelect ? "relative" : "static"};
  &:hover{
    cursor: pointer;
    background-color: ${({ $isBackgroundGrey }) => $isBackgroundGrey ? "#F8F8F8" : "transparent"};
    border-radius: ${({ $isBackgroundGrey }) => $isBackgroundGrey ? "50%" : "0"};
  }
`;

export const ButtonInput = styled.input.attrs<{ 
  $text?: string, 
  $width: string, 
  $padding: string, 
  $margin?: string,
  $fontSize?: string,
}>(({ $text, $width, $padding, $fontSize}) => ({
  type: "button",
  value: $text,
}))`
  font-family: ${fredoka.style.fontFamily};
  height: auto;
  border-radius: 12px;
  background-color: #312D2A;
  color: white;
  border: none;
  outline: none;

  font-size: ${({ $fontSize }) => $fontSize || "20px"};
  width: ${({ $width }) => $width};
  padding: ${({ $padding }) => $padding};
  margin: ${({ $margin }) => $margin }; 

  &:hover {
    cursor: pointer;
  }
`;

export const TextInput = styled.input.attrs<{
  $placeholder?: string;
  $padding: string;
  $margin?: string;
  $fontSize?: string,
}>(({ $placeholder }) => ({
  type: "text",
  placeholder: $placeholder,
}))`
  font-family: ${fredoka.style.fontFamily};
  height: auto;
  border-radius: 12px;
  font-size: ${({ $fontSize }) => $fontSize || "20px"};
  border: none;
  outline: none;
  width: 100%;
  padding: ${({ $padding }) => $padding};
  margin: ${({ $margin }) => $margin};
  flex-grow: 1;
`;


export const ContainerDiv = styled.div<{ 
  $direction: string, 
  $width?: string, 
  $height?: string, 
  $gap?: string, 
  $padding?: string, 
  $margin?: string, 
  $wrap?: string, 
  $justifyContent?: string, 
  $alignItems?: string,
  $isBorder?: boolean 
  $isBorderRad?: boolean 
  $position?: string
}>`
  display: flex;
  background-color: white;

  position: ${({ $position }) => $position || "relative"};
  flex-wrap: ${({ $wrap }) => $wrap };
  justify-content: ${({ $justifyContent }) => $justifyContent };
  align-items: ${({ $alignItems }) => $alignItems };
  flex-direction: ${({ $direction }) => $direction};
  margin: ${({ $margin }) => $margin};
  padding: ${({ $padding }) => $padding};
  width: ${({ $width }) => $width || "auto"};
  height: ${({ $height }) => $height || "auto"};
  gap: ${({ $gap }) => $gap};
  ${({ $isBorderRad }) => $isBorderRad ? "border-radius: 12px" : null };
  ${({ $isBorder }) => $isBorder ? "border: black solid 3px" : null };
  ${HIDE_SCROLL_BAR}
  ${USER_SELECT_NONE}
`;

export const CrossIconDiv = styled(ClickableSvgDiv)`
  position: absolute;
  top: -20px;
  right: -20px;
  ${USER_SELECT_NONE}
`;

export const SelectOption = styled.span`
  padding: 5px;
  &:hover{
    background-color: #F8F8F8;
  }
`