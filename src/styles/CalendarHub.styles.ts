import * as C from "@/utils/CalendarHub/constants"
import styled from "styled-components";

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

    /* Hide scrollbar for WebKit browsers (Chrome, Safari, Edge) */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
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

const HEADER_Container = styled.div`
  position: relative;
  width: fit-content;
  font-size: ${C.HEADER_FONT_SIZE};
  &::after {
    content: '';
    display: block;
    width: 100%;
    border-bottom: 2px dashed #A0A0A0; 
    margin-top: 1px; 
  }
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
  width: calc(100% - 5px);
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

const ShortEvent = styled.div<{ $fromTop: number, $height: number, $color: string }>`
  position: absolute;
  z-index: 40;
  width: calc(100% - 2px);
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
  margin-left: 1.5px;

  &:hover {
    cursor: pointer;
  }
`;

const EventTitle = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  margin-left: 2px;
  font-size: 14px; 
`;

const EventDescription = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  margin-left: 2px;
  font-size: 14px; 
`;

const LongEvent = styled(ShortEvent)`

`;


const EventIcon = styled.div<{$color: string, $width: number, $height: number}>`
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  padding-bottom: 3px;

  svg {
    width: 100%;
    height: 100%;
    color: ${({ $color }) => $color};
  }
`;


const LongEventHeader = styled.div<{$color: string}>`
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

const LongEventTime = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  letter-spacing: 1px;
`;

const EventStartTime = styled.div`
`;

const EventEndTime = styled.div`
`;

const LongEventBody = styled.div`
`;



const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 100%;
  overflow: auto;
`;

const TimeInput = styled.input.attrs({
  type: 'time',
  step: 60,
})`
  appearance: none;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  padding: 8px;
  width: 100%; 
  box-sizing: border-box; 
`;

const EventDayChecks = styled.input.attrs({
  type: 'checkbox',
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
  ShortEvent,
  HEADER_Container,
  EventTitle,
  LongEvent,
  LongEventHeader,
  LongEventBody,
  EventIcon,
  LongEventTime,
  EventDescription,
  EventStartTime,
  EventEndTime

};