import React, { useState, useEffect } from 'react';
import * as S from '@/styles/CalendarHub.styles';
import * as I from '@/utils/CalendarHub/icons';
import * as C from '@/utils/CalendarHub/constants';
import * as F from '@/utils/CalendarHub/functions';
import { Event, Toast } from '@/utils/CalendarHub/classes';
import { v4 as uuidv4 } from 'uuid';
import TimeInput from './TimeInput';
import DateInput from './DateInput';
import IconMenu from './IconMenu';
import DaySelector from './DaySelector';

const EventModal: React.FC<{
    updateCurrentEvent: (event: Event) => void;
    addToast: (newToast: Toast) => void;
    isModalOpen: boolean;
    events: Map<string, Event>;
    currentEvent: Event;
    closeModal: () => void;
    calendarHandler: {
        setEvent: (event: Event) => void;
        deleteEvent: (event: Event) => void;
        getEvents: () => Map<string, Event>;
    };
}> = ({ isModalOpen, closeModal, currentEvent, events, calendarHandler, updateCurrentEvent, addToast }) => {
    const [isRecurringEvent, setIsRecurringEvent] = useState<boolean>(false);
    const [isIconMenu, setIsIconMenu] = useState<boolean>(false);
    const [isColorMenu, setIsColorMenu] = useState<boolean>(false);

    useEffect(() => {
        const handleKeyboardEvent = (e: KeyboardEvent) => {
            if (C.ESCAPE_KEYS.includes(e.key) && isModalOpen) closeModal();
        };

        window.addEventListener('keydown', handleKeyboardEvent);
        return () => window.removeEventListener('keydown', handleKeyboardEvent);
    }, [isModalOpen]);

    const toggleIconMenu = () => {
        if (isColorMenu) setIsColorMenu(false);
        setIsIconMenu(!isIconMenu);
    };

    const toggleColorMenu = () => {
        if (isIconMenu) setIsIconMenu(false);
        setIsColorMenu(!isColorMenu);
    };

    const handleTitle = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const title = e.target.value;
        if (title.length > 50) {
            addToast(new Toast(
                "Invalid title length",
                "Event title must be under 50 characters.",
                "info"
            ));
            return;
        }
        updateCurrentEvent({ ...currentEvent, title });
    };

    const handleIcon = (icon: React.ComponentType): void => updateCurrentEvent({ ...currentEvent, icon });

    const handleColor = (color: string): void => updateCurrentEvent({ ...currentEvent, color });

    const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        const description = e.target.value;
        if (description.length > 200) {
            addToast(new Toast(
                "Invalid description",
                "Event description must be at least 10 characters long.",
                "info"
            ));
            return;
        }
        updateCurrentEvent({ ...currentEvent, description });
    };

    //! I WAS HERE

    const handleDate = (e: React.ChangeEvent<HTMLInputElement>, tag: string): void => {
        const updatedEvent: Event = {
            ...currentEvent,
            startDate: new Date(currentEvent.startDate),
            endDate: new Date(currentEvent.endDate),
        };
        const newDate = new Date(e.target.value);
        console.log(updatedEvent.endDate)

        if (tag === 'StartDate') updatedEvent.startDate = newDate;
        if (tag === 'EndDate') updatedEvent.endDate = newDate;
        console.log(updatedEvent.endDate)
        if (updatedEvent.startDate > updatedEvent.endDate) {
            addToast(new Toast(
                "Handle date",
                "The start date cannot be after the end date",
                "info"
            ));
            return;
        }

        const oneYearInMs = 365 * 24 * 60 * 60 * 1000; // One year in milliseconds
        const dateDifference = updatedEvent.endDate.getTime() - updatedEvent.startDate.getTime();

        if (dateDifference > oneYearInMs) {
            addToast(new Toast(
                "Handle date",
                "The event duration cannot be greater than one year.",
                "info"
            ));
            return;
        }

        updateCurrentEvent(updatedEvent);
    };


    const handleTime = (e: React.ChangeEvent<HTMLSelectElement>, tag: string) => {
        const value = parseInt(e.target.value);
        const updatedEvent: Event = {
            ...currentEvent,
            start: { ...currentEvent.start },
            end: { ...currentEvent.end },
        };

        // Update the time fields based on the tag
        switch (tag) {
            case 'StartHour': { updatedEvent.start.hours = value; } break;
            case 'StartMinute': { updatedEvent.start.minutes = value; } break;
            case 'EndHour': { updatedEvent.end.hours = value; } break;
            case 'EndMinute': { updatedEvent.end.minutes = value; } break;
        }

        // Validate that the end time is not before the start time
        if (F.isEndBeforeStart(updatedEvent)) {
            addToast(new Toast(
                "Handle time",
                "The end time cannot be before the start time",
                "info"
            ));
            return;
        }

        if (F.isEventColliding(updatedEvent, events)) {
            addToast(new Toast(
                "Event Collision",
                "The event overlaps with an existing event. Please choose a different time.",
                "info"
            ));
            return;
        }

        // Calculate and update event duration and height
        updatedEvent.duration = F.calculateEventDuration(updatedEvent);
        updatedEvent.height = F.calculateEventHeight(updatedEvent);
        updateCurrentEvent(updatedEvent);
    };



    const handleSelectedDays = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const isSelected = e.target.checked;
        const updatedEvent: Event = {
            ...currentEvent,
            selectedDays: [...currentEvent.selectedDays],
        };
        updatedEvent.selectedDays[index] = isSelected;
        calendarHandler.setEvent(updatedEvent);
    };


    const handleRecurringEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsRecurringEvent(!isRecurringEvent);
        let updatedEvent: Event;
        // if (eventGroupID) {
        //     const eventGroupID = uuidv4(); // Generates a unique ID for the recurring event
        //     updatedEvent = { ...currentEvent, eventGroupID };
        // } else {
        //     updatedEvent = { ...currentEvent, eventGroupID: '' };
        // }
        // calendarHandler.setEvent(updatedEvent);
    };

    const handleDeleteEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        calendarHandler.deleteEvent(currentEvent);
        closeModal();
    };

    const handleCloseModal = () => {
        setIsColorMenu(false);
        setIsIconMenu(false);
        setIsRecurringEvent(false);
        closeModal();
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        closeModal();
        calendarHandler.setEvent(currentEvent);
    };



    return <S.ContainerModalDiv >
        <S.ModalForm onSubmit={handleSubmit}>
            <S.ModalCloseButton $color={'black'} $size={30} $svgSize={15} onClick={handleCloseModal}>
                {React.createElement(I.cross)}
            </S.ModalCloseButton>

            <S.Row1Div>
                <S.TitleInput value={currentEvent.title} onChange={handleTitle} />
                <IconMenu
                    toggleIconMenu={toggleIconMenu}
                    isIconMenu={isIconMenu}
                    handleIcon={handleIcon}
                    currentEventIcon={currentEvent.icon}
                    iconArray={C.ICONS_ARRAY}
                />
                <S.IconMenuButton $color={""} $size={50} $svgSize={25} onClick={toggleColorMenu}>
                    <S.colorDivFirst $color={C.COLORS[currentEvent.color].primary} />
                    {isColorMenu && (
                        <S.ContainerMenuDiv $block={isColorMenu ? 'block' : 'none'}>
                            <S.MenuItemDiv>
                                {
                                    Array.from(Object.keys(C.COLORS)).map((color, index) => (
                                        <S.ItemButton
                                            key={index}
                                            $color={""}
                                            $size={49}
                                            $svgSize={25} onClick={() => handleColor(color)} >
                                            <S.colorDiv $color={C.COLORS[color].primary} />
                                        </S.ItemButton>
                                    ))
                                }
                            </S.MenuItemDiv>
                        </S.ContainerMenuDiv>
                    )}
                </S.IconMenuButton>
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
                </S.RecurringEventButton>
            </S.Row3Div>

            {isRecurringEvent && (
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
            )}

            <S.Row5Div>
                <S.DeleteButton onClick={handleDeleteEvent}>Delete</S.DeleteButton>
                <S.SaveButton type="submit">Save</S.SaveButton>
            </S.Row5Div>
        </S.ModalForm>
    </S.ContainerModalDiv>

};

export default EventModal;
