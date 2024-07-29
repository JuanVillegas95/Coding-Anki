import * as C from "@/utils/CalendarHub/constants"
import styled from "styled-components";

// PARENTS CLASSES

const IconDiv = styled.div<{$color: string, $width: number, $svg_w: number}>`
  width: ${({ $width }) => $width}px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: ${({ $svg_w }) => $svg_w}px;
    height: auto;
    path {
      fill: ${({ $color }) => $color};
    }
  }
`;



const ContainerDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const CalendarDiv = styled.div`
  width: ${C.CALENDAR_WIDTH}px;
  height: ${C.CALENDAR_HEIGHT}px;
  min-width: ${C.CALENDAR_WIDTH - 200}px;
  margin: 0 30px;
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

const CalendarTitleInput = styled.input`
  font-family: 'Poppins', sans-serif;
  font-weight: 800; 
  width: 225px;
  text-align: left; 
  border: none;
  outline: none;
`;

const MonthContainerDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;   
`;

const ClickIconDiv = styled(IconDiv)`
  &:hover{
    cursor: pointer;
  }
`;

const MonthDiv = styled.div`
  font-family: 'Poppins', sans-serif;
  font-weight: 500; 
  width: 80px;      
  text-align: center; 
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

  font-family: 'Poppins', sans-serif;
  font-size: ${C.SUBHEADER_FONT_SIZE}px;
  font-weight: 400; 

  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-right: 15px;
`;

const S_Day = styled.div`
  text-align: center; 
`;


const Main = styled.div`
  grid-area: main;
  margin-right: 15px;

  position: relative;
  overflow-y: scroll;
  ${C.HIDE_SCROLL_BAR}
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

const M_DayColumn = styled.div`
  position: relative;
`;

const M_Cells = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-top: 2px solid #D3D3D3;  
  border-left: 1px solid #D3D3D3;  
  border-right: 1px solid #D3D3D3;  

  box-sizing: border-box;
`;

const H_HourLine = styled.div<{ $fromTop: number }>`
  position: absolute;
  z-index: 2;
  width: calc(100%);
  top: ${({ $fromTop }) => $fromTop}px;
  color: red; 
  font-size: 15px; 
  display: flex;
  align-items: center;
  font-family: 'Poppins', sans-serif;
  font-weight: 500; 
  pointer-events: none;
`;

const H_LineAfterHour = styled.div`
  flex: 1;
  height: 1px;
  background-color: red; 
`;
// MAIN STYLES END
const M_HourLineDot = styled.div<{ $fromTop: number }>`
  position: absolute;
  width: 10px; 
  height: 10px; 
  border-radius: 50%; 
  background-color: orange; 
  top: ${({ $fromTop }) => $fromTop}px;
  left: calc(50% - 5px);
  transform: translateX(-50%);
`;

const M_Cell = styled.div`
  height: calc(${C.HOUR_HEIGHT}px / 2);
  box-shadow: .3px .2px 0 0 slategray;
`;

// EVENT STYLES

const Event = styled.div<{ $fromTop: number, $height: number, $color: string, }>`
  position: absolute;
  z-index: 3;
  width: calc(100% - 1px);
  top: ${({ $fromTop }) => $fromTop}px;
  background: green;
  margin: 0;
  height: ${({ $height }) => $height}px;
  border: 1px solid var(--primary-${({ $color }) => $color});
  background-color: var(--secondary-${({ $color }) => $color});
  border-width: 2px;
  border-radius: 0.4rem;
  white-space: normal;
  overflow: hidden;
  margin-left: 1px;

  &:hover {
    cursor: pointer;
  }
`;

const EventTitle = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  margin-left: 2px;
  font-size: 14px; 
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const EventDescription = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  margin-left: 2px;
  font-size: 14px; 
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;


const EventIcon = styled(IconDiv)`

`;

const EventHeader = styled.div<{$color: string}>`
  background-color: var(--primary-${({ $color }) => $color});
  width: 100%;
  height: 25px;
  display: flex;

  align-items: center; 
  justify-content: space-between;
  color: white;
  font-size: 10px;
  box-sizing: border-box;
  font-weight: 500;
`;

const EventTime = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  letter-spacing: 1px;
`;

const StartTime = styled.div`
`;

const EndTime = styled.div`
`;

const EventBody = styled.div`
`;



const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 100%;
  overflow: auto;
`;


const TimeInput = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TimeHour = styled.select`
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

const TimeMinutes = styled.select`
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

const TimeText = styled.p`
  color: black;
`


const RecurringEvent = styled.input.attrs({
  type: 'checkbox',
})`
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
const EventDayChecks = styled.input.attrs({
  type: 'checkbox',
})`
`;

const DayPicker = styled.input.attrs({type: 'date',})`

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

`;

const FirstRowDiv = styled.div`
  display: flex;
  flex-wrap: nowrap;

  height: 60px;
  padding: 8px;
  gap: 10px;
`

const TitleInput = styled.input.attrs({ placeholder: 'Title' })`
  font-size: 1.2rem;
  box-sizing: border-box;
  border: 1px solid gray;
  border-radius: 5px;
  padding: 12px;
  flex: 1;
`;

const MenuDiv = styled.div`
  position: relative;
  display: flex;
  flex-wrap: nowrap;

  align-items: center;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 10px;
  &:hover{
    background-color: lightgray;
    cursor: pointer;
  }
`;

const SelectMenuDiv = styled.div<{ $block: string }>`
  position: absolute;
  background-color: white;
  width: 150px;
  height: 150px;
  display: ${({$block}) => $block};
  left: 60px;
  z-index: 10;
  border-radius: 20px;
`;


const ItemWrapperDiv = styled.div`
  border-radius: 20px;
  display: flex;
  flex-wrap: wrap;
  border: solid .5px gray;
`;


const ItemDiv = styled(IconDiv)`
  border-radius: 20px;

  width: 49px;
  height: 49px;
  &:hover{
    background-color: lightgray;
    cursor: pointer;
  }
`;

const IconColorWrapper = styled.div`
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
` 

const IconColor = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 10px;
` 

const ModalTextArea = styled.textarea.attrs({rows: 5, placeholder: "Description"})`
  font-size: 1.2rem;
  box-sizing: border-box;
  text-align: left;
  vertical-align: top;
  border: 1px solid gray;
  border-radius: 5px;
  margin: 0 10px;
  flex: 1;
  text-align: left; 
  padding: 12px;
  margin: 10px;
  resize: none;
  
`;

const InputTimeContainer = styled.div`
  justify-content: space-between;
  display: flex;
  gap: 10px;
  padding: 0 10px;
`;

const ButtonsContainer = styled.div`
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

const DayText = styled.span`
`;

const SaveButton = styled.button.attrs({ type: 'submit' })`
  padding: 10px;
  background-color: #4CAF50; /* Green background */
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  text-align: center;
  flex: 1;
`;

const DeleteButton = styled.button`
  padding: 10px;
  background-color: #f44336; 
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  text-align: center;
  flex: 1;
`;


const DayPickerWrapper = styled.div`
  justify-content: space-between;
  display: flex;

  flex-wrap: nowrap;
  padding: 0 10px;
  height: 60px;
  margin: 10px 0;
  gap: 10px;
`


const EventButtons = styled.div`
  margin-top: 15px;
  padding: 5px;
  border-top: solid black 1px;
`

const ModalDiv = styled.div<{ $block: string,  }>`
    display: ${p => p.$block};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    z-index: 4;
`;

const ContentDiv = styled.div<{}>`

`;

const ModalCloseDiv = styled(IconDiv)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: inline-block;
  &:hover {
    cursor: pointer;
  }
`;

const DayInputWrapperDiv = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 8px;
  border: none;
`

export {
  ContainerDiv,
  CalendarDiv,
  ContainerHeader,
  CalendarTitleInput,
  MonthContainerDiv,
  ClickIconDiv,
  MonthDiv,
  ContainerAside,
  HourDiv,
  ContainerSection,

  DayInputWrapperDiv,
  ContentDiv,
  ModalCloseDiv,
  ModalContent,
  ModalDiv,
  TimeInput,
  EventDayChecks,
  ModalForm,
  TitleInput,
  ModalTextArea,
  InputTimeContainer,
  ButtonsContainer,
  DayLabel,
  DayText,
  SaveButton,
  DeleteButton,
  Main,

  S_Day,
  M_DayColumn,
  M_Cells,
  H_HourLine,
  H_LineAfterHour,
  M_HourLineDot,
  M_Cell,
  Event,
  EventTitle,
  EventHeader,
  EventBody,
  EventIcon,
  EventTime,
  EventDescription,
  StartTime,
  EndTime,
  IconDiv,
  SelectMenuDiv,
  TimeHour,
  TimeMinutes,
  TimeText,
  RecurringEvent,
  DayPicker,
  DayPickerWrapper,
  EventButtons,
  FirstRowDiv,
  MenuDiv,
  ItemWrapperDiv,
  ItemDiv,
  IconColor,
  RecurringEventButton,
  IconColorWrapper,

};