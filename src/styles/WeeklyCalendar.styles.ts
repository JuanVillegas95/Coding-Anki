import * as C from "@/utils/constants"
import styled from "styled-components";

const GridContainer = styled.div`
  width: 90%;
  max-width: 1400px;
  height: 90vh;
  margin: 0 30px;
  border-radius: 2%;
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
  padding: 5px;
  box-shadow: 0 .2px 0 0 slategray;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;


const Aside = styled.div`
  grid-area: aside;
  text-align: center; 
  align-items: center; 
  justify-items: center; 
  margin-top: ${C.HEADER_HEIGHT}px;
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

  align-items: center; 

  font-family: 'Poppins', sans-serif;
  font-weight: 600; 

  display: grid;
  grid-template-columns: repeat(7, 1fr);
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

`;


const A_Hour  = styled.div<{ $marginBottom: number }>`
  font-family: 'Poppins', sans-serif;
  font-size: 12.5px;
  font-weight: 500; 
  height: ${C.HOUR_HEIGHT/2}px;
  margin-bottom: ${({ $marginBottom }) => $marginBottom|| 0}px;
`;

const M_DayColumn = styled.div`
  position: relative;
`;

const M_Cells = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
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
  box-shadow: .2px .2px 0 0 slategray;
`;

// EVENT STYLES
const E_Event = styled.div<{ $fromTop: number, $height: number, $color: string }>`
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

const H_Title = styled.h2`
  text-align: left; 
  font-family: 'Poppins', sans-serif;
  font-weight: 600; 
  position: relative;
  display: inline-block;
  margin-bottom: 10px;

  &::after {
    content: '';
    display: block;
    width: 100%;
    border-bottom: 2px dashed #A0A0A0; 
    margin-top: 5px; 
  }
`;

const H_Buttons = styled.div`
  text-align: right; 
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
  H_Title,
  H_Buttons,
  A_Hour,
  S_Day,
  M_DayColumn,
  M_Cells,
  H_HourLine,
  H_LineAfterHour,
  M_HourLineDot,
  M_Cell,
  E_Event
};