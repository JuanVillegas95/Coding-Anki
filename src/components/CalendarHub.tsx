import React, { useState, useEffect, useRef } from "react";
import { Event, Time, Calendar } from "@/utils/CalendarHub/classes";
import * as C from "@/utils/CalendarHub/constants";
import * as F from "@/utils/CalendarHub/functions";
import * as I from "@/utils/CalendarHub/icons"
import * as S from "@/styles/CalendarHub.styles";



const CalendarHub: React.FC = () => {
  const [calendars, setCalendars] = useState<Map<string, Calendar>>(C.NULL_CALENDARS);
  const calendar = useRef<Calendar>(C.NULL_CALENDAR);
  const event = useRef<Event>(C.NULL_EVENT);
  const mainRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLDivElement>(null);
  const [mondayDate, setMondayDate] = useState<Date>(F.getMostRecentMonday());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    // TODO Validate user....
    calendar.current = new Calendar();

    setCalendars(new Map([[calendar.current.id, calendar.current]]))
  }, [])

  const closeModal = () => setIsModalOpen(false);

  const openModal = () => setIsModalOpen(true);

  const nextWeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();
    setMondayDate(F.addDateBy(mondayDate, 7))
  };
  const prevWeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();
    setMondayDate(F.addDateBy(mondayDate, -7))
  };



  const addEvent = (): void => {
    calendar.current.events.set(event.current.id, event.current)
    setCalendars((prevCalendars) => {
      const updatedCalendars = new Map(prevCalendars);
      updatedCalendars.set(calendar.current.id, { ...calendar.current });
      return updatedCalendars;
    });
  };

  const deleteEvent = (): void => {
    calendar.current.events.delete(event.current.id)
    setCalendars((prevCalendars) => {
      const updatedCalendars = new Map(prevCalendars);
      updatedCalendars.set(calendar.current.id, { ...calendar.current });
      return updatedCalendars;
    });
    event.current = C.NULL_EVENT;
  };

  const changeCalendarName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newTitle: string = e.target.value;
    if (newTitle.length > 18) return;
    calendar.current.name = newTitle;
    setCalendars((prevCalendars) => {
      const updatedCalendars = new Map(prevCalendars);
      updatedCalendars.set(calendar.current.id, { ...calendar.current });
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

  return (
    <S.GridContainer>
      <Header
        name={calendar.current.name}
        changeCalendarName={changeCalendarName}
        mondayDate={mondayDate}
        nextWeek={nextWeek}
        prevWeek={prevWeek}
      />
      <Aside
        asideRef={asideRef}
        handleAsideScroll={handleAsideScroll}
      />
      <SubHeader mondayDate={mondayDate} />
      <Main
        mondayDate={mondayDate}
        mainRef={mainRef}
        handleMainScroll={handleMainScroll}
        event={event}
        events={calendars.get(calendar.current.id)!.events}
        addEvent={addEvent}
        deleteEvent={deleteEvent}
        closeModal={closeModal}
        openModal={openModal}
      />
      <EventModal 
      isModalOpen={isModalOpen} 
      closeModal={closeModal}
      openModal={openModal}
      deleteEvent={deleteEvent}
      event={event}
      />
    </S.GridContainer>
  );
};




const Header: React.FC<{
  mondayDate: Date,
  name: string,
  changeCalendarName: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void,
  prevWeek: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
  nextWeek: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
}> = ({ name, changeCalendarName, prevWeek, nextWeek, mondayDate }) => {

  return (
    <S.Header>
      <S.HEADER_Container>
        <S.HEADER_Title value={name} onChange={changeCalendarName} />
        <S.HeaderItem>
          <S.MonthWrapper>
            <S.HeaderMonth>
            {F.getMonth(mondayDate)}
            </S.HeaderMonth>
            <S.HeaderIconLeft $color={"black"} $width={15} $height={15} onClick={prevWeek}>
              <I.left />
            </S.HeaderIconLeft>
            <S.HeaderIconRight $color={"black"} $width={15} $height={15} onClick={nextWeek}>
              <I.right />
            </S.HeaderIconRight>
          </S.MonthWrapper>
        </S.HeaderItem>
      </S.HEADER_Container>
    </S.Header>
  );
};



const Aside: React.FC<{ asideRef: React.RefObject<HTMLDivElement>, handleAsideScroll: () => void }> = ({ asideRef, handleAsideScroll }) => {
  return (
    <S.Aside ref={asideRef} onScroll={handleAsideScroll}>
      {F.generate24HourIntervals().map((hour: string, i: number) => (
        <S.A_Hour key={i} $marginBottom={i === 0 ? 2 : 0} $isEven={i % 2 === 0} >{hour}
        </S.A_Hour>
      ))}
    </S.Aside>
  );
};




const SubHeader: React.FC<{ mondayDate: Date }> = ({ mondayDate }) => {
  return (
    <S.SubHeader>
      {C.DAYS.map((day, i) => {
        const dayOfTheMonth = F.addDateBy(mondayDate, i).getDate();
        return <S.S_Day key={i}>
          {day}
          <br />
          {dayOfTheMonth}
        </S.S_Day>
      })}
    </S.SubHeader>
  );
};




const Main: React.FC<{
  mondayDate: Date;
  mainRef: React.RefObject<HTMLDivElement>;
  handleMainScroll: () => void;
  event: React.MutableRefObject<Event>;
  events: Map<string, Event>;
  addEvent: () => void;
  deleteEvent: () => void;
  openModal: () => void;
  closeModal: () => void;
}> = ({ mainRef, handleMainScroll, event, events, addEvent, deleteEvent, mondayDate, openModal, closeModal }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

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
    newEvent.duration = F.calculateEventDuration(newEvent);
    newEvent.id = event.current.id;

    const newEventValid: boolean = F.isNewEventValid(newEvent, events);
    if (!newEventValid) return;

    event.current.duration = newEvent.duration;
    event.current.height = newEvent.height;
    event.current.end = newEvent.end;
    event.current.topOffset = F.calculateTopOffset(newEvent.start)

    addEvent();
  };


  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();
    setIsMouseDown(false);
    const newEventValid: boolean = F.isNewEventValid(event.current, events);
    if (!newEventValid) {
      deleteEvent()
      return;
    };
    openModal();
  };

  return (
    <S.Main ref={mainRef} onScroll={handleMainScroll}>
      <S.M_Cells onMouseMove={handleMouseMove} onMouseLeave={() => setIsMouseDown(false)}>
        {F.range(7).map((i) => {
          const dayDate: Date = F.addDateBy(mondayDate, i);
          const filteredEvents = Array.from(events.values()).filter((event) =>
            F.areDatesTheSame(event.date, dayDate)
          );

          return (
            <S.M_DayColumn
              key={i}
              onMouseDown={(e) => handleMouseDown(e, dayDate)}
              onMouseUp={handleMouseUp}
            >
              {F.range(48).map((j) => <S.M_Cell key={j} />)}
              <Events events={filteredEvents} />

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
      {
        events.map((event) => {
          const totalMinutes: number = F.timeToMinutes(event.duration);
          const eventType: string = totalMinutes < 30
            ? "SHORT"
            : totalMinutes >= 30 && totalMinutes < 60
              ? "MEDUIM"
              : "LONG";

          const { id, topOffset, height, color, title, } = event;
          return (
            <S.Event key={id} $fromTop={topOffset} $height={height} $color={color} >
              {(eventType === "SHORT") && <S.EventTitle>{title}</S.EventTitle>}
              {(eventType === "MEDUIM" || eventType === "LONG") && <EventBody event={event} eventType={eventType} />}
            </S.Event>
          )
        })}
    </div>
  );
};




const EventBody: React.FC<{ event: Event, eventType: string }> = ({ event, eventType }) => {
  const { start, end, color, title, description } = event;
  const startHours: string = F.formatTime(start.hours);
  const startMinutes: string = F.formatTime(start.minutes);
  const endHours: string = F.formatTime(end.hours);
  const endMinutes: string = F.formatTime(end.minutes);

  return (
    <>
      <S.EventHeader $color={color}>
        <S.EventIcon $color={"white"} $width={12} $height={12}>
          <event.icon />
        </S.EventIcon>
        <S.EventTime>
          <S.StartTime> {startHours}:{startMinutes} </S.StartTime>
          <S.EventIcon $color={"white"} $width={12} $height={12}>
            <I.right_arrow />
          </S.EventIcon>
          <S.EndTime> {endHours}:{endMinutes}</S.EndTime>
        </S.EventTime>
      </S.EventHeader>
      <S.EventBody>
        <S.EventTitle>{title}</S.EventTitle>
        {eventType === "LONG" && <S.EventDescription>{description}</S.EventDescription>}
      </S.EventBody>
    </>
  );
};




const HourLine: React.FC<{ currentDate: Date }> = ({ currentDate }) => {
  const time: Time = new Time(currentDate.getHours(), currentDate.getMinutes())
  return (
    <S.H_HourLine $fromTop={F.calculateTopOffset(time)}>
      <S.H_LineAfterHour />
    </S.H_HourLine>
  )
}




const EventModal: React.FC<{
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  deleteEvent: () => void;
  event: React.MutableRefObject<Event>;

}> = ({ isModalOpen, closeModal, deleteEvent, event }) => {
  // const [modalEvent, modalEvent] = useState<Event>(event.current); 

  const handleDeleteEvent = (): void => {
    deleteEvent();
    closeModal();
    event.current = C.NULL_EVENT;
  }

  const handleCloseModal = (): void => {
    closeModal();
    event.current = C.NULL_EVENT;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    closeModal();
    event.current = C.NULL_EVENT;
  }

  const titleChange = (): void => {
    // Title change logic here
  };

  return (
    <S.ModalDiv $block={isModalOpen ? "block" : "none"}>
      <S.ContentDiv>
        <S.CrossContainer $width={15} $height={15} $color={"black"} onClick={handleCloseModal}>
          <I.cross />
        </S.CrossContainer>
        <S.ModalContent>
          <S.EventSettings onSubmit={handleSubmit}>
            <S.InputTitle onChange={titleChange} />
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
            <S.DeleteButton onClick={handleDeleteEvent}>Delete</S.DeleteButton>
          </S.EventSettings>
        </S.ModalContent>
      </S.ContentDiv>
    </S.ModalDiv>
  );
};


export default CalendarHub;
