import * as CONST from "@/utils/constants"
import styled from "styled-components";

// WEEKLY CALENDAR STYLES
const Container = styled.div`
  width: 90%;
  max-width: 1200px;
  height: 80vh;
  margin: 0 50px;
  border-radius: 2%;
  background-color: white;

  display: grid;
  // First row has fixed size;

  grid-template-rows: ${CONST.HEADER_HEIGHT}px ${CONST.DAYS_OF_THE_WEEK_HEIGHT}px 1fr; 
`;


// HEADER STYLES START

const Header = styled.div`
  padding: 5px;
  box-shadow: 0 .2px 0 0 slategray;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
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

const Buttons = styled.div`
  text-align: right; 
`;

// HEADER STYLES END

// DAYS OF THE WEEK STYLES START
const DaysOfTheWeek = styled.div`
  align-items: center; 

  font-family: 'Poppins', sans-serif;
  font-weight: 600; 

  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-left: ${CONST.HOUR_WIDTH}px;
`;

const Day = styled.div`
  text-align: center; 
`;

// DAYS OF THE WEEK  STYLES END


// MAIN STYLES START
const Main = styled.div`
  position: relative;
  overflow-y: scroll;

  display: grid;
  grid-template-columns: ${CONST.HOUR_WIDTH}px 1fr;
`;

const AsideTime = styled.div`
  text-align: center; 
  align-items: center; 
  justify-items: center; 
`;

const Hour = styled.div`
  font-family: 'Poppins', sans-serif;
  font-weight: 500; 
  height: ${CONST.HOUR_HEIGHT}px;
`;

const DayColumn = styled.div`
  position: relative;
`;

const Cells = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;



const HourLine = styled.div<{ $fromTop: number }>`
  position: absolute;
  margin-left: 5px;
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

const LineAfterHour = styled.div`
  flex: 1;
  height: 1px;
  background-color: red; 
`;
// MAIN STYLES END
const HourLineDot = styled.div<{ $fromTop: number }>`
  position: absolute;
  width: 10px; 
  height: 10px; 
  border-radius: 50%; 
  background-color: orange; 
  top: ${({ $fromTop }) => $fromTop}px;
  left: calc(50% - 5px);
  transform: translateX(-50%);
`;

const Cell = styled.div`
  height: calc(${CONST.HOUR_HEIGHT}px / 2);
  box-shadow: .2px .2px 0 0 slategray;
`;

// EVENT STYLES
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


// EVENT MODAL STYLES
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
  Container,
  Header,
  Title,
  Buttons,
  DaysOfTheWeek,
  Day,
  Main,
  AsideTime,
  Hour,
  DayColumn,
  Cells,
  HourLine,
  LineAfterHour,
  HourLineDot,
  Cell,
};