"use client"
import React, { useState, useEffect, useRef } from "react";
import { Event, Time, Calendar } from "@/utils/CalendarHub/classes";
import { v4 as uuidv4 } from 'uuid';
import * as C from "@/utils/CalendarHub/constants";
import * as F from "@/utils/CalendarHub/functions";
import * as I from "@/utils/CalendarHub/icons"
import * as S from "@/styles/CalendarHub.styles";



const CalendarHub: React.FC = () => {
  const [calendars, setCalendars] = useState<Map<string, Calendar>>(C.NULL_CALENDARS);
  const [mondayDate, setMondayDate] = useState<Date>(F.getMostRecentMonday());
  const [currentEvent, setCurrentEvent] = useState<Event>(C.NULL_EVENT);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const calendar = useRef<Calendar>(C.NULL_CALENDAR);
  const asideRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // TODO Validate user....
    calendar.current = new Calendar();

    setCalendars(new Map([[calendar.current.id, calendar.current]]))
  }, [])

  const updateCurrentEvent = (newEvent: Event): void => setCurrentEvent(newEvent);

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

  const addCurrentEventToCalendar = (): void => {
    calendar.current.events.set(currentEvent.id, currentEvent);
    setCalendars((prevCalendars) => {
      const updatedCalendars = new Map(prevCalendars);
      updatedCalendars.set(calendar.current.id, { ...calendar.current });
      return updatedCalendars;
    });
  };


  const addRecurringEventsToCalendar = (): void => {
    let { startDate, endDate, selectedDays } = currentEvent;
    while (startDate < endDate) {
      startDate = F.addDateBy(startDate, 1);
      const dayOfWeek: number = F.getDay(startDate)
      if (!selectedDays[dayOfWeek]) continue;

      const newEvent: Event = { ...currentEvent, id: uuidv4(), startDate: startDate };
      calendar.current.events.set(newEvent.id, newEvent);
      let recurringEventIDs = calendar.current.recurringEventIDs.get(newEvent.recurringEventID);

      if (recurringEventIDs === undefined) {
        recurringEventIDs = Array(7).fill(null).map(() => []);
        calendar.current.recurringEventIDs.set(newEvent.recurringEventID, recurringEventIDs);
      }

      recurringEventIDs[dayOfWeek].push(newEvent.id);
      calendar.current.recurringEventIDs.set(newEvent.recurringEventID, recurringEventIDs);
    }

    setCalendars((prevCalendars) => {
      const updatedCalendars = new Map(prevCalendars);
      updatedCalendars.set(calendar.current.id, { ...calendar.current });
      return updatedCalendars;
    });
  };

  const deleteRecurringEventsToCalendar = (recurringEventID: string): void => {
    calendar.current.events.get(currentEvent.id)
    setCalendars((prevCalendars) => {
      const updatedCalendars = new Map(prevCalendars);
      updatedCalendars.set(calendar.current.id, { ...calendar.current });
      return updatedCalendars;
    });
  };


  const deleteCurrentEvent = (): void => {
    calendar.current.events.delete(currentEvent.id)
    setCalendars((prevCalendars) => {
      const updatedCalendars = new Map(prevCalendars);
      updatedCalendars.set(calendar.current.id, { ...calendar.current });
      return updatedCalendars;
    });
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
    <S.Container>
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
          currentEvent={currentEvent}
          updateCurrentEvent={updateCurrentEvent}
          events={calendars.get(calendar.current.id)!.events}
          addCurrentEventToCalendar={addCurrentEventToCalendar}
          deleteCurrentEvent={deleteCurrentEvent}
          closeModal={closeModal}
          openModal={openModal}
        />
        <EventModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          deleteCurrentEvent={deleteCurrentEvent}
          updateCurrentEvent={updateCurrentEvent}
          currentEvent={currentEvent}
          events={calendars.get(calendar.current.id)!.events}
          addCurrentEventToCalendar={addCurrentEventToCalendar}
          addRecurringEventsToCalendar={addRecurringEventsToCalendar}
        />
      </S.GridContainer>
    </S.Container>
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
  currentEvent: Event;
  events: Map<string, Event>;
  addCurrentEventToCalendar: () => void;
  deleteCurrentEvent: () => void;
  openModal: () => void;
  closeModal: () => void;
  updateCurrentEvent: (newEvent: Event) => void;
}> = ({ mainRef, handleMainScroll, currentEvent, events, addCurrentEventToCalendar, deleteCurrentEvent, mondayDate, openModal, closeModal, updateCurrentEvent }) => {
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
    const newEvent = new Event(date, newEventStart);
    updateCurrentEvent(newEvent);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();

    if (!isMouseDown) return;

    const newEvent: Event = new Event(currentEvent.startDate, currentEvent.start);
    newEvent.height = F.calculateEventHeight(e, newEvent);
    newEvent.end = F.calculateEventEnd(newEvent);
    newEvent.duration = F.calculateEventDuration(newEvent);
    newEvent.id = currentEvent.id;
    newEvent.selectedDays[F.getDay(newEvent.startDate)] = true;

    if (!F.isNewEventValid(newEvent, events)) return;
    updateCurrentEvent(newEvent);
    addCurrentEventToCalendar();
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();
    setIsMouseDown(false);

    if (!F.isNewEventValid(currentEvent, events)) {
      deleteCurrentEvent();
      return;
    };
    openModal();
  };

  const handleOnClickEvent = (event: Event) => {
    updateCurrentEvent(event);
    openModal();
  }

  return (
    <S.Main ref={mainRef} onScroll={handleMainScroll}>
      <S.M_Cells onMouseMove={handleMouseMove} onMouseLeave={() => setIsMouseDown(false)}>
        {F.range(7).map((i) => {
          const dayDate: Date = F.addDateBy(mondayDate, i);
          const filteredEvents = Array.from(events.values()).filter((event) =>
            F.areDatesTheSame(event.startDate, dayDate)
          );

          return (
            <S.M_DayColumn
              key={i}
              onMouseDown={(e) => handleMouseDown(e, dayDate)}
              onMouseUp={handleMouseUp}
            >
              {F.range(48).map((j) => <S.M_Cell key={j} />)}
              <Events events={filteredEvents} handleOnClickEvent={handleOnClickEvent} />

            </S.M_DayColumn>
          );
        })}
      </S.M_Cells>
      <HourLine currentDate={currentDate} />
    </S.Main>
  );
};




const Events: React.FC<{ events: Event[], handleOnClickEvent: (event: Event) => void }> = ({ events, handleOnClickEvent }) => {
  return (
    <div>
      {
        events.map((event: Event) => {
          const totalMinutes: number = F.timeToMinutes(event.duration);
          const topOffset: number = F.calculateTopOffset(event.start);
          const eventType: string = totalMinutes < 30
            ? "SHORT"
            : totalMinutes >= 30 && totalMinutes < 60
              ? "MEDUIM"
              : "LONG";
          const { id, height, color, title, } = event;
          return (
            <S.Event key={id} $fromTop={topOffset} $height={height} $color={color} onClick={() => handleOnClickEvent(event)}>
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
        <S.EventIcon $color={"white"} $width={18} $height={18}>
          <event.icon />
        </S.EventIcon>
        <S.EventTime>
          <S.StartTime> {startHours}:{startMinutes} </S.StartTime>
          <S.EventIcon $color={"white"} $width={20} $height={20}>
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
  closeModal: () => void;
  deleteCurrentEvent: () => void;
  addCurrentEventToCalendar: () => void;
  currentEvent: Event;
  updateCurrentEvent: (newEvent: Event) => void;
  addRecurringEventsToCalendar: () => void
  events: Map<string, Event>;
}> = ({ isModalOpen, closeModal, deleteCurrentEvent, currentEvent, updateCurrentEvent, addCurrentEventToCalendar, events, addRecurringEventsToCalendar }) => {
  const [isRecurringEvent, setIsRecurringEvent] = useState<boolean>(false);


  const handleDateStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate: Date = new Date(e.target.value);
    const updatedEvent: Event = { ...currentEvent, startDate };
    updateCurrentEvent(updatedEvent);
  }

  const handleDateEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const endDate: Date = new Date(e.target.value);
    const updatedEvent: Event = { ...currentEvent, endDate };
    updateCurrentEvent(updatedEvent);
  }

  const handleSelectedDays = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    const isSelected: boolean = e.target.checked;
    let updatedEvent: Event = { ...currentEvent };
    updatedEvent.selectedDays[index] = isSelected;
    updateCurrentEvent(updatedEvent);
  }

  const handleRecurringEvent = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const isRecurringEvent: boolean = e.target.checked
    setIsRecurringEvent(isRecurringEvent);
    let updatedEvent: Event
    if (isRecurringEvent) {
      const recurringEventID: string = uuidv4();
      updatedEvent = { ...currentEvent, recurringEventID };
    } else {
      updatedEvent = { ...currentEvent, recurringEventID: "" };
    }
    updateCurrentEvent(updatedEvent);
  };

  const handleDeleteEvent = (): void => {
    deleteCurrentEvent();
    closeModal();
    updateCurrentEvent(C.NULL_EVENT);
  };

  const handleCloseModal = (): void => {
    closeModal();
    updateCurrentEvent(C.NULL_EVENT);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    closeModal();
    //TODO check if collisions and check if the event fulifulls the condtions
    if (currentEvent.recurringEventID != "") {
      addRecurringEventsToCalendar();
    } else {
      addCurrentEventToCalendar();
    }
    updateCurrentEvent(C.NULL_EVENT);
  };

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const title: string = e.target.value;

    if (title.length === 0) {
      alert('Title cannot be empty.');
      return;
    }

    const updatedEvent: Event = { ...currentEvent, title };
    updateCurrentEvent(updatedEvent);
  };

  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const description: string = e.target.value;
    const updatedEvent: Event = { ...currentEvent, description };
    updateCurrentEvent(updatedEvent);
  };

  const handleColor = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const color: string = e.target.value;
    console.log(color)
    const updatedEvent: Event = { ...currentEvent, color };
    updateCurrentEvent(updatedEvent);
  };

  const handleIcon = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const key: string = e.target.value;
    const icon: string | undefined = C.ICONS.get(key);
    if (!icon) return;
    const updatedEvent: Event = { ...currentEvent, icon };
    updateCurrentEvent(updatedEvent);
  };


  const handleTime = (e: React.ChangeEvent<HTMLSelectElement>, tag: string): void => {
    const value: string = e.target.value;
    let updatedEvent: Event = { ...currentEvent };

    switch (tag) {
      case "StartHour":
        updatedEvent.start = { ...updatedEvent.start, hours: parseInt(value) };
        break;
      case "StartMinute":
        updatedEvent.start = { ...updatedEvent.start, minutes: parseInt(value) };
        break;
      case "EndHour":
        updatedEvent.end = { ...updatedEvent.end, hours: parseInt(value) };
        break;
      case "EndMinute":
        updatedEvent.end = { ...updatedEvent.end, minutes: parseInt(value) };
        break;
      default:
        break;
    }

    const isOverlapping = F.isEventOverlapping(events, updatedEvent.startDate, updatedEvent.start);
    const isCollading = F.isEventColliding(updatedEvent, events);
    if (isOverlapping || isCollading) {
      alert("Event is overlapping/colliding");
      return;
    }
    updateCurrentEvent(updatedEvent);
  };


  return (
    <S.ModalDiv $block={isModalOpen ? "block" : "none"}>
      <S.ContentDiv>
        <S.CrossContainer $width={15} $height={15} $color={"black"} onClick={handleCloseModal}>
          <I.cross />
        </S.CrossContainer>
        <S.ModalContent>
          <S.EventSettings onSubmit={handleSubmit}>

            <S.InputTitle
              value={currentEvent.title}
              onChange={handleTitle}
            />

            <S.InputDescription
              value={currentEvent.description}
              onChange={handleDescription}
            />

            <S.SelectIcon
              //TODO CHECK THE VALUE OF ICON STRING value={currentEvent.icon || ''}
              onChange={handleIcon}
            >
              {Array.from(C.ICONS.keys()).map((key: string, i: number) => {
                return <option key={i} value={key}>{key}</option>
              })}
            </S.SelectIcon>

            <S.SelectColor value={currentEvent.color} onChange={handleColor}>
              {C.COLORS.map((color: string, i: number) => (
                <option key={i} value={color}>{color}</option>
              ))}
            </S.SelectColor>


            <S.InputTimeContainer>
              <TimeInput text={"Start"} time={currentEvent.start} handleTime={handleTime} />
              <TimeInput text={"End"} time={currentEvent.end} handleTime={handleTime} />
            </S.InputTimeContainer>

            <S.RecurringEventWrapper>
              <h4>Is this a recurring event</h4>
              <S.RecurringEvent checked={isRecurringEvent} onChange={handleRecurringEvent} />
              {isRecurringEvent && <S.DayPickerWrapper>
                Start
                <S.DayPicker value={F.formatDate(currentEvent.startDate)} onChange={handleDateStart} />
                End
                <S.DayPicker value={F.formatDate(currentEvent.endDate)} onChange={handleDateEnd} />
                <S.ButtonsContainer>
                  {C.DAYS.map((day: string, index: number) => (

                    <S.DayLabel key={index}>
                      <S.EventDayChecks
                        checked={currentEvent.selectedDays[index]}
                        onChange={(e) => handleSelectedDays(e, index)}
                        disabled={F.shouldBeLocked(currentEvent.startDate, index)}
                      />
                      <S.DayText>{day.charAt(0)}</S.DayText>
                    </S.DayLabel>
                  ))}
                </S.ButtonsContainer>
              </S.DayPickerWrapper>
              }
            </S.RecurringEventWrapper>

            <S.SaveButton>Save</S.SaveButton>

            <S.DeleteButton onClick={handleDeleteEvent}>Delete</S.DeleteButton>
          </S.EventSettings>
        </S.ModalContent>
      </S.ContentDiv>
    </S.ModalDiv>
  );
};

const TimeInput: React.FC<{ text: string, time: Time, handleTime: (e: React.ChangeEvent<HTMLSelectElement>, tag: string) => void }> = ({ text, time, handleTime }) => {
  const hours: string[] = F.generate24Hours();
  const minutes: string[] = F.generate60Minutes();
  const hourTag: string = `${text}Hour`
  const minuteTag: string = `${text}Minute`
  return (
    <S.TimeInput>
      <S.TimeText>
        {text}
      </S.TimeText>
      <S.TimeHour value={F.formatTime(time.hours)} onChange={(e) => handleTime(e, hourTag)}>
        {hours.map((hour: string, index: number) => (
          <option key={index} value={hour}>
            {hour}
          </option>
        ))}
      </S.TimeHour>
      <S.TimeMinutes value={F.formatTime(time.minutes)} onChange={(e) => handleTime(e, minuteTag)}>
        {minutes.map((minute: string, index: number) => (
          <option key={index} value={minute}>
            {minute}
          </option>
        ))}
      </S.TimeMinutes>
    </S.TimeInput>
  );
};


export default CalendarHub;
