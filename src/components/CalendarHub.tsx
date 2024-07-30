"use client"
import React, { useState, useEffect, useRef } from "react";
import { Event, Time, Calendar } from "@/utils/CalendarHub/classes";
import { StaticImageData } from "next/image";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
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
        const isToday: boolean = F.areDatesTheSame(dayOfTheMonth, new Date());
        return <S.SectionDayDiv key={i}>
          <S.DayNameP>
            {day.slice(0, 3)}
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
  openModal: () => void;
  deleteCurrentEvent: () => void;
  addCurrentEventToCalendar: () => void;
  updateCurrentEvent: (newEvent: Event) => void;
}> = ({
  mainRef, handleMainScroll, currentEvent,
  events, addCurrentEventToCalendar, deleteCurrentEvent,
  mondayDate, openModal, updateCurrentEvent
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

      const newEventStart: Time = F.calculateEventTime(e);
      const eventOverlapping = F.isEventOverlapping(events, date, newEventStart);
      if (eventOverlapping) return;
      const newEvent = new Event(date, newEventStart);
      updateCurrentEvent(newEvent);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      e.preventDefault();

      if (!isMouseDown) return;

      const newEvent: Event = new Event(currentEvent.startDate, currentEvent.start);
      newEvent.end = F.calculateEventTime(e);
      newEvent.height = F.calculateEventHeight(newEvent);
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
      <S.ContainerMain ref={mainRef} onScroll={handleMainScroll}>
        <S.ContainerCellsDiv onMouseMove={handleMouseMove} onMouseLeave={() => setIsMouseDown(false)}>
          {F.range(7).map((i) => {
            const dayDate: Date = F.addDateBy(mondayDate, i);
            const filteredEvents = Array.from(events.values()).filter((event) =>
              F.areDatesTheSame(event.startDate, dayDate)
            );
            return (
              <S.CellColumnDiv
                key={i}
                onMouseDown={(e) => handleMouseDown(e, dayDate)}
                onMouseUp={handleMouseUp}
              >
                {F.range(48).map((j) => <S.CellDiv key={j} />)}
                <Events events={filteredEvents} handleOnClickEvent={handleOnClickEvent} />
              </S.CellColumnDiv>
            );
          })}
        </S.ContainerCellsDiv>
        <S.HourLineDiv $fromTop={F.calculateTopOffset(new Time(currentDate.getHours(), currentDate.getMinutes()))} />
      </S.ContainerMain>
    );
  };

const Events: React.FC<{
  events: Event[],
  handleOnClickEvent: (event: Event) => void
}> = ({ events, handleOnClickEvent }) => {

  return (
    <>
      {
        events.map((event: Event) => {
          const totalMinutes: number = F.timeToMinutes(event.duration);
          const topOffset: number = F.calculateTopOffset(event.start);
          const eventType: string = (totalMinutes < 30) ? "SHORT"
            : (totalMinutes >= 30 && totalMinutes < 60)
              ? "MEDIUM"
              : "LONG";
          const { id, height, color, title, } = event;
          return (
            <S.EventDiv key={id} $fromTop={topOffset} $height={height} $color={color} onClick={() => handleOnClickEvent(event)}>
              {(eventType === "SHORT") && <S.EventSmallTitleP>{title}</S.EventSmallTitleP>}
              {(eventType === "MEDIUM" || eventType === "LONG") && <EventBody event={event} eventType={eventType} />}
            </S.EventDiv>
          )
        })}
    </>
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
        <S.IconDiv $color={"white"} $width={13} $svg_w={13}>
          <event.icon />
        </S.IconDiv>
        <S.EventTimeDiv>
          <S.EventStartTimeDiv> {startHours}:{startMinutes} </S.EventStartTimeDiv>
          <S.IconDiv $color={"white"} $width={14} $svg_w={14}>
            <I.right_arrow />
          </S.IconDiv>
          <S.EventEndTimeDiv> {endHours}:{endMinutes}</S.EventEndTimeDiv>
        </S.EventTimeDiv>
      </S.EventHeader>
      <S.EventBodyDiv $height={event.height}>
        <S.EventBigTitleP>{title}</S.EventBigTitleP>
        {eventType === "LONG" && <S.EventDescriptionP>{description}</S.EventDescriptionP>}
        {eventType === "LONG" && <S.EventIconDiv $color={C.TERTIARY_COLORS[event.color]} $width={50} $svg_w={50}>
          <event.icon />
        </S.EventIconDiv>}
      </S.EventBodyDiv>
    </>
  );
};

const EventModal: React.FC<{
  events: Map<string, Event>;
  isModalOpen: boolean;
  currentEvent: Event;
  closeModal: () => void;
  deleteCurrentEvent: () => void;
  updateCurrentEvent: (newEvent: Event) => void;
  addCurrentEventToCalendar: () => void;
  addRecurringEventsToCalendar: () => void
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

  const handleIcon = (icon: React.ComponentType): void => {
    const updatedEvent: Event = { ...currentEvent, icon };
    updateCurrentEvent(updatedEvent);
  };

  const handleColor = (value: StaticImageData): void => {
    const color: any = C.COLORS_MAP.get(value);
    const colorImage: StaticImageData = value;
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

  const handleDeleteEvent = (e: any): void => {
    e.preventDefault();
    deleteCurrentEvent();
    closeModal();
    updateCurrentEvent(C.NULL_EVENT);
  };

  const handleCloseModal = (): void => {
    setIsColorMenu(false);
    setIsIconMenu(false);
    setIsRecurringEvent(false);
    closeModal();
    updateCurrentEvent(C.NULL_EVENT);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (currentEvent.title.length === 0) {
      toast.warning('Title cannot be empty', {
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
    
    if (currentEvent.description.length === 0) {
      toast.warning('Description cannot be empty', {
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
    const parsedValue = parseInt(value, 10); 
    let updatedEvent: Event = { ...currentEvent };
    const duration: Time = F.calculateEventDuration(updatedEvent);
  
    if (tag === "StartHour") {
      updatedEvent.start.hours = parsedValue;
      updatedEvent.end.hours = (parsedValue + duration.hours) % 24;
    } else if (tag === "StartMinute") {
      updatedEvent.start.minutes = parsedValue;
    } else if (tag === "EndHour") {
      updatedEvent.end.hours = parsedValue;
    } else if (tag === "EndMinute") {
      updatedEvent.end.minutes = parsedValue;
    }
    
    // Recalculate the duration and check for minimum event duration
    updatedEvent.duration = F.calculateEventDuration(updatedEvent);
    const totalMinutes: number = F.timeToMinutes(updatedEvent.duration);
    if (totalMinutes < 15) {
      toast.error("Event duration cannot be less than 15 minutes.");
      return;
    }
  
    // Check for event collision
    const isColliding: boolean = F.isEventColliding(updatedEvent, events);
    if (isColliding) {
      toast.error("Event is overlapping/colliding.");
      return;
    }
  
    // Update the event height for visual representation, if applicable
    updatedEvent.height = F.calculateEventHeight(updatedEvent);
  
    // Finally update the current event
    updateCurrentEvent(updatedEvent);
  };
  
  return (
    <S.ContainerModalDiv $block={isModalOpen ? "block" : "none"}>
      <S.ModalForm onSubmit={handleSubmit} >

        <S.ModalCloseDiv $color={"black"} $width={15} $svg_w={15} onClick={handleCloseModal}>
          <I.cross />
        </S.ModalCloseDiv>

        <S.Row1Div>
          <S.TitleInput
            value={currentEvent.title}
            onChange={handleTitle}
          />
          <IconMenu
            toggleIconMenu={toggleIconMenu}
            isIconMenu={isIconMenu}
            handleIcon={handleIcon}
            currentEvent={currentEvent}
          />
          <ColorMenu
            toggleColorMenu={toggleColorMenu}
            isColorMenu={isColorMenu}
            handleColor={handleColor}
            colorImage={currentEvent.colorImage}
          />
        </S.Row1Div>

        <S.Row2Div>
          <S.ModalTextArea
            value={currentEvent.description}
            onChange={handleDescription}
          />
        </S.Row2Div>

        <S.Row3Div>
          <TimeInput 
            text={"Start"} 
            time={currentEvent.start} 
            handleTime={handleTime} 
          />
          <TimeInput 
            text={"End"} 
            time={currentEvent.end} 
            handleTime={handleTime} 
          />
          <S.RecurringEventButton onClick={handleRecurringEvent}> 
            Recurring 
          </ S.RecurringEventButton>
        </S.Row3Div>

        {isRecurringEvent && <S.Row4Div>
          <DateInput 
            text={"Start"} 
            date={currentEvent.startDate} 
            handleDate={handleDate} 
          />
          <DateInput 
            text={"End"} 
            date={F.addDateBy(currentEvent.startDate, 1)} 
            handleDate={handleDate} 
          />
          <S.ContainerDaySelectorDiv>
            <DaySelector 
              selectedDays={currentEvent.selectedDays} 
              startDate={currentEvent.startDate} 
              handleSelectedDays={handleSelectedDays}
            />
          </S.ContainerDaySelectorDiv>
        </S.Row4Div>
        }

        <S.Row5Div>
          <S.SaveButton>Save</S.SaveButton>
          <S.DeleteButton onClick={(e) => handleDeleteEvent(e)}>Delete</S.DeleteButton>
        </S.Row5Div>

      </S.ModalForm>
    </S.ContainerModalDiv>
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
    <S.TimeContainerDiv>
      <S.TimeP> {text} </S.TimeP>
      <S.TimeSelect value={F.formatTime(time.hours)} onChange={(e) => handleTime(e, hourTag)}>
        {hours.map((hour: string, index: number) => (
          <option key={index} value={hour}>
            {hour}
          </option>
        ))}
      </S.TimeSelect>
      <S.TimeSelect value={F.formatTime(time.minutes)} onChange={(e) => handleTime(e, minuteTag)}>
        {minutes.map((minute: string, index: number) => (
          <option key={index} value={minute}>
            {minute}
          </option>
        ))}
      </S.TimeSelect>
    </S.TimeContainerDiv>
  );
};

const DateInput: React.FC<{
  text: string,
  date: Date,
  handleDate: (e: React.ChangeEvent<HTMLInputElement>, tag: string) => void
}> = ({ text, date, handleDate }) => {

  const dateTag: string = `${text}Date`
  return (
    <S.TimeContainerDiv>
      <S.TimeP>{text}</S.TimeP>
      <S.DayInputDate value={F.formatDate(date)} onChange={(e) => handleDate(e, dateTag)} />
    </S.TimeContainerDiv>
  );
};

const ColorMenu: React.FC<{
  toggleColorMenu: () => void,
  isColorMenu: boolean,
  handleColor: (key: any) => void,
  colorImage: StaticImageData
}> = ({ toggleColorMenu, isColorMenu, handleColor, colorImage }) => {
  return (
    <S.MenuDiv onClick={toggleColorMenu}>
      <S.IconColorDiv>
        <S.IconColorImg src={colorImage.src} />
      </S.IconColorDiv>
      <S.ContainerMenuDiv $block={isColorMenu ? "block" : "none"}>
        <S.MenuItemDiv>
          {Array.from(C.COLORS_MAP.keys()).map((key: any, i: number) => {
            return (
              <S.ItemDiv $color="" $width={50} $svg_w={0} onClick={() => handleColor(key)}>
                <S.IconColorImg key={i} src={key.src} />
              </S.ItemDiv>
            );
          })}
        </S.MenuItemDiv>
      </S.ContainerMenuDiv>
    </S.MenuDiv>
  );
};

const IconMenu: React.FC<{
  isIconMenu: boolean,
  currentEvent: Event,
  toggleIconMenu: () => void,
  handleIcon: (icon: React.ComponentType) => void,
}> = ({ toggleIconMenu, isIconMenu, handleIcon, currentEvent }) => {
  return (
    <S.MenuDiv onClick={toggleIconMenu}>
      <S.IconDiv $color="black" $width={30} $svg_w={25}>
        <currentEvent.icon />
      </S.IconDiv>
      <S.ContainerMenuDiv $block={isIconMenu ? "block" : "none"}>
        <S.MenuItemDiv>
          {C.ICONS_ARRAY.map((icon: string, i: number) => {
            const Icon = icon as unknown as React.ComponentType;
            return (
              <S.ItemDiv key={i} $color="black" $width={50} $svg_w={20} onClick={() => handleIcon(Icon)}>
                <Icon />
              </S.ItemDiv>
            );
          })}
        </S.MenuItemDiv>
      </S.ContainerMenuDiv>
    </S.MenuDiv>
  );
};

const DaySelector: React.FC<{
  selectedDays: boolean[];
  startDate: Date;
  handleSelectedDays: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
}> = ({ startDate, handleSelectedDays, selectedDays }) => {
  
  return (
    <>
      {C.DAYS.map((day: string, index: number) => (
        <S.DayLabel key={index}>
          <S.DaySpan>{day.charAt(0)}</S.DaySpan>
          <S.EventInputCheckBox
            checked={selectedDays[index]}
            onChange={(e) => handleSelectedDays(e, index)}
            disabled={F.shouldBeLocked(startDate, index)}
          />
        </S.DayLabel>
      ))}
    </>
  );
};

export default CalendarHub;
