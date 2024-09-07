import * as C from "@/utils/CalendarHub/constants"
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

const IconDiv = styled.div<{$color: string, $size: number, $svgSize: number}>`
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
const ContainerDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;


const CalendarDiv = styled.div`
  width: ${C.CALENDAR_WIDTH}px;
  height: ${C.CALENDAR_HEIGHT}px;
  min-width: ${C.CALENDAR_WIDTH - 200}px;
  margin: 0 30px;
  padding-bottom: 5px;
  border-radius: 1.5%;
  background-color: white;
  display: grid;

  grid-template-rows: ${C.HEADER_HEIGHT}px ${C.DAYS_OF_THE_WEEK_HEIGHT}px 1fr; 
  grid-template-columns: ${C.HOUR_WIDTH}px 1fr;
  grid-template-areas: "header header" "aside subheader" "aside main";

  ${C.HIDE_SCROLL_BAR} 
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

const ClickableButton = styled(IconButton)`
  user-select: none;
  outline: none;
  &:hover{
    cursor: pointer;
  }
`;

const ChangeWeekButton = styled(ClickableButton)`
  border-radius: 15px;
  &:hover{
    background-color: 	#F8F8F8;
  }
`

const MonthP = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 500; 
  text-align: center; 
  margin-right: 15px;
  font-size: 20px;
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
  text-align: center; 
`;

const DayNameP = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 600; 

  font-size: 12px;
`

const DayNumberP = styled.p<{ $isToday: boolean }>`
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 400; 
  margin-top: 4px;
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





const LongEventTimeDiv = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  letter-spacing: 1px;
  margin-left: 8px;
  margin-top: 1px;
`;

const LongEventStartDiv = styled.div`
  margin-right: 5px;
`;

const LongEventArrowDiv = styled(IconDiv)`
  margin-bottom: 2px;
`

const LongEventEndDiv = styled.div`
  margin-left: 5px;
`;


const LongEventIconBodyDiv = styled(IconDiv)`
  position: absolute;
  bottom: -17px;
  right: 7px;
  z-index: -1;
`


const HourLineDiv = styled.div<{ $fromTop: number }>`
  position: absolute;
  z-index: 2;
  width: calc(100%);
  top: ${({ $fromTop }) => $fromTop}px;
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


const ContainerModalDiv = styled.div<{ $block: string,  }>`
    display: ${({$block}) => $block};
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

const ItemButton = styled(ClickableButton)`
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

const ModalCloseButton = styled(ClickableButton)`
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

const ArrowButton = styled(ClickableButton)`
  background-color: white;
  width: 70px;
  height: 80px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`


const FriendContainerDiv = styled.div<{ $isClicked: boolean }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: white;
  height: auto;
  width: 180px;
  border-radius: 10px;
  transition: transform 0.5s ease;
  transform: ${({ $isClicked }) => $isClicked ? 'translateX(0px)' : 'translateX(400px)'};
  justify-content: center;
`;

const FriendHeader = styled.header`
  position: relative;
  width: 100%;
  border-bottom: 1px solid #D3D3D3;  
  display: flex;
  justify-content: center;
`;


const FriendSearchDiv = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  border: 2px solid black;
  border-radius: 5px;
  margin-top: 25px;
  margin-bottom: 5px;
  margin-right: 30px;
  margin-left: 30px;
`;

const FriendSearchInput = styled.input`
  flex-grow: 1;
  border: none;
  border-color: transparent;
  outline: none;
  padding: 5px;
`;

const FriendSearchIcon = styled(ClickableButton)`
`;

const FriendButton = styled(ClickableButton)<{ $isClicked: boolean }>`
  transition: transform 0.5s ease;
  transform: ${({ $isClicked }) => $isClicked ? 'translateY(100px)' : 'translateY(0px)'};
  position: absolute;
  right: 20px;
  bottom: 20px;
  border-radius: 50%;
  background-color: white;
`;

const FriendCloseButton = styled(ClickableButton)`
  position: absolute;
  right: 8px;
  top: 8px;
`

const FriendUl = styled.ul`
  width: 100%;
  flex-grow: 1;
  list-style: none;
  display: flex;
  flex-direction: column;
  padding: 5px;
`
const FriendNameP = styled.p`
  font-weight: 500;
  font-size: 20;
  margin: 8px;
`

const FriendNameLi = styled.li`
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  width: 100%;
  align-items: center;
`

const DropdownButton = styled(ClickableButton)<{ $isClicked: boolean} >`
  transition: transform 0.3s linear;
  transform: ${({ $isClicked }) => $isClicked ? "rotate(-90deg)" : "rotate(90deg)"};
  border-radius: 15px;
  margin-left: auto;
`

const slideInFromBottom = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px); 
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FriendCalendarNameLi = styled.li<{ $isVisible: boolean, $delay: number }>`
  animation: ${({ $isVisible, $delay }) => $isVisible ? "none" : css`${slideInFromBottom} ${$delay}s ease-in-out`};
  will-change: transform, opacity; 
  padding: 5px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  width: 100%;
`;

const LinkedButton = styled(DropdownButton)`
  background-color: transparent;
  margin-right: 3px;
`

const CalendarNameP = styled.p`
  margin-left: 20px;
  font-size: 14px;
`;

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

const CalendarNameUl = styled.ul`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50px;
  left: 30px;
  z-index: 50;
  border-radius: 15px;
  background-color: white;
  border: 1px solid #A0A0A0;
`

const CalendarNameLi = styled.li<{ $isVisible: boolean; $delay: number }>`
  display: block; 
  animation: ${({ $isVisible, $delay }) =>
    $isVisible ? "none" : css`${slideInFromBottom} ${$delay}s ease-in-out`};
  will-change: transform, opacity; 
  padding: 10px;
  border-radius: 15px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 200px; 
  padding: 15px;
  font-size: 15px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500; 
  &:hover {
    cursor: pointer;
    background-color: #F8F8F8;

  }
`;

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

const LongEventHeader = styled.header<{$color: string}>`
  background-color: var(--primary-${({ $color }) => $color});
  height: 20px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center; 
  color: white;
  font-size: 10px;
  font-weight: 500;
  padding: 0 0 5px 5px;
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
      backgroundColor: `var(--primary-${$color})`
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



const EventDiv = styled.div.attrs<{ $fromTop: number; $height: number; $color: string, $isDragged: boolean}>(
  ({ $fromTop, $height, $color }) => ({
  style: {
    top: `${$fromTop}px`,
    height: `${$height}px`,
    border: `1px solid var(--primary-${$color})`,
    backgroundColor: `var(--secondary-${$color})`,
  },
}))<{ $fromTop: number; $height: number; $color: string, $isDragged: boolean}>`
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 3;
  width: 100%;
  border-width: 2px;
  border-radius: 8px;
  box-sizing: border-box;
  &:hover {
    cursor:  ${({ $isDragged }) =>  $isDragged ? "grabbing" : "pointer"};
  }
  letter-spacing: 0.5px;
`;



export{
  // Calendar Components
  CalendarDiv,
  CalendarNameInput,
  CalendarNameP,
  CalendarNameDiv,
  CalendarNameLi,
  CalendarNameUl,
  TodayButton,
  ChangeWeekButton,
  SaveButton,
  DeleteButton,
  ChangeWeekDiv,
  MonthP,

  // Container Components 
  // TODO things that are not containers should be wrappers or viceversa
  ContainerDiv,
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

  // Header and Menu Items
  MenuItemDiv,
  ItemButton,
  IconMenuButton,
  DropdownButton,
  LinkedButton,

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

  // Long Event Components
  LongEventTitleP,
  LongEventBodyDiv,
  LongEventIconBodyDiv,
  LongEventIconDiv,
  LongEventTimeDiv,
  LongEventStartDiv,
  LongEventArrowDiv,
  LongEventEndDiv,
  LongEventDescriptionP,
  LongEventHeader,

  // Short Event Components
  ShortEventTitleP,

  // Cell Components
  CellColumnDiv,
  CellDiv,

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
  ClickableButton,
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
  FriendUl,
  FriendNameLi,
  FriendCalendarNameLi,
  FriendNameP,
}