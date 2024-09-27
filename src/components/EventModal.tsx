import React, { useState, useEffect } from 'react';
import * as S from '@/utils/style.calendar';
import * as I from '@/utils/icons';
import * as C from '@/utils/constants';
import * as F from '@/utils/functions';
import * as T from '@/utils/types';
import { Event, Toast, Warning } from '@/utils/classes';
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
    calendarHandler: T.CalendarHandler;
    warningHandeler: T.WarningHandler;

}> = ({ isModalOpen, closeModal, currentEvent, events, calendarHandler, updateCurrentEvent, addToast, warningHandeler }) => {
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
        if (title.length > 40) {
            addToast(new Toast(
                "Invalid title length",
                "Event title must be under 40 characters.",
                C.TOAST_TYPE.INFO,
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
                "Event description must be under 200 characters.",
                C.TOAST_TYPE.INFO
            ));
            return;
        }
        updateCurrentEvent({ ...currentEvent, description });
    };

    const handleTime = (e: React.ChangeEvent<HTMLSelectElement>, tag: string): void => {
        const value = parseInt(e.target.value);
        const updatedEvent: Event = {
            ...currentEvent,
            start: { ...currentEvent.start },
            end: { ...currentEvent.end },
        };

        switch (tag) {
            case 'StartHour': { updatedEvent.start.hours = value; } break;
            case 'StartMinute': { updatedEvent.start.minutes = value; } break;
            case 'EndHour': { updatedEvent.end.hours = value; } break;
            case 'EndMinute': { updatedEvent.end.minutes = value; } break;
        }

        updatedEvent.duration = F.calculateEventDuration(updatedEvent);
        updatedEvent.height = F.calculateEventHeight(updatedEvent);
        const newConflictEvents: Event[] = F.getConflictingEvents(updatedEvent, events);

        // ! CHECK THIS
        if (newConflictEvents.length > 0) {
            warningHandeler.set(new Warning(C.WARNING_STATUS.EVENT_CONFLICT, updatedEvent, newConflictEvents))
            closeModal();
            return;
        }

        updateCurrentEvent(updatedEvent);
    };

    const handleDate = (e: React.ChangeEvent<HTMLInputElement>, tag: string): void => {
        // Extract year, month, and day from the input
        const [year, month, day] = e.target.value.split('-').map(Number);
        const newDate = new Date(year, month - 1, day);

        // Normalize the new date (set time components to zero)
        newDate.setHours(0, 0, 0, 0);

        // Create a copy of the current event with normalized dates
        const updatedEvent: Event = {
            ...currentEvent,
            startDate: new Date(currentEvent.startDate),
            endDate: currentEvent.endDate ? new Date(currentEvent.endDate) : null,
        };

        // Normalize the existing startDate and endDate
        updatedEvent.startDate.setHours(0, 0, 0, 0);
        if (updatedEvent.endDate) updatedEvent.endDate.setHours(0, 0, 0, 0);

        // Update the startDate or endDate based on the tag
        if (tag === 'StartDate') updatedEvent.startDate = newDate;
        if (tag === 'EndDate') updatedEvent.endDate = newDate;

        // Validate date ranges
        if (updatedEvent.endDate && updatedEvent.startDate >= updatedEvent.endDate) {
            addToast(new Toast(
                "Handle date",
                "The start date cannot be after the end date",
                C.TOAST_TYPE.INFO
            ));
            return;
        }

        // Check if the event duration exceeds one year
        const oneYearInMs = 365 * 24 * 60 * 60 * 1000; // One year in milliseconds
        if (updatedEvent.endDate) {
            const dateDifference = updatedEvent.endDate.getTime() - updatedEvent.startDate.getTime();

            if (dateDifference > oneYearInMs) {
                addToast(new Toast(
                    "Handle date",
                    "The event duration cannot be greater than one year.",
                    C.TOAST_TYPE.INFO
                ));
                return;
            }
        }

        // Update the current event with the new dates
        updateCurrentEvent(updatedEvent);
    };


    const handleSelectedDays = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
        const isSelected: boolean = e.target.checked;
        const updatedEvent: Event = { ...currentEvent, selectedDays: [...currentEvent.selectedDays] };
        updatedEvent.selectedDays[index] = isSelected;
        updateCurrentEvent(updatedEvent);
    };


    const handleRecurringEvent = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        const updatedEvent: Event = { ...currentEvent, groupID: currentEvent.groupID };
        if (!updatedEvent.groupID) updatedEvent.groupID = uuidv4();
        else updatedEvent.groupID = null;
        updateCurrentEvent(updatedEvent);
    };

    const handleDeleteEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!currentEvent.groupID) calendarHandler.deleteEvent(currentEvent);
        else warningHandeler.set(new Warning(C.WARNING_STATUS.EVENT_DELETE, currentEvent))
        closeModal();
    };

    const handleCloseModal = () => {
        setIsColorMenu(false);
        setIsIconMenu(false);
        closeModal();
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const updatedEvent: Event = {
            ...currentEvent,
            startDate: new Date(currentEvent.startDate),
            endDate: currentEvent.endDate ? new Date(currentEvent.endDate) : null,
            selectedDays: [...currentEvent.selectedDays],
        }

        // If event has an groupID means either the user is:
        // - setting for the first time recurringEvents
        // - modifying recurring events
        if (currentEvent.groupID) {
            if (!currentEvent.endDate) {
                console.log("not valid")
                addToast(new Toast(
                    "Handle end time",
                    "End time must be valid",
                    C.TOAST_TYPE.INFO
                ));
                return;
            }
            if (F.isEndBeforeStart(currentEvent)) {
                addToast(new Toast(
                    "Handle time",
                    "The end time cannot be before the start time",
                    C.TOAST_TYPE.INFO
                ));
                return;
            }
            // If events exist just modify them if not create them
            const recurringEvents: Event[] = calendarHandler.getReccurringEventIDs(currentEvent);
            const isRecurringEventsEmpty: boolean = (recurringEvents.length === 0)

            if (isRecurringEventsEmpty) {
                warningHandeler.set(new Warning(C.WARNING_STATUS.EVENT_MODIFY, currentEvent, null, null));
                return;
            } else {
                calendarHandler.setRecurringEvents(updatedEvent);
            }

        } else {  // Reset all values that belong to recurring aspects
            updatedEvent.startDate = currentEvent.date;
            updatedEvent.endDate = null;
            updatedEvent.selectedDays.fill(false);
            updatedEvent.selectedDays[F.getDay(currentEvent.date)] = true;
        }
        calendarHandler.setEvent(updatedEvent);
        closeModal();
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

            {currentEvent.groupID && (
                <S.Row4Div>
                    <DateInput
                        text={'Start'}
                        date={currentEvent.startDate}
                        handleDate={handleDate}
                    />
                    <DateInput
                        text={'End'}
                        date={currentEvent.endDate}
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
