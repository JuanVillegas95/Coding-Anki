import * as CONST from "@/utils/constants"
import styled from "styled-components";

const Container = styled.div`
  width: 90%;
  max-width: 1200px;
  height: 80vh;
  margin: 0 50px;
  border-radius: 2%;
  background-color: white;

  display: grid;
  grid-template-rows: ${CONST.HEADER_HEIGHT}px ${CONST.DAYS_OF_THE_WEEK_HEIGHT}px 1fr;
`;

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

const Events = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const Event = styled.div<{ $fromTop: number, $height: number, $color: string }>`
  position: absolute;
  z-index: 40;
  width: calc(100% - 5px);
  left: 2.5px;
  top: ${({ $fromTop }) => $fromTop}px;
  background: green;
  margin: 0;
  height: ${({ $height }) => $height}px;
  border: 1px solid var(--primary-${({ $color }) => $color});
  background-color: var(--secondary-${({ $color }) => $color});
  border-width: 2px;
  border-radius: 0.5rem;
  padding: 5px; /* Adjust padding if necessary */

  white-space: normal; /* Ensure text wrapping */
  overflow: hidden; /* Prevent overflow */

  &:hover {
    cursor: pointer;
  }

  strong {
    display: block;
  }
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

export {
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
  Events,
  Event,
  HourLine,
  LineAfterHour,
  HourLineDot,
  Cell
};