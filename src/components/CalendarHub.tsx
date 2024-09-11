'use client';
import React, { useState, useEffect, useRef } from 'react';
import { throttle } from 'lodash';
import { Event, Time, Friend, Calendar } from '@/utils/CalendarHub/classes';
import { v4 as uuidv4 } from 'uuid';
import * as C from '@/utils/CalendarHub/constants';
import * as F from '@/utils/CalendarHub/functions';
import * as I from '@/utils/CalendarHub/icons';
import * as S from '@/styles/CalendarHub.styles';

const CalendarHub: React.FC = () => {
  const [calendars, setCalendars] = useState<Map<string, Calendar>>(C.NULL_CALENDARS);
  const [mondayDate, setMondayDate] = useState<Date>(F.getMostRecentMonday());
  const calendar = useRef<Calendar>(C.NULL_CALENDAR);
  const asideRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // Effect for intializing calendar
  useEffect(() => {
    // TODO Validate user....
    calendar.current = new Calendar();

    setCalendars(new Map([[calendar.current.id, calendar.current]]));
  }, []);

  // Effect to synchronize scrolling between aside and main component
  useEffect(() => {
    const syncScroll = (): void => {
      if (asideRef.current && mainRef.current) {
        const maxScrollTop = asideRef.current.scrollHeight - asideRef.current.clientHeight;
        const scrollTop = mainRef.current.scrollTop;

        if (scrollTop > maxScrollTop) {
          mainRef.current.scrollTop = maxScrollTop;
        }

        asideRef.current.scrollTop = mainRef.current.scrollTop;
      }
    };

    asideRef.current?.addEventListener('scroll', syncScroll);
    mainRef.current?.addEventListener('scroll', syncScroll);

    return () => {
      asideRef.current?.removeEventListener('scroll', syncScroll);
      mainRef.current?.removeEventListener('scroll', syncScroll);
    };
  }, []);


  const weekHandeler: {
    nextWeek: () => void;
    previousWeek: () => void;
    currentWeek: () => void;
  } = {
    nextWeek: (): void => setMondayDate(F.addDateBy(mondayDate, 7)),
    previousWeek: (): void => setMondayDate(F.addDateBy(mondayDate, -7)),
    currentWeek: (): void => setMondayDate(F.getMostRecentMonday()),
  };

  const calendarHandler: {
    setEvent: (event: Event) => void,
    deleteEvent: (event: Event) => void,
    getEvents: () => Map<string, Event>,
  } = {
    setEvent: (event: Event): void => {
      calendar.current.events.set(event.id, event);
      setCalendars((prevCalendars) => {
        const updatedCalendars = new Map(prevCalendars);
        updatedCalendars.set(calendar.current.id, { ...calendar.current });
        return updatedCalendars;
      });
    },

    deleteEvent: (event: Event): void => {
      calendar.current.events.delete(event.id);
      setCalendars((prevCalendars) => {
        const updatedCalendars = new Map(prevCalendars);
        updatedCalendars.set(calendar.current.id, { ...calendar.current });
        return updatedCalendars;
      });
    },

    getEvents: (): Map<string, Event> => calendars.get(calendar.current.id)!.events,
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

  return <S.ContainerDiv>
    <S.CalendarDiv>
      <Header
        mondayDate={mondayDate}
        name={calendar.current.name}
        changeCalendarName={changeCalendarName}
        weekHandeler={weekHandeler}
      />
      <Aside asideRef={asideRef} />
      <Section mondayDate={mondayDate} />
      <Main
        mondayDate={mondayDate}
        events={calendarHandler.getEvents()}
        calendarHandler={calendarHandler}
        mainRef={mainRef}
      />
    </S.CalendarDiv>
    <FriendList />
  </S.ContainerDiv>
};

const Header: React.FC<{
  mondayDate: Date,
  name: string,
  changeCalendarName: (e: React.ChangeEvent<HTMLInputElement>) => void,
  weekHandeler: {
    nextWeek: () => void;
    previousWeek: () => void;
    currentWeek: () => void;
  };
}> = ({ name, changeCalendarName, weekHandeler, mondayDate }) => {
  const [isCalendarName, setIsCalendarName] = useState<boolean>(false);
  const toggleCalendarNameMenu = () => setIsCalendarName(!isCalendarName);

  return <S.ContainerHeader>
    <S.CalendarNameDiv>
      <S.DropdownButton
        $size={30}
        $svgSize={15}
        $color={"black"}
        $isClicked={isCalendarName}
        onClick={toggleCalendarNameMenu}
      >
        <I.dropdown />
      </S.DropdownButton>
      <S.CalendarNameInput value={name} onChange={changeCalendarName} />
      {
        (isCalendarName) && (
          <S.CalendarNameUl>
            {
              Array.from(C.USER.calendars.values()).map((calendar: Calendar, index: number) => {
                return (
                  <S.CalendarNameLi key={index} $isVisible={!isCalendarName} $delay={(index + 1) * 0.30}>
                    {calendar.name}
                  </S.CalendarNameLi>
                )
              })
            }
          </S.CalendarNameUl>
        )
      }
    </S.CalendarNameDiv>
    <S.ChangeWeekDiv>
      <S.MonthP>
        {F.getMonth(mondayDate)}
      </S.MonthP>
      <S.ChangeWeekButton
        $color={'black'}
        $size={30}
        $svgSize={15}
        onClick={weekHandeler.previousWeek}
      >
        <I.left />
      </S.ChangeWeekButton>
      <S.TodayButton onClick={weekHandeler.currentWeek}>
        Today
      </S.TodayButton>
      <S.ChangeWeekButton $color={'black'} $size={30} $svgSize={15} onClick={weekHandeler.nextWeek}>
        <I.right />
      </S.ChangeWeekButton>
    </S.ChangeWeekDiv>
  </S.ContainerHeader>
};

const Aside: React.FC<{
  asideRef: React.RefObject<HTMLDivElement>,
}> = ({ asideRef }) => {

  return <S.ContainerAside ref={asideRef}>
    {F.generate24HourIntervals().map((hour: string, i: number) => (
      <S.HourDiv key={i} $marginBottom={i === 0 ? 2 : 0} $isEven={i % 2 === 0} >
        {hour}
      </S.HourDiv>
    ))}
  </S.ContainerAside>
};

const Section: React.FC<{ mondayDate: Date }> = ({ mondayDate }) => {
  return <S.ContainerSection>
    {
      C.DAYS.map((day, i) => {
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
      })
    }
  </S.ContainerSection>
};

const Main: React.FC<{
  mondayDate: Date;
  events: Map<string, Event>;
  mainRef: React.RefObject<HTMLDivElement>;
  calendarHandler: {
    setEvent: (event: Event) => void;
    deleteEvent: (event: Event) => void;
    getEvents: () => Map<string, Event>;
  };
}> = ({
  mainRef,
  events,
  mondayDate,
  calendarHandler,
}) => {
    const columnDivRef = useRef<HTMLDivElement>(null);
    const [currentEvent, setCurrentEvent] = useState<Event>(C.NULL_EVENT);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isEventCreating, setIsEventCreating] = useState<boolean>(false);
    const [isEventDragging, setIsEventDragging] = useState<boolean>(false);
    const [isEventResizingTop, setIsEventResizingTop] = useState<boolean>(false);
    const [isEventResizingBottom, setIsEventResizingBottom] = useState<boolean>(false);

    // Declare animationFrame in the component scope
    let animationFrame: number | null = null;

    // Update the 'HourLineDiv' every minute
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentDate(new Date());
      }, 60000);

      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      console.log("-------------------------------");
      console.log(isEventCreating, "isEventCreating");
      console.log(isEventDragging, "isEventDragging");
      console.log(isEventResizingBottom, "isEventResizingBottom");
      console.log("-------------------------------");
    }, [isEventCreating, isEventDragging, isEventResizingBottom]);

    const closeModal = (): void => setIsModalOpen(false);
    const openModal = (): void => setIsModalOpen(true);

    const EventCreateHandeler = {
      mouseDown: (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        date: Date
      ): void => {
        e.preventDefault();
        if (e.button !== C.LEFT_MOUSE_CLICK) return;

        const newEventStart: Time = F.calculateEventTime(e, columnDivRef);
        const eventOverlapping = F.isEventOverlapping(events, date, newEventStart);
        if (eventOverlapping) return;
        setIsEventCreating(true);
        const newEvent = new Event(date, newEventStart);
        setCurrentEvent(newEvent);
      },

      mouseMove: (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        e.preventDefault();
        if (e.button !== C.LEFT_MOUSE_CLICK || !isEventCreating) return;
        const newEvent: Event = new Event(currentEvent.startDate, currentEvent.start);
        newEvent.end = F.calculateEventTime(e, columnDivRef);
        newEvent.height = F.calculateEventHeight(newEvent);
        newEvent.duration = F.calculateEventDuration(newEvent);
        newEvent.id = currentEvent.id;
        newEvent.selectedDays[F.getDay(newEvent.startDate)] = true;
        if (!F.isNewEventValid(newEvent, events)) return;
        calendarHandler.setEvent(newEvent);
      },
    };

    const EventDragHandeler = {
      mouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, event: Event): void => {
        e.preventDefault();
        e.stopPropagation();
        if (e.button !== C.LEFT_MOUSE_CLICK) return;
        setIsEventDragging(true);
        setCurrentEvent(event);
      },

      mouseMove: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        if (e.button !== C.LEFT_MOUSE_CLICK || !isEventDragging) return;
        const [newStart, newEnd] = F.calculateTimeOnDrag(e, columnDivRef, currentEvent);

        const updatedEvent: Event = {
          ...currentEvent,
          start: newStart,
          end: newEnd,
        };
        if (!F.isNewEventValid(updatedEvent, events)) return;

        setCurrentEvent((prevEvent) => ({
          ...prevEvent,
          start: newStart,
          end: newEnd,
        }));
        calendarHandler.setEvent(updatedEvent);
      },

      mouseLeave: (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        if (!isEventDragging) return;

        const currentEventDayOfTheWeek: number = F.getDay(currentEvent.startDate);

        const relatedTarget = e.relatedTarget as HTMLElement;
        const parentElement = relatedTarget?.parentElement;
        const dataKey = parentElement?.getAttribute("data-key");

        const currentDayOfTheWeek: number | undefined = dataKey ? parseInt(dataKey, 10) : undefined;

        if (currentDayOfTheWeek !== undefined && !isNaN(currentDayOfTheWeek)) {
          let newStartDate: Date = currentEvent.startDate;

          if (currentDayOfTheWeek > currentEventDayOfTheWeek) {
            newStartDate = F.addDateBy(currentEvent.startDate, 1);
          } else if (currentDayOfTheWeek < currentEventDayOfTheWeek) {
            newStartDate = F.addDateBy(currentEvent.startDate, -1);
          }

          const updatedEvent: Event = {
            ...currentEvent,
            startDate: newStartDate,
          };

          if (!F.isNewEventValid(updatedEvent, events)) return;

          setCurrentEvent((prevEvent) => ({
            ...prevEvent,
            startDate: newStartDate,
          }));
          calendarHandler.setEvent(updatedEvent);
        }
      },
    };

    const EventResizeBottomHandeler = {
      mouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, event: Event): void => {
        e.preventDefault();
        e.stopPropagation();
        if (e.button !== C.LEFT_MOUSE_CLICK) return;
        setIsEventResizingBottom(true);
        setCurrentEvent(event);
      },

      mouseMove: throttle((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (animationFrame) cancelAnimationFrame(animationFrame);

        animationFrame = requestAnimationFrame(() => {
          e.preventDefault();
          if (e.button !== C.LEFT_MOUSE_CLICK || !isEventResizingBottom) return;
          const newEnd: Time = F.calculateEventTime(e, columnDivRef);
          // const newEnd: Time = F.calculateEndTimeOnResize(e, columnDivRef, currentEvent);
          const newEvent: Event = { ...currentEvent, end: newEnd };

          const updatedEvent: Event = {
            ...currentEvent,
            end: newEnd,
            height: F.calculateEventHeight(newEvent),
            duration: F.calculateEventDuration(newEvent),
          };
          if (!F.isNewEventValid(updatedEvent, events)) return;

          setCurrentEvent((prevEvent) => ({
            ...prevEvent,
            end: newEnd,
            height: F.calculateEventHeight(newEvent),
            duration: F.calculateEventDuration(newEvent),
          }));
          calendarHandler.setEvent(updatedEvent);
        });
      }, 16), // Throttle to 60fps
    };

    const stopEventAction = (): void => {
      setIsEventCreating(false);
      setIsEventDragging(false);
      setIsEventResizingBottom(false);
      setIsEventResizingTop(false);
    };

    return (
      <S.ContainerMain ref={mainRef} onMouseLeave={stopEventAction} onMouseUp={stopEventAction}>
        {F.range(7).map((i) => {
          const day: Date = F.addDateBy(mondayDate, i);
          const filteredEvents: Event[] = F.getSameDateEvents(events, day);

          return (
            <S.CellColumnDiv
              ref={columnDivRef}
              data-key={i}
              key={i}
              onMouseDown={(e) => EventCreateHandeler.mouseDown(e, day)}
              onMouseMove={
                (e) => {
                  EventCreateHandeler.mouseMove(e)
                  EventResizeBottomHandeler.mouseMove(e)
                }
              }
            >
              {F.range(48).map((j) => (
                <S.CellDiv key={j} />
              ))}
              {filteredEvents.map((event: Event) => {
                const { id, height, start, end, duration, color, icon, title, description } = event;

                const totalMinutes: number = F.timeToMinutes(duration);
                const topOffset: number = F.calculateTopOffset(start);
                const startHours: string = F.formatTime(start.hours);
                const startMinutes: string = F.formatTime(start.minutes);
                const endHours: string = F.formatTime(end.hours);
                const endMinutes: string = F.formatTime(end.minutes);
                const isShortEvent: boolean = totalMinutes < C.SHORT_DURATION_THRESHOLD;

                return (
                  <S.EventDiv
                    key={id}
                    $fromTop={topOffset}
                    $height={height}
                    $color={color}
                    $isDragged={isEventDragging}
                  >
                    <S.EventTopDiv $color={isShortEvent ? "transparent" : color} />
                    <S.EventBodyDiv
                      onMouseDown={(e) => EventDragHandeler.mouseDown(e, event)}
                      onMouseMove={(e) => EventDragHandeler.mouseMove(e)}
                      onMouseLeave={(e) => EventDragHandeler.mouseLeave(e)}
                    >
                      {isShortEvent ? (
                        <ShortEvent title={title} />
                      ) : (
                        <LongEvent
                          color={color}
                          startHours={startHours}
                          startMinutes={startMinutes}
                          endHours={endHours}
                          endMinutes={endMinutes}
                          icon={icon}
                          title={title}
                          description={description}
                        />
                      )}
                    </S.EventBodyDiv>
                    <S.EventBottomDiv
                      onMouseDown={(e) => EventResizeBottomHandeler.mouseDown(e, event)}
                      onMouseMove={(e) => EventResizeBottomHandeler.mouseMove(e)}
                    />
                  </S.EventDiv>
                );
              })}
            </S.CellColumnDiv>
          );
        })}
        <S.HourLineDiv
          $fromTop={F.calculateTopOffset(new Time(currentDate.getHours(), currentDate.getMinutes()))}
        />
        <EventModal
          events={calendarHandler.getEvents()}
          calendarHandler={calendarHandler}
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          currentEvent={currentEvent}
        />
      </S.ContainerMain>
    );
  };



const ShortEvent: React.FC<{
  title: string;
}> = ({ title }) => {
  return <S.ContainerShortEventDiv>
    <S.ShortEventTitleP>
      {title}
    </S.ShortEventTitleP>
  </S.ContainerShortEventDiv>
};

const LongEvent: React.FC<{
  color: string
  startHours: string;
  startMinutes: string;
  endHours: string;
  endMinutes: string;
  icon: React.ComponentType;
  title: string;
  description: string;
}> = ({ color, startHours, startMinutes, endHours, endMinutes, icon, title, description }) => {
  return <S.ContainerLongEventDiv>
    <S.LongEventHeader $color={color}>
      <S.LongEventIconDiv $color={'white'} $size={13} $svgSize={13}>
        {React.createElement(icon)}
      </S.LongEventIconDiv>
      <S.LongEventTimeDiv>
        <S.LongEventStartDiv>
          {startHours}:{startMinutes}
        </S.LongEventStartDiv>
        <S.LongEventArrowDiv
          $color={'white'}
          $size={14}
          $svgSize={14}
        >
          <I.rightArrow />
        </S.LongEventArrowDiv>
        <S.LongEventEndDiv>
          {endHours}:{endMinutes}
        </S.LongEventEndDiv>
      </S.LongEventTimeDiv>
    </S.LongEventHeader>
    <S.LongEventBodyDiv >
      <S.LongEventTitleP>
        {title}
      </S.LongEventTitleP>
      <S.LongEventDescriptionP>
        {description}
      </S.LongEventDescriptionP>
      <S.LongEventIconBodyDiv
        $color={C.TERTIARY_COLORS[color]}
        $size={40}
        $svgSize={40}>
        {React.createElement(icon)}
      </S.LongEventIconBodyDiv>
    </S.LongEventBodyDiv>
  </S.ContainerLongEventDiv>
};

const EventModal: React.FC<{
  events: Map<string, Event>;
  isModalOpen: boolean;
  currentEvent: Event;
  closeModal: () => void;
  calendarHandler: {
    setEvent: (event: Event) => void;
    deleteEvent: (event: Event) => void;
    getEvents: () => Map<string, Event>;
  };
}> = ({ isModalOpen, closeModal, currentEvent, events, calendarHandler }) => {
  const [isRecurringEvent, setIsRecurringEvent] = useState<boolean>(false);
  const [isIconMenu, setIsIconMenu] = useState<boolean>(false);
  const [isColorMenu, setIsColorMenu] = useState<boolean>(false);

  //_SNIPPET
  // Effect for handle keyboard events for the modal.
  useEffect(() => {
    const handleKeyboardEvent = (e: KeyboardEvent) => {
      if (C.ESCAPE_KEYS.includes(e.key) && isModalOpen) closeModal();
      else if (C.ENTER_KEY === e.key) {
        if (currentEvent.recurringEventID != '') {
        } else {
          // calendarEventHandler.setCurrentEventToCalendar();
        }
      }
    }

    window.addEventListener("keydown", handleKeyboardEvent);
    return () => window.removeEventListener("keydown", handleKeyboardEvent);
  }, [isModalOpen])


  const toggleIconMenu = (): void => {
    if (isColorMenu) toggleColorMenu();
    setIsIconMenu(!isIconMenu);
  };
  const toggleColorMenu = (): void => {
    if (isIconMenu) toggleIconMenu();
    setIsColorMenu(!isColorMenu);
  };

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const title: string = e.target.value;

    const updatedEvent: Event = { ...currentEvent, title };
    // calendarEventHandler.setCurrentEvent(updatedEvent);
  };

  const handleIcon = (icon: React.ComponentType): void => {
    let updatedEvent: Event = { ...currentEvent, icon };
    const color: string | undefined = C.COLORS_MAP.get(icon);
    if (color) {
      updatedEvent = { ...currentEvent, color, colorIcon: icon };
    }
    // calendarEventHandler.setCurrentEvent(updatedEvent);
  };

  const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const description: string = e.target.value;

    const updatedEvent: Event = { ...currentEvent, description };
    // calendarEventHandler.setCurrentEvent(updatedEvent);
  };

  const handleDate = (e: React.ChangeEvent<HTMLInputElement>, tag: string) => {
    const endDate: Date = new Date(e.target.value);
    const updatedEvent: Event = { ...currentEvent };

    switch (tag) {
      case 'StartHour':
        break;
      case 'StartMinute':
        break;
      case 'EndHour':
        break;
      case 'EndMinute':
        break;
      default:
    }
    // calendarEventHandler.setCurrentEvent(updatedEvent);
  };

  const handleSelectedDays = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    const isSelected: boolean = e.target.checked;
    const updatedEvent: Event = { ...currentEvent };
    updatedEvent.selectedDays[index] = isSelected;
    // calendarEventHandler.setCurrentEvent(updatedEvent);
  };

  const handleRecurringEvent = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault();

    setIsRecurringEvent(!isRecurringEvent);
    let updatedEvent: Event;
    if (isRecurringEvent) {
      const recurringEventID: string = uuidv4();
      updatedEvent = { ...currentEvent, recurringEventID };
    } else {
      updatedEvent = { ...currentEvent, recurringEventID: '' };
    }

    // calendarEventHandler.setCurrentEvent(updatedEvent);
  };

  const handleDeleteEvent = (e: any): void => {
    e.preventDefault();
    // calendarEventHandler.deleteCurrentEvent();
    closeModal();
  };

  const handleCloseModal = (): void => {
    setIsColorMenu(false);
    setIsIconMenu(false);
    setIsRecurringEvent(false);
    closeModal();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    closeModal();
    //TODO check if collisions and check if the event fulfills the conditions
    if (currentEvent.recurringEventID != '') {
    } else {
      // calendarEventHandler.setCurrentEventToCalendar();
    }
  };

  const handleTime = (e: React.ChangeEvent<HTMLSelectElement>, tag: string): void => {
    const value: string = e.target.value;
    const parsedValue = parseInt(value, 10);
    const updatedEvent: Event = { ...currentEvent };
    const duration: Time = F.calculateEventDuration(updatedEvent);

    if (tag === 'StartHour') {
      updatedEvent.start.hours = parsedValue;
      updatedEvent.end.hours = (parsedValue + duration.hours) % 24;
    } else if (tag === 'StartMinute') {
      updatedEvent.start.minutes = parsedValue;
    } else if (tag === 'EndHour') {
      updatedEvent.end.hours = parsedValue;
    } else if (tag === 'EndMinute') {
      updatedEvent.end.minutes = parsedValue;
    }

    // Recalculate the duration and check for minimum event duration
    updatedEvent.duration = F.calculateEventDuration(updatedEvent);
    const totalMinutes: number = F.timeToMinutes(updatedEvent.duration);


    // Check for event collision
    const isColliding: boolean = F.isEventColliding(updatedEvent, events);


    // Update the event height for visual representation, if applicable
    updatedEvent.height = F.calculateEventHeight(updatedEvent);

    // Finally update the current event
    // calendarEventHandler.setCurrentEvent(updatedEvent);
  };


  return (
    <S.ContainerModalDiv $block={isModalOpen ? 'block' : 'none'}>
      <S.ModalForm onSubmit={handleSubmit} >

        <S.ModalCloseButton $color={'black'} $size={30} $svgSize={15} onClick={handleCloseModal}>
          <I.cross />
        </S.ModalCloseButton>

        <S.Row1Div>
          <S.TitleInput
            value={currentEvent.title}
            onChange={handleTitle}
          />
          <IconMenu
            toggleIconMenu={toggleIconMenu}
            isIconMenu={isIconMenu}
            handleIcon={handleIcon}
            currentEventIcon={currentEvent.icon}
            iconArray={C.ICONS_ARRAY}
          />
          <IconMenu
            toggleIconMenu={toggleColorMenu}
            isIconMenu={isColorMenu}
            handleIcon={handleIcon}
            currentEventIcon={currentEvent.colorIcon}
            iconArray={Array.from(C.COLORS_MAP.keys())}
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
            text={'Start'}
            time={currentEvent.start}
            handleTime={handleTime}
          />
          <TimeInput
            text={'End'}
            time={currentEvent.end}
            handleTime={handleTime}
          />
          <S.RecurringEventButton onClick={handleRecurringEvent}>
            Recurring
          </ S.RecurringEventButton>
        </S.Row3Div>

        {
          isRecurringEvent && (
            <S.Row4Div>
              <DateInput
                text={'Start'}
                date={currentEvent.startDate}
                handleDate={handleDate}
              />
              <DateInput
                text={'End'}
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
          )
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
  const hourTag: string = `${text}Hour`;
  const minuteTag: string = `${text}Minute`;

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

  const dateTag: string = `${text}Date`;
  return (
    <S.TimeContainerDiv>
      <S.TimeP>{text}</S.TimeP>
      <S.DayInputDate value={F.formatDate(date)} onChange={(e) => handleDate(e, dateTag)} />
    </S.TimeContainerDiv>
  );
};

const IconMenu: React.FC<{
  isIconMenu: boolean,
  toggleIconMenu: () => void,
  currentEventIcon: React.ComponentType,
  handleIcon: (icon: React.ComponentType) => void,
  iconArray: React.ComponentType[],
}> = ({ toggleIconMenu, isIconMenu, handleIcon, currentEventIcon, iconArray }) => {
  return (
    <S.IconMenuButton $color={""} $size={50} $svgSize={25} onClick={toggleIconMenu}>
      {React.createElement(currentEventIcon)}
      {
        (isIconMenu && (
          <S.ContainerMenuDiv $block={isIconMenu ? 'block' : 'none'}>
            <S.MenuItemDiv>
              {iconArray.map((icon: React.ComponentType, index: number) => {

                return (
                  <S.ItemButton key={index} $color={""} $size={49} $svgSize={30} onClick={() => handleIcon(icon)}>
                    {React.createElement(icon)}
                  </S.ItemButton>
                );
              })}
            </S.MenuItemDiv>
          </S.ContainerMenuDiv>
        ))
      }
    </S.IconMenuButton>
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

const FriendList: React.FC<{}> = () => {
  const [isClicked, setIsClicked] = useState<boolean>(true);
  const [linkedCalendar, setLinkedCalendar] = useState<string>(""); //  todo Change this to id
  const [linkedUser, setLinkedUser] = useState<string>(""); //  todo Change this to id

  const handleSetLinkedUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, name: string) => {
    if (name === linkedUser) setLinkedUser("");
    else setLinkedUser(name);
  };

  const handleSetLinkedCalendar = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, name: string) => {
    if (name === linkedCalendar) setLinkedCalendar("");
    else setLinkedCalendar(name);
  };

  const toggleIsClicked = () => setIsClicked(!isClicked);

  return <>
    <S.FriendButton $size={80} $svgSize={30} $color={'black'} $isClicked={isClicked} onClick={toggleIsClicked}>
      <I.users />
    </S.FriendButton>

    <S.FriendContainerDiv $isClicked={isClicked}>
      <S.FriendHeader>
        <S.FriendCloseButton $size={10} $svgSize={10} $color={'black'} onClick={toggleIsClicked}>
          <I.cross />
        </S.FriendCloseButton>
        <S.FriendSearchDiv>
          <S.FriendSearchIcon $size={20} $svgSize={15} $color={'black'}>
            <I.search />
          </S.FriendSearchIcon>
          <S.FriendSearchInput />
        </S.FriendSearchDiv>
      </S.FriendHeader>
      <S.FriendUl>
        {
          C.USER.friends.map((friend, index) => {
            return <React.Fragment key={index}>
              <S.FriendNameLi>
                <S.FriendNameP>
                  {friend.name}
                </S.FriendNameP>
                <S.DropdownButton
                  $size={30}
                  $svgSize={15}
                  $color={"black"}
                  $isClicked={friend.name === linkedUser}
                  onClick={(e) => handleSetLinkedUser(e, friend.name)}
                >
                  <I.dropdown />
                </S.DropdownButton>
              </S.FriendNameLi>
              {
                (friend.name === linkedUser) && (
                  friend.calendars.map((name: string, index: number) => {
                    return (
                      <S.FriendCalendarNameLi key={index} $isVisible={name === linkedUser} $delay={(index + 1) * 0.30} >
                        <S.CalendarNameP>
                          {name}
                        </S.CalendarNameP>
                        <S.LinkedButton
                          $size={25}
                          $svgSize={15}
                          $color={"black"}
                          onClick={(e) => handleSetLinkedCalendar(e, name)}
                          $isClicked={name === linkedCalendar}
                        >
                          {(name === linkedCalendar) ? <I.fullCircle /> : <I.emptyCircle />}
                        </S.LinkedButton>
                      </S.FriendCalendarNameLi>
                    )
                  })
                )
              }
            </React.Fragment>
          })
        }
      </S.FriendUl>
    </S.FriendContainerDiv>
  </>;
};

export default CalendarHub;