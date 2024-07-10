import React, { useState, useEffect, useRef } from "react";
import * as C from "@/utils/CalendarHub/constants";
import * as F from "@/utils/CalendarHub/functions";
import * as S from "@/styles/CalendarHub.styles";
import { Event, Time, Calendar } from "@/utils/CalendarHub/classes";
import Modal from "./Modal";

// WEEKLY CALENDAR COMPONENT
const CalendarHub: React.FC = () => {
  const [calendars, setCalendars] = useState<Map<string, Calendar>>(C.NULL_CALENDARS);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const calendar = useRef<Calendar>(C.NULL_CALENDAR);
  const event = useRef<Event>(C.NULL_EVENT);
  const mainRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLDivElement>(null);

  useEffect(()=> {
    // TODO Validate user....
    calendar.current = new Calendar();
    setCalendars(new Map([[calendar.current.id, calendar.current]]))
  },[])

  const getCurrentEvents = (): Map<string, Event> => {
    return calendars.get(calendar.current.id)!.events;
  }

  const addCurrEventToCurrCalendar = (): void => {
    calendar.current.events.set(event.current.id,event.current)
    setCalendars((prevCalendars) => {
      const updatedCalendars = new Map(prevCalendars);
      updatedCalendars.set(calendar.current.id, calendar.current);
      return updatedCalendars;
    });
  };

  const deleteCurrEventTOCurrCalendar = (): void => {
    calendar.current.events.delete(event.current.id)
    setCalendars((prevCalendars) => {
      const updatedCalendars = new Map(prevCalendars);
      updatedCalendars.set(calendar.current.id, calendar.current);
      return updatedCalendars;
    });
  };

  const handleAsideScroll = (): void => {
    if (asideRef.current && mainRef.current) {
      mainRef.current.scrollTop = asideRef.current.scrollTop;
    }
  };

  const handleMainScroll = (): void => {
    if (asideRef.current && mainRef.current) {
      const sidebarMaxScrollTop = asideRef.current.scrollHeight - asideRef.current.clientHeight;
      if (mainRef.current.scrollTop > sidebarMaxScrollTop) {
        mainRef.current.scrollTop = sidebarMaxScrollTop;
      }
      asideRef.current.scrollTop = mainRef.current.scrollTop;
    }
  };

  const handleTitleChange = (e:any): void => {
    const newTitle = e.target.value;
    calendar.current = new Calendar(calendar.current.id,newTitle,getCurrentEvents());
  }
  
  return (
    <S.GridContainer>
      <Header name={calendar.current.name} handleTitleChange={handleTitleChange}/>
      <Aside 
        asideRef={asideRef} 
        handleAsideScroll={handleAsideScroll}
        />
      <SubHeader />
      <Main
        mainRef={mainRef}
        handleMainScroll={handleMainScroll}
        event={event}
        events={getCurrentEvents()}
        addCurrEventToCurrCalendar={addCurrEventToCurrCalendar}
        deleteCurrEventTOCurrCalendar={deleteCurrEventTOCurrCalendar}
        setIsMouseDown={setIsMouseDown}
        isMouseDown={isMouseDown}
      />
      {/* <EventModal handleModalClose={handleModalClose} isModalOpen={isModalOpen} /> */}
    </S.GridContainer>
  );
};

const Header: React.FC<{ name: string, handleTitleChange: (e:any) => void}> = ({ name, handleTitleChange }) => {
  return (
    <S.Header>
      <S.HEADER_Title value={name} onChange={handleTitleChange}/>
    </S.Header>
  );
};

const Aside: React.FC<{ asideRef: React.RefObject<HTMLDivElement>, handleAsideScroll: () => void}> = ({ asideRef, handleAsideScroll }) => {
  return (
    <S.Aside ref={asideRef} onScroll={handleAsideScroll}>
      {F.generate24HourIntervals().map((hour: string, i: number) => (
        <S.A_Hour key={i} $marginBottom={i === 0 ? 2.5 : 0}  >{hour}</S.A_Hour>
      ))}
    </S.Aside>
  );
};

const SubHeader: React.FC = () => {
  return (
    <S.SubHeader>
      {C.DAYS.map((day, i) => (
        <S.S_Day key={i}>{day}</S.S_Day>
      ))}
    </S.SubHeader>
  );
};

const Main: React.FC<{
  mainRef: React.RefObject<HTMLDivElement>;
  handleMainScroll: () => void;
  event: React.MutableRefObject<Event>;
  events: Map<string, Event>;
  setIsMouseDown: React.Dispatch<React.SetStateAction<boolean>>;
  isMouseDown: boolean;
  addCurrEventToCurrCalendar: () => void;
  deleteCurrEventTOCurrCalendar: () => void;
}> = ({ mainRef, handleMainScroll, event, events, setIsMouseDown, isMouseDown, addCurrEventToCurrCalendar, deleteCurrEventTOCurrCalendar }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);


    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, date: Date): void => {
    e.preventDefault();
    if (e.button !== C.LEFT_MOUSE_CLICK) return;

    setIsMouseDown(true);

    const newEventStart: Time = F.calculateEventStart(e);
    const eventOverlapping = F.isEventOverlapping(events, date, newEventStart);
    if (eventOverlapping) return;
    event.current = new Event(date, newEventStart);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();
  
    if (!isMouseDown) return;
  
    const newEvent: Event = new Event(event.current.date, event.current.start);
    newEvent.height = F.calculateEventHeight(e, newEvent);
    newEvent.end = F.calculateEventEnd(newEvent);
    newEvent.id = event.current.id;
  
    const newEventValid: boolean = F.isNewEventValid(newEvent, events);
  
    if (!newEventValid) return;
  
    event.current.height = newEvent.height;
    event.current.end = newEvent.end;
  
    addCurrEventToCurrCalendar();
  };
  

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();
    setIsMouseDown(false);

    const newEventValid: boolean = F.isNewEventValid(event.current, events);

    if (!newEventValid) deleteCurrEventTOCurrCalendar();
    

    event.current = C.NULL_EVENT;
  };

  return (
    <S.Main ref={mainRef} onScroll={handleMainScroll}>
      <S.M_Cells onMouseMove={handleMouseMove} onMouseLeave={() => setIsMouseDown(false)}>
        {C.DAYS.map((day, i) => {
          const currentTime: Time = new Time(currentDate.getHours(), currentDate.getMinutes());
          const mondayDate = F.getMostRecentMonday();
          const dayDate: Date = F.addDateBy(mondayDate, i);
          const isToday = F.areDatesTheSame(dayDate, currentDate);
          const filteredEvents = Array.from(events.values()).filter((event) =>
            F.areDatesTheSame(event.date, dayDate)
          );

          return (
            <S.M_DayColumn
              key={i}
              onMouseDown={(e) => handleMouseDown(e, dayDate)}
              onMouseUp={handleMouseUp}
            >
              {Array.from({ length: 48 }, (_, j) => (
                <S.M_Cell key={j} />
              ))}

              <Events events={filteredEvents} />

              {isToday && <S.M_HourLineDot $fromTop={F.calculateTopOffset(currentTime)} />}
            </S.M_DayColumn>
          );
        })}
      </S.M_Cells>
      <HourLine currentDate={currentDate} />
    </S.Main>
  );
};

const Events: React.FC<{ events: Event[] }> = ({ events }) => {
  return (
    <div>
      {events.map(({ id, height, start, end, color, title, description }) => {
        const formatTime = (unit: number): string => (unit < 10 ? `0${unit}` : `${unit}`);
        const startHours: string = formatTime(start.hours);
        const startMinutes: string = formatTime(start.minutes);
        const endHours: string = formatTime(end.hours);
        const endMinutes: string = formatTime(end.minutes);

        return (
          <S.E_Event
            key={id}
            $height={height}
            $fromTop={F.calculateTopOffset(start)}
            $color={color}
          >
            {startHours}:{startMinutes}
            <span>-</span>
            {endHours}:{endMinutes} <br />
            <strong>{title}</strong> <br />
            {description}
          </S.E_Event>
        );
      })}
    </div>
  );
};

const HourLine: React.FC<{ currentDate: Date }> = ({ currentDate }) => (
  <S.H_HourLine $fromTop={F.calculateTopOffset(new Time(currentDate.getHours(), currentDate.getMinutes()))}>
    {currentDate.getHours()}:{currentDate.getMinutes()}
    <S.H_LineAfterHour />
  </S.H_HourLine>
);

const EventModal: React.FC<{
  isModalOpen: boolean;
  handleModalClose: () => void;
}> = ({ isModalOpen, handleModalClose }) => {
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    handleModalClose();
  };

  return (
    <Modal show={isModalOpen} handleClose={handleModalClose}>
      <S.ModalContent>
        <S.EventSettings onSubmit={handleSubmit}>
          <S.InputTitle />
          <S.InputDescription />
          <S.SelectColor>
            {C.COLORS.map((color: string, i: number) => (
              <option key={i} value={color}>{color}</option>
            ))}
          </S.SelectColor>
          <S.InputTimeContainer>
            <S.TimeInput />
            <S.TimeInput />
          </S.InputTimeContainer>
          <S.ButtonsContainer>
            {C.DAYS.map((day, i) => (
              <S.DayLabel key={i}>
                <S.EventDayChecks />
                <S.DayText>{day.charAt(0)}</S.DayText>
              </S.DayLabel>
            ))}
          </S.ButtonsContainer>
          <S.SaveButton>Save</S.SaveButton>
          <S.DeleteButton>Delete</S.DeleteButton>
        </S.EventSettings>
      </S.ModalContent>
    </Modal>
  );
};

export default CalendarHub;
