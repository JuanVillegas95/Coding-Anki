import React, { useState, useEffect, useRef } from "react";
import * as C from "@/utils/CalendarHub/constants";
import * as F from "@/utils/CalendarHub/functions";
import * as I from "@/utils/CalendarHub/icons"
import * as S from "@/styles/CalendarHub.styles";
import { Event, Time, Calendar, FormattedEvent } from "@/utils/CalendarHub/classes";


// WEEKLY CALENDAR COMPONENT
const CalendarHub: React.FC = () => {
  const [calendars, setCalendars] = useState<Map<string, Calendar>>(C.NULL_CALENDARS);
  const calendar = useRef<Calendar>(C.NULL_CALENDAR);
  const event = useRef<Event>(C.NULL_EVENT);
  const mainRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO Validate user....
    calendar.current = new Calendar();
    setCalendars(new Map([[calendar.current.id, calendar.current]]))
  }, [])


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
      <Header name={calendar.current.name} changeCalendarName={changeCalendarName} />
      <Aside
        asideRef={asideRef}
        handleAsideScroll={handleAsideScroll}
      />
      <SubHeader />
      <Main
        mainRef={mainRef}
        handleMainScroll={handleMainScroll}
        event={event}
        events={calendars.get(calendar.current.id)!.events}
        addEvent={addEvent}
        deleteEvent={deleteEvent}
      />
      {/* <EventModal handleModalClose={handleModalClose} isModalOpen={isModalOpen} /> */}
    </S.GridContainer>
  );
};

const Header: React.FC<{
  name: string,
  changeCalendarName: (e: React.ChangeEvent<HTMLInputElement>) => void
}> = ({ name, changeCalendarName }) => {
  return (
    <S.Header>
      <S.HEADER_Container>
        <S.HEADER_Title value={name} onChange={changeCalendarName} />
      </S.HEADER_Container>
    </S.Header>
  );
};

const Aside: React.FC<{ asideRef: React.RefObject<HTMLDivElement>, handleAsideScroll: () => void }> = ({ asideRef, handleAsideScroll }) => {
  return (
    <S.Aside ref={asideRef} onScroll={handleAsideScroll}>
      {F.generate24HourIntervals().map((hour: string, i: number) => (
        <S.A_Hour key={i} $marginBottom={i === 0 ? 2 : 0} $isEven={i % 2 === 0} >{hour}</S.A_Hour>
      ))}
    </S.Aside>
  );
};

const SubHeader: React.FC = () => {
  return (
    <S.SubHeader>
      {C.DAYS.map((day, i) => <S.S_Day key={i}>{day}</S.S_Day>)}
    </S.SubHeader>
  );
};

const Main: React.FC<{
  mainRef: React.RefObject<HTMLDivElement>;
  handleMainScroll: () => void;
  event: React.MutableRefObject<Event>;
  events: Map<string, Event>;
  addEvent: () => void;
  deleteEvent: () => void;
}> = ({ mainRef, handleMainScroll, event, events, addEvent, deleteEvent }) => {
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
    if (!newEventValid) deleteEvent();
    event.current = C.NULL_EVENT;
  };

  return (
    <S.Main ref={mainRef} onScroll={handleMainScroll}>
      <S.M_Cells onMouseMove={handleMouseMove} onMouseLeave={() => setIsMouseDown(false)}>
        {F.range(7).map((i) => {
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
              {F.range(48).map((j) => <S.M_Cell key={j} />)}
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
      {
        events.map((event) => {
          const totalMinutes: number = F.timeToMinutes(event.duration);
          const formattedEvent: FormattedEvent = F.formatEvent(event);


          if ((totalMinutes < 30)) {
            return <ShortEvent key={event.id} event={formattedEvent} />;
          } else if (totalMinutes >= 30 && totalMinutes < 60) {
            return <MediumEvent key={event.id} event={formattedEvent} />;
          } else {
            return <LongEvent key={event.id} event={formattedEvent} />;
          }
        })}
    </div>
  );
};

const ShortEvent: React.FC<{ event: FormattedEvent }> = ({ event }) => {
  const { id, height, color, title, topOffset } = event;
  return (
    <S.ShortEvent key={id} $fromTop={topOffset} $height={height} $color={color}>
      <S.EventTitle>{title}</S.EventTitle>
    
    </S.ShortEvent>
  );
};

const MediumEvent: React.FC<{ event: FormattedEvent }> = ({ event }) => {
  const { id, height, startHours, startMinutes, endHours, endMinutes, color, title, topOffset, description } = event;
  return (
    <S.LongEvent key={id} $fromTop={topOffset} $height={height} $color={color}>
      <S.LongEventHeader $color={color}>
        <S.EventIcon $color={"white"} $width={12} $height={12}>
          <I.heart />
        </S.EventIcon>
        <S.LongEventTime> 
          <S.EventStartTime>
            {startHours}:{startMinutes}
          </S.EventStartTime>
          <S.EventIcon $color={"white"} $width={12} $height={12}>
            <I.right_arrow />
          </S.EventIcon>
          <S.EventEndTime>
            {endHours}:{endMinutes}
          </S.EventEndTime>
        </S.LongEventTime>
      </S.LongEventHeader>
      <S.LongEventBody>
        <S.EventTitle>{title}</S.EventTitle>
      </S.LongEventBody>
    </S.LongEvent>
  );
};

const LongEvent: React.FC<{ event: FormattedEvent }> = ({ event }) => {
  const { id, height, startHours, startMinutes, endHours, endMinutes, color, title, topOffset, description } = event;
  return (
    <S.LongEvent key={id} $fromTop={topOffset} $height={height} $color={color}>
      <S.LongEventHeader $color={color}>
      <S.EventIcon $color={"white"} $width={12} $height={12}>
          <I.heart />
        </S.EventIcon>
        <S.LongEventTime> 
          <S.EventStartTime>
            {startHours}:{startMinutes}
          </S.EventStartTime>
          <S.EventIcon $color={"white"} $width={12} $height={12}>

            <I.right_arrow />
          </S.EventIcon>
          <S.EventEndTime>
            {endHours}:{endMinutes}
          </S.EventEndTime>
        </S.LongEventTime>
      </S.LongEventHeader>
      <S.LongEventBody>
        <S.EventTitle>{title}</S.EventTitle>
        <S.EventDescription>{description}</S.EventDescription>
      </S.LongEventBody>
    </S.LongEvent>
  );
};

const HourLine: React.FC<{ currentDate: Date }> = ({ currentDate }) => (
  <S.H_HourLine $fromTop={F.calculateTopOffset(new Time(currentDate.getHours(), currentDate.getMinutes()))}>
    {currentDate.getHours()}:{currentDate.getMinutes()}
    <S.H_LineAfterHour />
  </S.H_HourLine>
);

// const EventModal: React.FC<{
//   isModalOpen: boolean;
//   handleModalClose: () => void;
// }> = ({ isModalOpen, handleModalClose }) => {
//   const handleSubmit = (e: React.FormEvent): void => {
//     e.preventDefault();
//     handleModalClose();
//   };

//   return (
//     <Modal show={isModalOpen} handleClose={handleModalClose}>
//       <S.ModalContent>
//         <S.EventSettings onSubmit={handleSubmit}>
//           <S.InputTitle />
//           <S.InputDescription />
//           <S.SelectColor>
//             {C.COLORS.map((color: string, i: number) => (
//               <option key={i} value={color}>{color}</option>
//             ))}
//           </S.SelectColor>
//           <S.InputTimeContainer>
//             <S.TimeInput />
//             <S.TimeInput />
//           </S.InputTimeContainer>
//           <S.ButtonsContainer>
//             {C.DAYS.map((day, i) => (
//               <S.DayLabel key={i}>
//                 <S.EventDayChecks />
//                 <S.DayText>{day.charAt(0)}</S.DayText>
//               </S.DayLabel>
//             ))}
//           </S.ButtonsContainer>
//           <S.SaveButton>Save</S.SaveButton>
//           <S.DeleteButton>Delete</S.DeleteButton>
//         </S.EventSettings>
//       </S.ModalContent>
//     </Modal>
//   );
// };

export default CalendarHub;
