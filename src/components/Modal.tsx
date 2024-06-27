import React from 'react';
import styled from 'styled-components';
import CloseX from "@/svg/close-x.svg";
import Image from 'next/image';


const ModalDiv = styled.div<{ $block: string; }>`
    display: ${p => p.$block};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    z-index: 50;
`;

const ContentDiv = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    width: 50%;
    height: auto;
    padding: 2rem;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 0.5rem;
`;

const ImageContainer = styled.div`
  position: absolute;
  top: .5rem;
  right: .5rem;
  display: inline-block;
  &:hover {
    cursor: pointer;
  }
`;

const Modal: React.FC<{
  handleClose: () => void;
  show: boolean;
  children: React.ReactNode;
}> = ({
  handleClose,
  show,
  children
}) => {
    return (
      <ModalDiv $block={show ? "block" : "none"}>
        <ContentDiv>
          <ImageContainer onClick={handleClose}>
            <Image
              src={CloseX.src}
              alt="X"
              width={25}
              height={25}
            />
          </ImageContainer>
          {children}
        </ContentDiv>
      </ModalDiv>
    );
  };

export default Modal;
