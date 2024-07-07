import styled from "styled-components";

const Event = styled.div<{ $fromTop: number, $height: number, $color: string }>`
  position: absolute;
  z-index: 40;
  width: calc(100% - 5px);

  top: ${({ $fromTop }) => $fromTop}px;
  background: green;
  margin: 0;
  height: ${({ $height }) => $height}px;
  border: 1px solid var(--primary-${({ $color }) => $color});
  background-color: var(--secondary-${({ $color }) => $color});
  border-width: 2px;
  border-radius: 0.5rem;
  padding: 5px; 
  margin-left: auto;
  margin-right: auto;
  white-space: normal;
  overflow: hidden;
  margin-left: 3.5px;



  &:hover {
    cursor: pointer;
  }

  strong {
    display: block;
  }
`;

export {
  Event
};