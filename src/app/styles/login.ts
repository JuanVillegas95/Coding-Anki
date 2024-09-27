import * as S from "@/app/styles/base"
import styled, { keyframes, css } from 'styled-components';


export const LoginWrapperDiv = styled(S.CenterDiv)``;

export const LoginModalWrapperDiv = styled(S.ModalWrapperDiv)``;

export const LoginModalContainerDiv = styled(S.ModalContainerDiv)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 40px;
`;

export const LoginTitleP = styled(S.TitleP)`
`;

export const LoginTextP = styled(S.TextP)`
`;

export const LoginListOl = styled(S.ListOl)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-left: 20px;
`;

export const LoginListUl = styled(S.ListUl)`
`;

export const LoginListLi = styled(S.ListLi)`


`;

export const LoginCloseDiv = styled(S.ClickableSvgDiv)`
  position: absolute;
  top: 20px;
  right: 20px;
`;

export const LoginContainerDiv = styled(S.ContainerColDiv)``

export const LoginTitleWrapperDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
`

export const LoginButtonInput = styled(S.ButtonInput).attrs({ value: "Next" })``

export const LoginWhyP = styled(S.TextP)`
  &:hover{
    color: #C74634;
    cursor: pointer;
  }
`

