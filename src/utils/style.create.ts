import * as S from "@/utils/style.base"
import { LoginContainerDiv } from "./style.login";
import styled, { keyframes, css } from 'styled-components';

export const CreateWrapperDiv = styled(S.CenterDiv)`
`;
export const CreateContainerDiv = styled(LoginContainerDiv)`
`;

export const CreateIdWrapperDiv = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0px 0px 15px 30px;
    gap: 10px;
`
export const CreateIdExplanationP = styled(S.TitleP)`
`;

export const CreateIdP = styled(S.TextP)`
    user-select: none;
    &:hover{
        color: #C74634;
     cursor: pointer;
    }
`;

export const CreateUsernameInput = styled.input.attrs({placeholder: "username"})`
    width: 400px;
    height: auto;
    padding: 20px;
    font-size: 20px;
    border: none;
    &:focus {
    outline: none; /* Removes outline on focus */
    }
`;

export const CreateButtonInput = styled(S.ButtonInput).attrs({ value: "Next" })`
    width: 100px;
    height: 70px;
    border-radius: 0px;
`;
export const CreateWelcomeP = styled(S.TitleP)`
    font-size: 125px;
`;

export const CreateWrapperMain = styled.main`
    display: flex;
    flex-direction: row; 
    align-items: center;
`;

export const CreateWrapperHeader = styled.header`
    display: flex;
    flex-direction: column; 
    align-items: center;
`;

export const CreateWrapperFooter = styled.footer`
    display: flex;
    flex-direction: row; 
    align-items: center;
    border: 5px solid black;
    border-radius: 10px;
`;

