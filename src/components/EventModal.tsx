import React, { useState, useEffect, useRef } from 'react';
import * as S from '@/utils/style.calendar';
import * as I from '@/utils/icons';
import * as C from '@/utils/constants';
import * as F from '@/utils/functions';
import * as T from '@/utils/types';
import { Event, Toast, Warning } from '@/utils/classes';
import { v4 as uuidv4 } from 'uuid';
import TimeInput from './TimeInput';
import DateInput from './DateInput';
import DaySelector from './DaySelector';

const EventModal: React.FC<{
    event: React.MutableRefObject<Event | null>;
    getEvents: (date: string) => Event[];
    setEvent: (event: Event) => void;
    deleteEvent: (event: Event) => void;

    addToast: (newToast: Toast) => void;
    isModalOpen: boolean;
    closeModal: () => void;
    warningHandeler: T.WarningHandler;

}> = ({ isModalOpen, closeModal, getEvents, addToast, warningHandeler, event, setEvent, deleteEvent }) => {
    const [currentEvent, setCurrentEvent] = useState<Event>({ // Deep copying nested objects
        ...event.current!,
        start: { ...event.current!.start },
        end: { ...event.current!.end },
        selectedDays: [...event.current!.selectedDays]
    })

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
        setCurrentEvent({ ...currentEvent, title })
    };

    const handleIcon = (icon: string): void => { setCurrentEvent({ ...currentEvent, icon }) };
    const handleColor = (color: string): void => { setCurrentEvent({ ...currentEvent, color }) };

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
        setCurrentEvent({ ...currentEvent, description })
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
        //! Bananas
        // const newConflictEvents: Event[] = F.getConflictingEvents(updatedEvent, events);

        // ! CHECK THIS
        // if (newConflictEvents.length > 0) {
        //     warningHandeler.set(new Warning(C.WARNING_STATUS.EVENT_CONFLICT, updatedEvent, newConflictEvents))
        //     closeModal();
        //     return;
        // }

        setCurrentEvent(updatedEvent)
    };

    const handleDate = (e: React.ChangeEvent<HTMLInputElement>): void => {
        // Extract year, month, and day from the input
        const date: string = e.target.value;
        const updatedEvent: Event = { ...currentEvent, endDate: currentEvent.endDate };
        updatedEvent.endDate = date;

        const startDate: Date = F.parseDateStringToUTC(updatedEvent.date)
        const endDate: Date = F.parseDateStringToUTC(updatedEvent.endDate)

        if (startDate >= endDate) {
            addToast(new Toast(
                "Handle date",
                "The start date cannot be after the end date",
                C.TOAST_TYPE.INFO
            ));
            return;
        }

        if (updatedEvent.endDate) {
            const dateDifference = endDate.getTime() - startDate.getTime();
            if (dateDifference > C.ONE_YEAR_IN_MS) {
                addToast(new Toast(
                    "Handle date",
                    "The event duration cannot be greater than one year.",
                    C.TOAST_TYPE.INFO
                ));
                return;
            }
        }

        setCurrentEvent(updatedEvent)
    };


    const handleSelectedDays = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
        const isSelected: boolean = e.target.checked;
        const updatedEvent: Event = { ...currentEvent, selectedDays: [...currentEvent.selectedDays] };
        updatedEvent.selectedDays[index] = isSelected;
        setCurrentEvent(updatedEvent)
    };


    const handleRecurringEvent = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        const updatedEvent: Event = {
            ...currentEvent,
            groupId: currentEvent.groupId,
            storedGroupId: currentEvent.storedGroupId,
        };

        if (!updatedEvent.storedGroupId) updatedEvent.storedGroupId = uuidv4();
        if (updatedEvent.groupId) updatedEvent.groupId = null;
        else updatedEvent.groupId = updatedEvent.storedGroupId;

        setCurrentEvent(updatedEvent)
    };

    const handleDeleteEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!currentEvent.groupId) deleteEvent(currentEvent);
        //! bananas
        //else warningHandeler.set(new Warning(C.WARNING_STATUS.EVENT_DELETE, event.current))
        //!
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
            endDate: currentEvent.endDate,
            selectedDays: [...currentEvent.selectedDays],
            storedGroupId: currentEvent.storedGroupId,
        }
        if (!updatedEvent.groupId) { // Reset all values that belong to recurring aspects
            updatedEvent.endDate = "";
            updatedEvent.selectedDays.fill(false);
            updatedEvent.selectedDays[F.getDay(updatedEvent.date)] = true;
            updatedEvent.storedGroupId = null;
        } else {
            if (!updatedEvent.endDate) {
                addToast(new Toast(
                    "Handle end time",
                    "End time must be valid",
                    C.TOAST_TYPE.INFO
                ));
                return;
            }
            if (F.isEndBeforeStart(updatedEvent)) {
                addToast(new Toast(
                    "Handle time",
                    "The end time cannot be before the start time",
                    C.TOAST_TYPE.INFO
                ));
                return;
            }
        };
        setEvent(updatedEvent);
        closeModal();
    }


    return <S.ContainerModalDiv >
        <S.ModalForm onSubmit={handleSubmit}>
            <S.ModalCloseButton $color={'black'} $size={30} $svgSize={15} onClick={handleCloseModal}>
                {React.createElement(I.cross)}
            </S.ModalCloseButton>
            <S.Row1Div>
                <S.TitleInput value={currentEvent.title} onChange={handleTitle} />
                <S.IconMenuButton $size={50} $svgSize={25} onClick={toggleIconMenu}>
                    {React.createElement(C.ICONS[currentEvent.icon])}
                    {isIconMenu && (
                        <S.ContainerMenuDiv $block={isIconMenu ? 'block' : 'none'}>
                            <S.MenuItemDiv>
                                {Object.entries(C.ICONS).map(([iconName, IconComponent], index: number) => (
                                    <S.ItemButton key={index} $size={49} $svgSize={30} onClick={() => handleIcon(iconName)}>
                                        {React.createElement(IconComponent)}
                                    </S.ItemButton>
                                ))}
                            </S.MenuItemDiv>
                        </S.ContainerMenuDiv>
                    )}
                </S.IconMenuButton>
                <S.IconMenuButton $size={50} $svgSize={25} onClick={toggleColorMenu}>
                    <S.colorDivFirst $color={C.COLORS[currentEvent.color].primary} />
                    {isColorMenu && (
                        <S.ContainerMenuDiv $block={isColorMenu ? 'block' : 'none'}>
                            <S.MenuItemDiv>
                                {Object.entries(C.COLORS).map(([colorName, order], index: number) => (
                                    <S.ItemButton
                                        key={index}
                                        $size={49}
                                        $svgSize={25} onClick={() => handleColor(colorName)} >
                                        <S.colorDiv $color={order.primary} />
                                    </S.ItemButton>
                                ))}
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

            {currentEvent.groupId && (
                <S.Row4Div>
                    <DateInput
                        text={'Start'}
                        date={currentEvent.date}
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
                            startDate={currentEvent.date}
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
