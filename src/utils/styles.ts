import * as C from "@/utils/constants"
import styled, { keyframes, css } from 'styled-components';

const IconButton = styled.button.attrs({type: "button"})<{$color: string, $size: number, $svgSize: number}>`
  background-color: transparent;
  border-style: none;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: ${({ $svgSize }) => $svgSize}px;
    height: ${({ $svgSize }) => $svgSize}px;
    path {
      fill: ${({ $color }) => $color};
    }
  }
`;

const IconDiv = styled.div<{$color?: string, $size?: number, $svgSize?: number}>`
  background-color: transparent;
  border-style: none;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: ${({ $svgSize }) => $svgSize}px;
    height: ${({ $svgSize }) => $svgSize}px;
    path {
      fill: ${({ $color }) => $color};
    }
  }
`;


const IconMenuButton = styled(IconButton)`
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 10px;
  &:hover{
    background-color: lightgray;
    cursor: pointer;
  }
`
const CalendarWrapperDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  overflow: hidden;
  gap: 5px;
`;


const CalendarContainerDiv = styled.div`
  width: ${C.CALENDAR_WIDTH}px;
  height: ${C.CALENDAR_HEIGHT}px;
  min-width: ${C.CALENDAR_WIDTH - 200}px;
  margin-left: 30px;
  padding-bottom: 5px;
  border-radius: 1.5%;
  background-color: white;
  display: grid;
  grid-template-rows: ${C.HEADER_HEIGHT}px ${C.DAYS_OF_THE_WEEK_HEIGHT}px 1fr; 
  grid-template-columns: ${C.HOUR_WIDTH}px 1fr;
  grid-template-areas: "header header" "aside subheader" "aside main";

  ${C.HIDE_SCROLL_BAR} 

    @media print {
      position: absolute;
      left: -10px;
      top: 0;
      width: 100%;
      visibility: visible;
      transform: scale(0.9,1.1); 
      transform-origin: top left;
      width: 100%; 
    }
`;


const ContainerHeader = styled.header`
  grid-area: header;
  display: flex;
  flex: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  padding: 20px;
  box-shadow: 0 .2px 0 0 slategray;
`;

const CalendarNameInput = styled.input`
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 800; 
  letter-spacing: 1px;
  margin-left: 5px;
  text-align: left; 
  border: none;
  outline: none;
  border-bottom: 2px dashed lightgray;
  border-image: repeating-linear-gradient(to right, lightgray 0, lightgray 10px, transparent 10px, transparent 20px) 1;
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChangeWeekDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;   
`;

const ClickableDiv = styled(IconDiv)`
  user-select: none;
  outline: none;
  &:hover{
    cursor: pointer;
  }
`;



const ChangeWeekButton = styled(ClickableDiv)`
  border-radius: 15px;
  &:hover{
    background-color: 	#F8F8F8;
  }
`


const FriendCalendarButton = styled(ClickableDiv)`
  border-radius: 15px;
  position: relative; 
  &:hover{
    background-color: 	#F8F8F8;
  }
`

const MonthP = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 500; 
  text-align: center; 
  font-size: 18px;
  margin-bottom: 7px;
`;


const ContainerAside = styled.aside`
  grid-area: aside;
  text-align: center; 
  align-items: center; 
  justify-items: center; 
  margin-top: ${C.DAYS_OF_THE_WEEK_HEIGHT - 7}px;
  overflow-y: scroll;
  ${C.HIDE_SCROLL_BAR} 
`;

const ContainerSection = styled.section`
  grid-area: subheader;
  height: ${C.SUBHEADER_HEIGHT}px;
  align-items: center; 
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-right: 15px;
`;

const SectionDayDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContianerNumberDiv = styled.div<{ $isToday: boolean }>`
  background-color: ${({ $isToday }) => ($isToday ? "red" : "white")};
  border-radius: 50%;
  width: 30px;
  height: 30px;
`;

const DayNameP = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 600; 

  font-size: 12px;
`

const DayNumberP = styled.p<{ $isToday: boolean }>`
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 400; 
  margin-top: 7px;
  margin-left: 5px;
  color: ${({ $isToday }) => ($isToday ? "white" : "black")};
`

const ContainerMain = styled.main`
  grid-area: main;
  margin-right: 15px;
  position: relative;
  overflow-y: scroll;
  ${C.HIDE_SCROLL_BAR}
    display: grid;
  grid-template-columns: repeat(7, 1fr);
  position: relative;
  border-top: 2px solid #D3D3D3;  
  border-left: 1px solid #D3D3D3;  
  border-right: 1px solid #D3D3D3;  
  border-bottom: 2px solid #D3D3D3;  
  box-sizing: border-box;
`;

const ContainerCellsDiv = styled.div`

`;

const CellColumnDiv = styled.div`
  position: relative;
`;

const CellDiv = styled.div`
  height: calc(${C.HOUR_HEIGHT}px / 2);
  box-shadow: .3px .2px 0 0 slategray;
`;

const HourDiv = styled.div<{ $marginBottom: number; $isEven: boolean }>`
  font-family: 'Poppins', sans-serif;
  font-size: ${C.HOURS_FONT_SIZE}px;
  font-weight: 550;
  height: ${C.HOUR_HEIGHT / 2}px;
  margin-bottom: ${({ $marginBottom }) => $marginBottom}px;
  color: ${({ $isEven }) => ($isEven ? '#A9A9A9' : 'black')};
  box-sizing: border-box;
`;


const LongEventTimeDiv = styled.div<{  $isLinked: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  letter-spacing: 1px;
  margin-left: ${({ $isLinked }) =>  $isLinked? "0px" : "8px"};
  
  margin-top: 1px;
`;

const LongEventStartDiv = styled.div<{$isLinked: boolean}>`
  margin-left: ${({ $isLinked }) =>  $isLinked? "0px" : "5px"};
`;

const LongEventArrowDiv = styled(IconDiv)`
  margin-left: 5px;
  margin-bottom: 2px;
`



const LongEventIconBodyDiv = styled(IconDiv)`
  position: absolute;
  bottom: -17px;
  right: 7px;
  z-index: -1;
`



const ContainerModalDiv = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    z-index: 4;
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 650px;
  max-width: 70%;
  height: auto;
  padding: 2rem;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 1rem;
  padding: 40px;
`;

const Row1Div = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  margin-bottom: 15px;
`
const TitleInput = styled.input.attrs({ placeholder: 'Title'})`
  font-size: 1.2rem;
  box-sizing: border-box;
  border: 1px solid gray;
  border-radius: 5px;
  padding: 10px;
  flex: 1;
`;



const Row2Div = styled.div`
  width: 100%;
  margin-bottom: 15px;
`

const ModalTextArea = styled.textarea.attrs({rows: 5, placeholder: "Description"})`
  font-size: 1.2rem;
  box-sizing: border-box;
  text-align: left;
  vertical-align: top;
  border: 1px solid gray;
  border-radius: 5px;
  flex: 1;
  text-align: left; 
  resize: none;
  width: 100%;
  padding: 10px;
  ${C.HIDE_SCROLL_BAR}
`;

const Row3Div = styled.div`
  justify-content: space-between;
  display: flex;
  margin-bottom: 15px;
`;

const Row4Div = styled.div`
  justify-content: space-between;
  display: flex;
`


const TimeContainerDiv = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 8px;
  border: none;
`;


const ContainerMenuDiv = styled.div<{ $block: string }>`
  position: absolute;
  background-color: white;
  width: 150px;
  height: 150px;
  display: ${({$block}) => $block};
  left: 60px;
  z-index: 10;
  border-radius: 20px;
`;

const MenuItemDiv = styled.div`
  border-radius: 20px;
  display: flex;
  flex-wrap: wrap;
  border: solid .5px gray;
`;

const ItemButton = styled(ClickableDiv)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  svg{
  }
  &:hover{
    background-color: lightgray;
  }
`;

const ItemButtonColor = styled(ClickableDiv)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  svg{
  }
  &:hover{
    background-color: lightgray;
  }
`;


const TimeP = styled.p` // TODO IMPROVE THIS
  color: black;
`

const TimeSelect = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background-color: #fff;
  color: #333;
  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 3px rgba(0, 123, 255, 0.5);
  }
`;

const DayInputDate = styled.input.attrs({type: 'date',})`
  position: relative;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background-color: #fff;
  color: #333;
  width: 120px;

  &::-webkit-calendar-picker-indicator {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    color: transparent;
    background: 0 0;
    margin: 0;
    opacity: 0;
    pointer-events: auto;
  }
`;

const RecurringEventButton = styled.button.attrs({type: "button"})`
  width: 180px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  font-family: 'Poppins', sans-serif;
  font-weight: 800; 
  font-size: 20px;
  &:hover{
    cursor: pointer;
    background-color: lightgray;
  }
`

const ContainerDaySelectorDiv = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  width: 180px;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
  border: none;
  font-family: 'Poppins', sans-serif;
  font-weight: 800; 
  font-size: 15px;
  gap: 8px;
`;

const DayLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: black;
  border-radius: 40%;
`;

const DaySpan = styled.span`
`;


const EventInputCheckBox = styled.input.attrs({
  type: 'checkbox',
})`
`;


const IconColorDiv = styled.div`
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover{
    cursor: pointer;
  }
` 

const IconColorImg = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 10px;
` 

const Row5Div = styled.div`
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid lightgray;
  margin-top: 15px;
  padding-top: 10px;
  gap: 20px;
`


const SaveButton = styled.button.attrs({ type: 'submit' })`
  padding: 10px;
  background-color: #4CAF50; 
  color: white;
  border-radius: 8px;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  text-align: center;
  flex: 1;
`;

const DeleteButton = styled.button`
  padding: 10px;
  background-color: #f44336; 
  border-radius: 8px;
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  text-align: center;
  flex: 1;
`;

const ModalCloseButton = styled(ClickableDiv)`
  position: absolute;
  top: 8px;
  right: 8px;
  display: inline-block;
  border-radius: 10px;
  &:hover {
    background-color: #F0F0F0;
    cursor: pointer;
  }
`;

const ArrowButton = styled(ClickableDiv)`
  background-color: white;
  width: 70px;
  height: 80px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`




const FriendHeader = styled.header`
  width: 100%;
  border-bottom: 1px solid #D3D3D3;  
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 22px;
  &:hover{ 
    background-color: #F8F8F8;
    cursor: pointer;
  }
`;


const FriendSearchDiv = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
  border-radius: 5px;
  width: 150px;
  margin-top: 5px;
  margin-left: 5px;
  padding: 3px;
`;

const FriendSearchInput = styled.input`
  flex-grow: 1;
  border: none;
  border-color: transparent;
  outline: none;
  padding: 5px;
  width: 20px;;
`;

const FriendSearchIcon = styled(ClickableDiv)`
`;

const FriendButton = styled(ClickableDiv)<{ $isClicked: boolean }>`
  transition: transform 0.5s ease;
  transform: ${({ $isClicked }) => $isClicked ? 'translateY(100px)' : 'translateY(0px)'};
  position: absolute;
  right: 20px;
  bottom: 20px;
  border-radius: 50%;
  background-color: white;
`;

const FriendCloseButton = styled(ClickableDiv)`
  position: absolute;
  right: 8px;
  top: 8px;
`











const TodayButton = styled.button`
  border-style: none;
  background-color: white;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500; 
  width: 70px;      
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  height: 30px;
  user-select: none;
  &:hover{
    cursor: pointer;
    background-color: 	#F8F8F8;
  }
`

const CalendarNameDiv = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`




const ContainerShortEventDiv = styled.div`
  flex: 1;
  height: calc(100% - 12px); // -12px for Top/Bottom div are 6px.
  display: flex;
  align-items: center;
`;

const ContainerLongEventDiv = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: calc(100% - 12px); // -20px for EventHeader
`

const LongEventHeader = styled.header<{$color: string, $isLinked: boolean}>`
  background-color: ${({ $color}) => $color};
  height: 20px;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center; 
  color: white;
  font-size: ${({ $isLinked }) => $isLinked ? "9px" : "10px"};
  font-weight: 500;
  padding: ${({ $isLinked }) => $isLinked ? "0 0 5px 4px" : "0 0 5px 5px"};
`;


const LongEventIconDiv = styled(IconDiv)`
  margin-left: 5px;
`


const ShortEventTitleP = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 10px;
  display: flex;
  align-items: center;
  overflow: hidden;        
  white-space: nowrap;     
  text-overflow: ellipsis;  
  display: block;    
  padding: 0 5px;
`;

const LongEventTitleP = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 14px; 
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const LongEventDescriptionP = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 12px; 
  text-overflow: ellipsis;
  word-break: break-word; // Adjusts word wrapping
  overflow: hidden; // Hides overflow text
  height: 100%; 
  margin-top: 5px;
`;

const LongEventBodyDiv = styled.div`
  position: relative;
  padding: 10px;
  height: calc(100% - 35px);
`;

const EventBottomDiv = styled.div`
  width: 100%;
  flex: 0 0 6px;
  &:hover{
    cursor: ns-resize; 
  }
`;

const EventTopDiv = styled.div.attrs<{ $color: string; }>(
  ({ $color }) => ({ 
    style: { 
      backgroundColor: `${$color}`
    }
  }))`
  width: 100%;
  flex: 0 0 6px;
  border-width: 2px;
  border-top-left-radius: 8px; 
  border-top-right-radius: 8px; 
    &:hover{
    cursor: ns-resize; 
  }
`;


const HourLineDiv = styled.div.attrs<{ $fromTop: number }>(
  ({ $fromTop }) => ({
    style: {
      top: `${$fromTop}px`
  },
  }))<{ $fromTop: number }>`
    position: absolute;
    z-index: 2;
    width: calc(100%);
    color: red; 
    display: flex;
    align-items: center;
    font-family: 'Poppins', sans-serif;
    font-weight: 500; 
    pointer-events: none;
    flex: 1;
    height: 1px;
    background-color: red; 
`;


const colorDivFirst = styled.div<{ $color: string}>`
  background-color: ${({ $color} ) => `${$color}`};
  width: 100%;
  height: 100%;
  border-radius: 30%;
`

const colorDiv = styled.div<{ $color: string}>`
  background-color: ${({ $color} ) => `${$color}`};
  width: 50%;
  height: 50%;
  border-radius: 30%;
`

const EventDiv = styled.div.attrs<{ 
  $fromTop: number; 
  $height: number; 
  $borderColor: string;
  $backgroundColor: string;
  $isDragged: boolean;
  $borderStyle: string;
}>(
  ({ $fromTop, $height, $backgroundColor, $borderColor, $borderStyle}) => ({
  style: {
    top: `${$fromTop}px`,
    height: `${$height}px`,
    border: `1px ${$borderStyle} ${$borderColor}`,
    backgroundColor: `${$backgroundColor}`,
  },
}))<{ $isDragged: boolean,  $isFriendEvent: boolean, $isLinked: boolean}>`

  ${({ $isFriendEvent }) => css`
    margin-left: ${$isFriendEvent ? " 50%" : "0px"};
  `}
  width: ${({$isLinked}) => $isLinked ? "50%" : "100%"};
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 3;
  border-width: 2px;
  border-radius: 8px;
  box-sizing: border-box;
  &:hover {
    cursor:  ${({ $isDragged }) =>  $isDragged ? "grabbing" : "pointer"};
  }
  letter-spacing: 0.5px;
`;

const EventBodyDiv = styled.div`
  width: 100%;
  height: 100%;
`



const MenuP = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 500;
`

const MenuContainerDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 15px;
`

const FriendContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  height: auto;
  width: 100%;
  border-radius: 10px;
  transition: transform 0.5s ease;
  justify-content: center;
  margin-left: 25px;
`;

const MenuWrapperAside = styled.aside`
  width: 200px;
  margin-right: 30px;
  height: ${C.CALENDAR_HEIGHT}px;
`

const slideInFromBottom = keyframes`
  from {
    opacity: 0;
    transform: translateY(60px); 
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FriendsAnimIn = keyframes`
  from { height: 25px; }
  to { height: 600px; }
`;

const FriendsAnimOut = keyframes`
  from { height: 600px; }
  to { height: 25px; }
`;


const FriendDiv = styled.div`

`

const MenuButton = styled(ClickableDiv)<{ $isFriendsList: boolean, $isCalendarList: boolean }>`
  position: relative;
  border-radius: 10px;
  background-color: white;
  justify-content: flex-start;
  width: 80%;

  ${({ $isFriendsList, $isCalendarList }) => css`
    &:hover {
      cursor: ${$isFriendsList || $isCalendarList ? "default" : "pointer"};
      background-color: ${$isFriendsList || $isCalendarList ? "none" : "#F8F8F8"};
    }
    animation: ${$isFriendsList || $isCalendarList
      ? css`${FriendsAnimIn} .8s ease-in forwards;`
      : css`${FriendsAnimOut} .8s ease-out forwards;`};
    height: ${$isFriendsList || $isCalendarList ? "600px" : "25px"};
    flex-direction: ${$isFriendsList || $isCalendarList ? "column" : "row"};
    padding: ${$isFriendsList || $isCalendarList ? "0px" : "20px"};
    overflow-y: ${$isFriendsList || $isCalendarList ? "hidden" : "visible"};
  `}
`;


const FindFriendSection = styled.section`
  width: 100%;
  height: 25px;
`



const ToastWrapperDiv = styled.div`
  position: fixed;
  top: 10px;
  left: 45%;
  z-index: 100;
`;

const toastAnimIn = keyframes`
  from {
    transform: translateY(-100px);
  }
  to {
    transform: translateY(0px); 
  }
`;
toastAnimIn.name = "toastAnimIn"

const toastAnimOut = keyframes`
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-100px); 
  }
`;

toastAnimOut.name = "toastAnimOut"

const wiggle = keyframes`
  0% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(-5px);
  }
  40% {
    transform: translateY(3px);
  }
  60% {
    transform: translateY(-2px);
  }
  80% {
    transform: translateY(1px);
  }
  100% {
    transform: translateY(0);
  }
`;
wiggle.name = "wiggle"

const ToastContainerDiv = styled.div<{ $isVisible: boolean }>`
  width: 250px;
  height: 65px;
  background-color: white;
  border: 1px solid lightgray;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  padding: 15px;
  gap: 10px;
  animation: ${({ $isVisible }) =>
    $isVisible
      ? css`
        ${toastAnimIn} .5s ease-in-out forwards, ${wiggle} .8s ease-out .5s;
        `
      : css`
        ${toastAnimOut} .5s ease-in-out forwards;
        `
  };
  &:hover{
    border: 1px solid black;
  }
`;

const ToastIconDiv = styled(IconDiv)`
`;
const ToastDescriptionP = styled.p`
    font-family: 'Poppins', sans-serif;
    font-weight: 500; 
    overflow: hidden;
`;

const PrintableContent = styled.div`

`;

const FriendsWrapperDiv = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  position: relative;
  flex-wrap: nowrap;
`

const CalendarListContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  overflow-y: scroll;
  flex: 1;
  height: 100%;
  ${C.HIDE_SCROLL_BAR};
`

const FriendsContainerDiv = styled(CalendarListContainerDiv)`
  margin-top: 15px;
`

const FriendLi = styled.li`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 25px;
  margin: 10px 0;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-around;
  
`

const CalerndarLi = styled.li`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 45px;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-around;
  &:hover{
    background-color: lightgray;
    cursor: pointer;
  }
`

const FriendP = styled.p`
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500; 
  overflow: hidden;
  white-space: nowrap;     
  text-overflow: ellipsis;
  margin: 0 10px;
  
`

const MenuWrapperDiv = styled.div`
  position: absolute;
  top: 10px;
  left: 0px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`

const FriendCalendarSelect = styled.select`
  left: 0px;
  opacity: 0;
  position: absolute;
  width: 29px;
  height: 29px;
  z-index: 10;
    &:hover{
    cursor: pointer;
  }
`

const WarningWrapperDiv = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    z-index: 4;
`;

const WarningContainerDiv = styled.div`
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 50%;
    left: 50%;
    width: 420px;
    flex: 0 1 600px;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 1rem;
`;

const WarningMain = styled.main<{ $center: boolean }>`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: ${({$center}) => $center ? "center" : "space-between"};
  padding: 15px 30px;
`;

const WarningFooter = styled.footer`
  display: flex;
  flex-direction: column;
  border-top: 1px solid lightgrey;
  padding: 10px 30px;
  margin-top: 15px;
  gap: 15px;
`;

const WarningHeader = styled.header`
  padding: 10px;
  border-bottom: 1px solid lightgray;
  text-align: center;
`;

const WarningP = styled.p`
  padding: 10px 30px;
  text-align: justify; 
`;

const Warningh1 = styled.h1`
  font-size: 20px;
  font-weight: 500;
`;

const WarrningEventWrapperDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const WarrningEventh2 = styled.h2`
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 10px;
`


const WarningEventsWarningDiv = styled.div`
  display: flex;
  gap: 5px;
`

const WarningIconDiv = styled(ClickableDiv)`
border-radius: 15px;
  &:hover{
    background-color: lightgray;
  }
`

const WarningButton = styled.input.attrs({ type: "button" })`
  background-color: #f44336;
  padding: 20px;
  border-radius: 8px;
  color: black;
  border: none;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  flex: 1;
`;

const LinkIconImg = styled.img`
  width: 40px;
  height: 40px;
  &:hover{
    cursor: pointer;
  }
`

const HeaderRigthestWrapperDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 120px;
`

export{
  HeaderRigthestWrapperDiv,
  LinkIconImg,
  WarningButton,
  WarningIconDiv,
  WarningEventsWarningDiv,
  WarrningEventh2,
  WarrningEventWrapperDiv,
  Warningh1,
  WarningMain,
  WarningFooter,
  WarningHeader,
  WarningP,
  WarningWrapperDiv,
  WarningContainerDiv,
  CalerndarLi,
  CalendarListContainerDiv,
  FriendCalendarSelect,
  MenuWrapperDiv,
  FriendP,
  FriendLi,
  FriendsContainerDiv,
  FindFriendSection,
  PrintableContent,
  ToastWrapperDiv,
  ToastContainerDiv,
  ToastIconDiv,
  ToastDescriptionP,
  FriendsWrapperDiv,

  colorDiv,
  MenuButton,
  MenuP,
  MenuWrapperAside,

  // Calendar Components
  CalendarWrapperDiv,
  CalendarNameInput,
  CalendarNameDiv,
  TodayButton,
  ChangeWeekButton,
  SaveButton,
  DeleteButton,
  ChangeWeekDiv,
  MonthP,

  // Container Components 
  // TODO things that are not containers should be wrappers or viceversa
  CalendarContainerDiv,
  ContainerShortEventDiv,
  ContainerLongEventDiv,
  ContainerHeader,
  ContainerAside,
  ContainerSection,
  ContainerMain,
  ContainerCellsDiv,
  ContainerModalDiv,
  ContainerMenuDiv,
  ContainerDaySelectorDiv,
  MenuContainerDiv,

  // Header and Menu Items
  MenuItemDiv,
  ItemButton,
  IconMenuButton,

  // Day and Time Components
  DayInputDate,
  DaySpan,
  DayLabel,
  DayNameP,
  DayNumberP,
  HourDiv,
  HourLineDiv,
  TimeContainerDiv,
  TimeP,
  TimeSelect,

  // Event Components
  EventDiv,
  EventTopDiv,
  EventBottomDiv,
  RecurringEventButton,
  EventInputCheckBox,
  EventBodyDiv,
  ItemButtonColor,

  // Long Event Components
  LongEventTitleP,
  LongEventBodyDiv,
  LongEventIconBodyDiv,
  LongEventIconDiv,
  LongEventTimeDiv,
  LongEventStartDiv,
  LongEventArrowDiv,
  LongEventDescriptionP,
  LongEventHeader,

  // Short Event Components
  ShortEventTitleP,

  // Cell Components
  CellColumnDiv,
  CellDiv,
  FriendCalendarButton,
  
  // Modal Components
  ModalForm,
  ModalCloseButton,
  Row1Div,
  Row2Div,
  Row3Div,
  Row4Div,
  Row5Div,
  IconColorDiv,
  IconColorImg,
  ModalTextArea,

  // Selector Components
  SectionDayDiv,
  ContianerNumberDiv,

  // Button Components
  ClickableDiv,
  IconButton,
  ArrowButton,
  TitleInput,

  // Friend Search Components
  FriendSearchDiv,
  FriendContainerDiv,
  FriendSearchIcon,
  FriendHeader,
  FriendSearchInput,
  FriendCloseButton,
  FriendButton,
  colorDivFirst,
}