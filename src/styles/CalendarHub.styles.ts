import * as C from "@/utils/CalendarHub/constants"
import styled from "styled-components";

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
`;

const ContainerCellsDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  position: relative;
  border-top: 2px solid #D3D3D3;  
  border-left: 1px solid #D3D3D3;  
  border-right: 1px solid #D3D3D3;  
  border-bottom: 2px solid #D3D3D3;  
  box-sizing: border-box;
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


const EventDiv = styled.div<{ $fromTop: number, $height: number, $color: string, }>`
  position: absolute;
  z-index: 3;
  width: calc(100% - 1px);
  top: ${({ $fromTop }) => $fromTop}px;
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

const EventBigTitleP = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 16px; 
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

`;


const EventSmallTitleP = styled.p`
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  margin-left: 2px;
  font-size: 12px; 
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const EventHeader = styled.header<{$color: string}>`
  background-color: var(--primary-${({ $color }) => $color});
  width: 100%;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center; 
  color: white;
  font-size: 10px;
  box-sizing: border-box;
  font-weight: 500;
  padding: 8px;
`;

const EventTimeDiv = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  letter-spacing: 1px;
  margin-left: 8px;
  margin-top: 1px;
`;

const EventStartTimeDiv = styled.div`
  margin-right: 5px;
`;

const EventEndTimeDiv = styled.div`
  margin-left: 5px;
`;

const EventBodyDiv = styled.div<{$height : number}>`
  position: relative;
  height: ${({ $height }) => $height - 25}px;
  padding: 10px;
`;

const EventDescriptionP = styled.p`
  ${C.HIDE_SCROLL_BAR};
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 14px; 
  word-wrap: break-word;
  overflow-wrap: break-word;
  margin-top: 1px;
  line-height: 18px;
  white-space: pre-line;
`;

const EventIconDiv = styled(IconDiv)`
  position: absolute;
  z-index: -1;
  right: 5px;
  bottom: 5px;
`;


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
const TitleInput = styled.input.attrs({ placeholder: 'Title' })`
  font-size: 1.2rem;
  box-sizing: border-box;
  border: 1px solid gray;
  border-radius: 5px;
  padding: 10px;
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

const ItemDiv = styled(IconDiv)`
  border-radius: 20px;

  width: 49px;
  height: 49px;
  &:hover{
    background-color: lightgray;
    cursor: pointer;
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

const ModalCloseDiv = styled(IconDiv)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: inline-block;
  &:hover {
    cursor: pointer;
  }
`;


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
  SectionDayDiv,
  ContianerNumberDiv,
  DayNameP,
  DayNumberP,
  ContainerMain,
  ContainerCellsDiv,
  CellColumnDiv,
  CellDiv,
  EventBigTitleP,
  EventSmallTitleP,
  EventStartTimeDiv,
  EventEndTimeDiv,
  EventBodyDiv,
  EventIconDiv,
  ContainerModalDiv,
  ModalForm,
  Row1Div,
  Row2Div,
  Row3Div,
  Row4Div,
  Row5Div,
  ModalCloseDiv,
  IconColorDiv,
  IconColorImg,
  ContainerMenuDiv,
  MenuItemDiv,
  ItemDiv,
  MenuDiv,
  TimeContainerDiv,
  TimeP,
  DayInputDate,
  RecurringEventButton,
  ContainerDaySelectorDiv,
  DaySpan,
  EventInputCheckBox,
  IconDiv,
  TitleInput,
  ModalTextArea,
  DayLabel,
  EventDiv,
  EventDescriptionP,
  EventTimeDiv,
  EventHeader,
  HourLineDiv,
  TimeSelect,

  SaveButton,
  DeleteButton,
};