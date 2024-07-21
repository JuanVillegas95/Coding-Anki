import * as C from "@/utils/CalendarHub/constants"
import styled from "styled-components";


const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const GridContainer = styled.div`
  width: 90%;
  max-width: ${C.CALENDAR_WIDTH}px;
  height: ${C.CALENDAR_HEIGHT}px;
  margin: 0 30px;
  border-radius: 1.5%;
  background-color: white;
  display: grid;

  grid-template-rows: ${C.HEADER_HEIGHT}px ${C.DAYS_OF_THE_WEEK_HEIGHT}px 1fr; 
  grid-template-columns: ${C.HOUR_WIDTH}px 1fr;
  grid-template-areas: "header header" "aside subheader" "aside main";

  ${C.HIDE_SCROLL_BAR} 
`;

const Header = styled.div`
  grid-area: header;
  padding: 10px;
  box-shadow: 0 .2px 0 0 slategray;

  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  padding: 20px;
`;

const Icon = styled.div<{$color: string, $width: number, $height: number}>`
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;

  svg {
    width: 100%;
    height: 100%;
    path {
      fill: ${({ $color }) => $color};
    }
  }
`;

const HeaderIcon = styled(Icon)`
  &:hover {
    cursor: pointer;
  }
`;

const HeaderMonth = styled.div`
  grid-area: month;

`;


const HeaderIconLeft = styled(HeaderIcon)`
  grid-area: left;

`;

const HeaderIconRight = styled(HeaderIcon)`
  grid-area: right;

`;

const HeaderItem = styled.div<{}>`

`;

const MonthWrapper = styled.div<{}>`
  display: grid;
  grid-template-areas: "month month" "left right" "left right";
  grid-template-rows: 20px 20px; 
  grid-template-columns: 1fr 1fr;
`;


const HEADER_Container = styled.div`
  display: flex;
  flex: row;
  flex-wrap: nowrap;
  position: relative;
  width: fit-content;
  font-size: ${C.HEADER_FONT_SIZE};

`;

const HEADER_Title = styled.input`
  font-family: 'Poppins', sans-serif;
  font-weight: 800; 
  font-size: ${C.HEADER_FONT_SIZE}px;
  width: 225px;
  max-width: 225px;
  text-align: left; 
  border: none;
  outline: none;
`;


const Aside = styled.div`
  grid-area: aside;
  text-align: center; 
  align-items: center; 
  justify-items: center; 
  margin-top: ${C.DAYS_OF_THE_WEEK_HEIGHT - 7}px;
  overflow-y: scroll;
  /* Hide scrollbar for WebKit browsers (Chrome, Safari, Edge) */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`;

const SubHeader = styled.div`
  grid-area: subheader;
  height: ${C.SUBHEADER_HEIGHT}px;
  align-items: center; 

  font-family: 'Poppins', sans-serif;
  font-size: ${C.SUBHEADER_FONT_SIZE}px;
  font-weight: 600; 

  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-right: 15px;
`;

const S_Day = styled.div`
  text-align: center; 
`;


const Main = styled.div`
  grid-area: main;

  position: relative;
  overflow-y: scroll;
  /* Hide scrollbar for WebKit browsers (Chrome, Safari, Edge) */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  margin-right: 15px;
`;


const A_Hour = styled.div<{ $marginBottom: number; $isEven: boolean }>`
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
  z-index: 40;
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


const EventIcon = styled(Icon)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  padding-bottom: 3px;
`;


const EventHeader = styled.div<{$color: string}>`
  background-color: var(--primary-${({ $color }) => $color});
  width: 100%;
  height: 25px;
  display: flex;
  flex-direction: row;
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

const RecurringEventWrapper = styled.div`
  color: black;

`
const RecurringEvent = styled.input.attrs({
  type: 'checkbox',
})`
`;

const EventDayChecks = styled.input.attrs({
  type: 'checkbox',
})`
`;

const DayPicker = styled.input.attrs({
  type: 'date',
})`
`;


const EventSettings = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  color: #fff; /* Assuming white text for visibility */

  & > * {
    margin: 5px 0;
  }
`;

const InputTitle = styled.input.attrs({ placeholder: 'Title' })`
  padding: 10px;
  font-size: 1.2rem;
  width: 100%;
  box-sizing: border-box;
`;

const SelectColor = styled.select`
  padding: 10px;
  font-size: 1.2rem;
  border: 2px solid #d3d3d3;
  background-color: white;
  color: #333;
  width: 100%;
  box-sizing: border-box;
`;

const SelectIcon = styled.select`
  padding: 10px;
  font-size: 1.2rem;
  border: 2px solid #d3d3d3;
  background-color: white;
  color: #333;
  width: 100%;
  box-sizing: border-box;
`;


const InputDescription = styled.input.attrs({ placeholder: 'Description' })`
  padding: 10px;
  font-size: 1.2rem;
  width: 100%;
  box-sizing: border-box;
`;

const InputTimeContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const DayLabel = styled.label`
  display: flex;
  align-items: center;
  color: black;
  padding: 10px;
  border-radius: 40%;
`;

const DayText = styled.span`
  margin-left: 5px;
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

const CrossContainer = styled(Icon)`
  position: absolute;
  top: .5rem;
  right: .5rem;
  display: inline-block;
  &:hover {
    cursor: pointer;
  }
`;

const DayPickerWrapper = styled.div`

`


export {
  ModalContent,
  TimeInput,
  EventDayChecks,
  EventSettings,
  InputTitle,
  SelectColor,
  InputDescription,
  InputTimeContainer,
  ButtonsContainer,
  DayLabel,
  DayText,
  SaveButton,
  DeleteButton,
  GridContainer,
  Header,
  Aside,
  SubHeader,
  Main,
  HEADER_Title,
  A_Hour,
  S_Day,
  M_DayColumn,
  M_Cells,
  H_HourLine,
  H_LineAfterHour,
  M_HourLineDot,
  M_Cell,
  Event,
  HEADER_Container,
  EventTitle,
  EventHeader,
  EventBody,
  EventIcon,
  EventTime,
  EventDescription,
  StartTime,
  EndTime,
  Icon,
  HeaderItem,
  MonthWrapper,
  HeaderIcon,
  HeaderMonth,
  HeaderIconRight,
  HeaderIconLeft,
  ModalDiv,
  ContentDiv,
  CrossContainer,
  SelectIcon,
  TimeHour,
  TimeMinutes,
  TimeText,
  RecurringEvent,
  RecurringEventWrapper,
  DayPicker,
  DayPickerWrapper,
  Container
};