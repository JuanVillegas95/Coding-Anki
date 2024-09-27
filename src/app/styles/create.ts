import * as S from "@/app/styles/base"
import { LoginContainerDiv } from "./login";
import styled, { keyframes, css } from 'styled-components';

export const CreateWrapperDiv = styled(S.CenterDiv)``;
export const CreateContainerDiv = styled(LoginContainerDiv)``;
export const CreateIdP = styled(S.TitleP)`
    margin-bottom: 20px;
`;
export const CreateUsernameInput = styled.input.attrs({placeholder: "username"})`
    width: 400px;
    height: auto;
    padding: 20px;
    border-radius: 12px;
    font-size: 20px;

`;
export const CreateButtonInput = styled(S.ButtonInput).attrs({ value: "Next" })`
`;
export const CreateTitleP = styled(S.TitleP)`
    text-align: center;
`;

