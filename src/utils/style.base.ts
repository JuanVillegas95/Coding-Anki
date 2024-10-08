import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Fredoka } from "next/font/google";


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
    z-index: ${({ $gap }) => $gap};
    z-index: ${({ $padding }) => $padding};

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

export const ClickableSvgDiv = styled(SvgDiv)<{ $isBackgroundGrey?: boolean }>`
    &:hover{
      cursor: pointer;
      background-color: ${({ $isBackgroundGrey }) => $isBackgroundGrey ? "lightgrey" : "transparent"};
      border-radius: ${({ $isBackgroundGrey }) => $isBackgroundGrey ? "50%" : "0"};
    }
`;

export const ButtonInput = styled.input.attrs<{ 
  text?: string, 
  $width: string, 
  $padding: string, 
  $margin?: string 
}>(({ text, $width, $padding }) => ({
  type: "button",
  value: text,
}))`
  font-family: ${fredoka.style.fontFamily};
  height: auto;
  border-radius: 12px;
  background-color: #312D2A;
  color: white;
  font-size: 20px;
  border: none;
  outline: none;
  width: ${({ $width }) => $width};
  padding: ${({ $padding }) => $padding};
  margin: ${({ $margin }) => $margin }; 

  &:hover {
    cursor: pointer;
  }
`;

export const TextInput = styled.input.attrs<{ 
  $placeholder?: string, 
  $width: string, 
  $padding: string, 
  $margin?: string 
}>(({ $placeholder, $width, $padding }) => ({
  type: "text",
  placeholder: $placeholder,
}))`
  font-family: ${fredoka.style.fontFamily};
  height: auto;
  border-radius: 12px;
  font-size: 20px;
  border: none;
  outline: none;
  width: ${({ $width }) => $width};
  padding: ${({ $padding }) => $padding};
  margin: ${({ $margin }) => $margin }; 
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
}>`
  position: relative;
  display: flex;
  border-radius: 12px;
  background-color: white;

  
  ${({ $isBorder }) => $isBorder ? "border: black solid 3px;" : null }
  flex-wrap: ${({ $wrap }) => $wrap };
  justify-content: ${({ $justifyContent }) => $justifyContent };
  align-items: ${({ $alignItems }) => $alignItems };
  flex-direction: ${({ $direction }) => $direction};
  margin: ${({ $margin }) => $margin};
  padding: ${({ $padding }) => $padding};
  width: ${({ $width }) => $width || "auto"};
  height: ${({ $height }) => $height || "auto"};
  gap: ${({ $gap }) => $gap};
`;

export const CrossIconDiv = styled(ClickableSvgDiv)`
  position: absolute;
  top: -20px;
  right: -20px;
`;

