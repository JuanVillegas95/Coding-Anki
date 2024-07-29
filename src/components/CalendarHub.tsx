"use client"
import React, { useState, useEffect, useRef } from "react";
import { Event, Time, Calendar } from "@/utils/CalendarHub/classes";
import { toast } from 'react-toastify';
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

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const title: string = e.target.value;

    if (title.length === 0) {
      toast.error('Title cannot be empty.');
      return;
    }

    const updatedEvent: Event = { ...currentEvent, title };
    updateCurrentEvent(updatedEvent);
  };

  return (
    <S.ContainerDiv>
      <S.CalendarDiv>
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
        <Section mondayDate={mondayDate} />
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
      </S.CalendarDiv>
    </S.ContainerDiv>
  );
};



const Header: React.FC<{
  mondayDate: Date,
  name: string,
  changeCalendarName: (e: React.ChangeEvent<HTMLInputElement>,) => void,
  prevWeek: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
  nextWeek: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
}> = ({ name, changeCalendarName, prevWeek, nextWeek, mondayDate }) => {

  return (
    <S.ContainerHeader>
      <S.CalendarTitleInput value={name} onChange={changeCalendarName} />
      <Month mondayDate={mondayDate} prevWeek={prevWeek} nextWeek={nextWeek} />
    </S.ContainerHeader>
  );
};



const Month: React.FC<{
  mondayDate: Date,
  prevWeek: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
  nextWeek: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
}> = ({ prevWeek, nextWeek, mondayDate }) => {

  return (
    <S.MonthContainerDiv>
      <S.ClickIconDiv $color={"black"} $width={15} $svg_w={15} onClick={prevWeek}>
        <I.left />
      </S.ClickIconDiv>
      <S.MonthDiv>  
        {F.getMonth(mondayDate)}
      </S.MonthDiv>
      <S.ClickIconDiv $color={"black"} $width={15} $svg_w={15} onClick={nextWeek}>
        <I.right />
      </S.ClickIconDiv>
    </S.MonthContainerDiv>
  );
};

const Aside: React.FC<{ 
  asideRef: React.RefObject<HTMLDivElement>, 
  handleAsideScroll: () => void 
}> = ({ asideRef, handleAsideScroll }) => {

  return (
    <S.ContainerAside ref={asideRef} onScroll={handleAsideScroll}>
      {F.generate24HourIntervals().map((hour: string, i: number) => (
        <S.HourDiv key={i} $marginBottom={i === 0 ? 2 : 0} $isEven={i % 2 === 0} >
          {hour}
        </S.HourDiv>
      ))}
    </S.ContainerAside>
  );
};

const Section: React.FC<{ mondayDate: Date }> = ({ mondayDate }) => {

  return (
    <S.ContainerSection>
      {C.DAYS.map((day, i) => {
        const dayOfTheMonth: Date = F.addDateBy(mondayDate, i);
        const dayOfTheMonthNumber: string = dayOfTheMonth.getDate().toString();
        const isToday: boolean = F.areDatesTheSame(dayOfTheMonth,new Date());
        return <S.SectionDayDiv key={i}>
          <S.DayNameP>
            {day.slice(0,3)}
          </S.DayNameP>
          <S.ContianerNumberDiv $isToday={isToday}>
            <S.DayNumberP $isToday={isToday}>
              {dayOfTheMonthNumber}
            </S.DayNumberP>
          </S.ContianerNumberDiv>
        </S.SectionDayDiv>
      })}
    </S.ContainerSection>
  );
};

const Main: React.FC<{
  mondayDate: Date;
  currentEvent: Event;
  events: Map<string, Event>;
  mainRef: React.RefObject<HTMLDivElement>;
  handleMainScroll: () => void;
  closeModal: () => void;
  openModal: () => void;
  deleteCurrentEvent: () => void;
  addCurrentEventToCalendar: () => void;
  updateCurrentEvent: (newEvent: Event) => void;
}> = ({ 
  mainRef, handleMainScroll, currentEvent, 
  events, addCurrentEventToCalendar, deleteCurrentEvent, 
  mondayDate, openModal, closeModal, updateCurrentEvent 
}) => {

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
    <S.ContainerMain ref={mainRef} onScroll={handleMainScroll} onMouseMove={handleMouseMove} onMouseLeave={() => setIsMouseDown(false)}>
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
      <HourLine currentDate={currentDate} />
    </S.ContainerMain>
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
              ? "MEDIUM"
              : "LONG";
          const { id, height, color, title, } = event;
          return (
            <S.Event key={id} $fromTop={topOffset} $height={height} $color={color} onClick={() => handleOnClickEvent(event)}>
              {(eventType === "SHORT") && <S.EventTitle>{title}</S.EventTitle>}
              {(eventType === "MEDIUM" || eventType === "LONG") && <EventBody event={event} eventType={eventType} />}
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
        <S.EventIcon $color={"white"} $width={18} $svg_w={10}>
          <event.icon />
        </S.EventIcon>
        <S.EventTime>
          <S.StartTime> {startHours}:{startMinutes} </S.StartTime>
          <S.EventIcon $color={"white"} $width={20} $svg_w={10}>
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
  closeModal: () => void;
  deleteCurrentEvent: () => void;
  updateCurrentEvent: (newEvent: Event) => void;
  addCurrentEventToCalendar: () => void;
  addRecurringEventsToCalendar: () => void
  events: Map<string, Event>;
  isModalOpen: boolean;
  currentEvent: Event;

}> = ({ isModalOpen, closeModal, deleteCurrentEvent, currentEvent, updateCurrentEvent, addCurrentEventToCalendar, events, addRecurringEventsToCalendar }) => {
  const [isRecurringEvent, setIsRecurringEvent] = useState<boolean>(false);
  const [isIconMenu, setIsIconMenu] = useState<boolean>(false);
  const [isColorMenu, setIsColorMenu] = useState<boolean>(false);


  const toggleIconMenu = (): void => {
    if (isColorMenu) toggleColorMenu();
    setIsIconMenu(!isIconMenu)
  };
  const toggleColorMenu = (): void => {
    if (isIconMenu) toggleIconMenu();
    setIsColorMenu(!isColorMenu)
  };

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const title: string = e.target.value;

    if (title.length > 50) {
      toast.warning('Title cannot be more than 50 characters', {
        toastId: "titleID-50",
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const updatedEvent: Event = { ...currentEvent, title };
    updateCurrentEvent(updatedEvent);
  };

  const handleIcon = (icon: string): void => {
    const updatedEvent: Event = { ...currentEvent, icon };
    updateCurrentEvent(updatedEvent);
  };

  const handleColor = (value: string): void => {
    const color: any = C.COLORS_MAP.get(value);
    const colorImage: string = value;
    const updatedEvent: Event = { ...currentEvent, color, colorImage };
    updateCurrentEvent(updatedEvent);
  };


  const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const description: string = e.target.value;

    if (description.length > 200) {
      toast.warning('Description cannot be more than 200 characters', {
        toastId: "descriptionID-200",
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const updatedEvent: Event = { ...currentEvent, description };
    updateCurrentEvent(updatedEvent);
  };

  const handleDate = (e: React.ChangeEvent<HTMLInputElement>, tag: string) => {
    const endDate: Date = new Date(e.target.value);
    let updatedEvent: Event = { ...currentEvent };

    switch (tag) {
      case "StartHour":
        break;
      case "StartMinute":
        break;
      case "EndHour":
        break;
      case "EndMinute":
        break;
      default:
    }
    updateCurrentEvent(updatedEvent);
  }

  const handleSelectedDays = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    const isSelected: boolean = e.target.checked;
    let updatedEvent: Event = { ...currentEvent };
    updatedEvent.selectedDays[index] = isSelected;
    updateCurrentEvent(updatedEvent);
  }

  const handleRecurringEvent = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault();
    setIsRecurringEvent(!isRecurringEvent);
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
    //TODO check if collisions and check if the event fulfills the conditions
    if (currentEvent.recurringEventID != "") {
      addRecurringEventsToCalendar();
    } else {
      addCurrentEventToCalendar();
    }
    updateCurrentEvent(C.NULL_EVENT);
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
    const isColliding = F.isEventColliding(updatedEvent, events);
    if (isOverlapping || isColliding) {
      toast.error("Event is overlapping/colliding");
      return;
    }
    updateCurrentEvent(updatedEvent);
  };

  return (
    <S.ModalDiv $block={isModalOpen ? "block" : "none"}>
      <S.ModalForm onSubmit={handleSubmit} >

        <S.ModalCloseDiv $color={"black"} $width={15} $svg_w={15} onClick={closeModal}>
          <I.cross />
        </S.ModalCloseDiv>

        <S.FirstRowDiv>
          <S.TitleInput
            value={currentEvent.title}
            onChange={handleTitle}
          />

          <S.MenuDiv onClick={toggleIconMenu}>
            <S.IconDiv $color="black" $width={30} $svg_w={25}>
              <currentEvent.icon />
            </S.IconDiv>
            <S.SelectMenuDiv $block={isIconMenu ? "block" : "none"}>
              <S.ItemWrapperDiv>
                {C.ICONS_ARRAY.map((icon: string) => {
                  const Icon: string = icon;
                  return (
                    <S.ItemDiv $color={"black"} $width={50} $svg_w={20} onClick={() => handleIcon(Icon)}>
                      < Icon />
                    </S.ItemDiv>
                  )
                })}
              </S.ItemWrapperDiv>
            </S.SelectMenuDiv>
          </S.MenuDiv>

          <S.MenuDiv onClick={toggleColorMenu}>
            <S.IconColorWrapper>
              <S.IconColor src={currentEvent.colorImage.src} />
            </S.IconColorWrapper>
            <S.SelectMenuDiv $block={isColorMenu ? "block" : "none"}>
              <S.ItemWrapperDiv>
                {Array.from(C.COLORS_MAP.keys()).map((key: any) => {
                  return (
                    <S.ItemDiv $color={""} $width={50} $svg_w={0} onClick={() => handleColor(key)}>
                      <S.IconColor src={key.src} />
                    </S.ItemDiv>
                  )
                })}
              </S.ItemWrapperDiv>
            </S.SelectMenuDiv>
          </S.MenuDiv>
        </S.FirstRowDiv>

        <S.ModalTextArea
          value={currentEvent.description}
          onChange={handleDescription}
        />

        <S.InputTimeContainer>
          <TimeInput text={"Start"} time={currentEvent.start} handleTime={handleTime} />
          <TimeInput text={"End"} time={currentEvent.end} handleTime={handleTime} />
          <S.RecurringEventButton onClick={handleRecurringEvent}> Recurring </ S.RecurringEventButton>
        </S.InputTimeContainer>

        {isRecurringEvent && <S.DayPickerWrapper>
          <DateInput text={"Start"} date={currentEvent.startDate} handleDate={handleDate} />
          <DateInput text={"End"} date={currentEvent.startDate} handleDate={handleDate} />
          <S.ButtonsContainer>
            {C.DAYS.map((day: string, index: number) => (
              <S.DayLabel key={index}>
                <S.DayText>{day.charAt(0)}</S.DayText>
                <S.EventDayChecks
                  checked={currentEvent.selectedDays[index]}
                  onChange={(e) => handleSelectedDays(e, index)}
                  disabled={F.shouldBeLocked(currentEvent.startDate, index)}
                />
              </S.DayLabel>
            ))}
          </S.ButtonsContainer>
        </S.DayPickerWrapper>
        }

        <S.EventButtons>
          <S.SaveButton>Save</S.SaveButton>
          <S.DeleteButton onClick={handleDeleteEvent}>Delete</S.DeleteButton>
        </S.EventButtons>

      </S.ModalForm>
    </S.ModalDiv>
  );
};

const TimeInput: React.FC<{
  handleTime: (e: React.ChangeEvent<HTMLSelectElement>, tag: string) => void
  text: string,
  time: Time,

}> = ({ text, time, handleTime }) => {

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

const DateInput: React.FC<{
  text: string,
  date: Date,
  handleDate: (e: React.ChangeEvent<HTMLInputElement>, tag: string) => void
}> = ({ text, date, handleDate }) => {

  const dateTag: string = `${text}Date`
  return (
    <S.DayInputWrapperDiv>
      <S.TimeText>{text}</S.TimeText>
      <S.DayPicker value={F.formatDate(date)} onChange={(e) => handleDate(e, dateTag)} />
    </S.DayInputWrapperDiv>
  );
};




export default CalendarHub;
