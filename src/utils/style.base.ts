import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Fredoka, Varela_Round } from "next/font/google";


const fredoka = Fredoka({
    weight: ["300", "400", "500", "600", "700"],
    style: ["normal",],
    subsets: ["latin"],
    display: "swap",
  });

const varela = Varela_Round({
    weight: ["400"],
    style: ["normal",],
    subsets: ["latin"],
    display: "swap",
});

export const LogoWrapperDiv = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent 90deg, white 90deg);
  position: relative;
`
export const LogoTextT = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: ${fredoka.style.fontFamily};
  font-weight: 700;
  color: black;
  font-size: 30px;
`

export const TitleP = styled.p`
  font-family: ${fredoka.style.fontFamily};
  font-size: 24px;
`;

export const TextP = styled.p`
  font-family: ${fredoka.style.fontFamily};
  font-size: 20px;
`;

export const ListOl = styled.ol`
  font-family: ${fredoka.style.fontFamily};
  font-size: 20px;
`;

export const ListUl = styled.ul`
  font-family: ${fredoka.style.fontFamily};
`;

export const ListLi = styled.li`
  font-family: ${fredoka.style.fontFamily};
`;


export const CenterDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

export const ModalWrapperDiv = styled.div<{ $zIndex: number }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    z-index: ${({ $zIndex }) => $zIndex};
`;

export const ModalContainerDiv = styled.div<{ $width: string, $height: string}>`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 1rem;

    width: ${({ $width }) => $width};
    height: ${({ $height }) => $height};
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

export const ButtonInput = styled.input.attrs({ type: "button" })`
  width: 400px;
  height: auto;
  border-radius: 12px;
  background-color: #312D2A;
  color: white;
  padding: 10px;
  font-size: 20px;
  border: none;
  outline: none;
  &:hover{
    cursor: pointer;
  }
`


export const ContainerColDiv = styled.div<{ $width: string, $height: string, $gap?: string}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background-color: white;
  padding: 30px;

  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  gap: ${({ $gap }) => $gap};
`