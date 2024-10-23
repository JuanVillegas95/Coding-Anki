import React, { useState, useEffect, useRef } from 'react';
import * as S from '../utils/style.calendar';
import * as I from '../utils/icons';
import { v4 as uuidv4 } from 'uuid';
import TimeInput from './TimeInput';
import DateInput from './DateInput';
import DaySelector from './DaySelector';
import { COLOR, COLORS, Event, ICON, ICONS } from "@/classes/Event";
import { RecurringDetails, recurringId } from "@/classes/RecurringDetails";
import { MyDate } from '@/classes/MyDate';

const ESCAPE_KEYS: string[] = ["Esc", "Escape"];

const EventModal: React.FC<{
    setEvent: (eventToSet: Event, recurringDetails: RecurringDetails | null) => void;
    event: React.MutableRefObject<Event | null>;
    getRecurringdDetails: (recurringId: recurringId) => RecurringDetails | null;
    // deleteEvent: (event: Event) => void;
    // pushToast: (id: string, description: string, type: TOAST_TYPE) => void;
    isEventModal: boolean;
    closeModal: () => void;
}> = ({ isEventModal, closeModal, event, setEvent, getRecurringdDetails }) => {
    const [currRecurringDetails, setCurrRecurringDetails] = useState<RecurringDetails | null>(getRecurringdDetails(event.current!.getRecurringId()))
    const [currEvent, setCurrEvent] = useState<Event>(event.current!.clone())
    const tempRecurringId = useRef<recurringId>(event.current!.getRecurringId());
    const [isIconMenu, setIsIconMenu] = useState<boolean>(false);
    const [isColorMenu, setIsColorMenu] = useState<boolean>(false);

    useEffect(() => {
        const handleKeyboardEvent = (e: KeyboardEvent) => {
            if (ESCAPE_KEYS.includes(e.key) && isEventModal) closeModal();
        };

        window.addEventListener('keydown', handleKeyboardEvent);
        return () => window.removeEventListener('keydown', handleKeyboardEvent);
    }, [isEventModal]);

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
        // if (title.length > 40) {
        //     pushToast(
        //         "Invalid title length",
        //         "Event title must be under 40 characters.",
        //         C.TOAST_TYPE.INFO,
        //     );
        //     return;
        // }
        const clonedEvent: Event = currEvent.clone();
        clonedEvent.setTitle(title)
        setCurrEvent(clonedEvent)
    };

    const handleIcon = (icon: ICON): void => {
        const clonedEvent: Event = currEvent.clone();
        clonedEvent.setIcon(icon)
        setCurrEvent(clonedEvent)
    };

    const handleColor = (color: COLOR): void => {
        const clonedEvent: Event = currEvent.clone();
        clonedEvent.setColor(color)
        setCurrEvent(clonedEvent)
    };

    const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        const description = e.target.value;
        // if (description.length > 200) {
        //     pushToast(
        //         "Invalid description",
        //         "Event description must be under 200 characters.",
        //         C.TOAST_TYPE.INFO
        //     );
        //     return;
        // }
        const clonedEvent: Event = currEvent.clone();
        clonedEvent.setDescription(description);
        setCurrEvent(clonedEvent);
    };

    const handleTime = (e: React.ChangeEvent<HTMLSelectElement>, tag: string): void => {
        const value = parseInt(e.target.value);

        const clonedEvent: Event = currEvent.clone();

        switch (tag) {
            case 'StartHour': { clonedEvent.getStartTime().setHours(value); } break;
            case 'StartMinute': { clonedEvent.getStartTime().setMinutes(value); } break;
            case 'EndHour': { clonedEvent.getStartTime().setHours(value); } break;
            case 'EndMinute': { clonedEvent.getStartTime().setMinutes(value); } break;
        }

        setCurrEvent(clonedEvent)
    };

    const handleRecurringEvent = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();

        const clonedEvent: Event = currEvent.clone();

        if (!tempRecurringId.current) tempRecurringId.current = uuidv4();
        if (clonedEvent.getRecurringId()) clonedEvent.setRecurringId(null);
        else clonedEvent.setRecurringId(tempRecurringId.current)

        if (!currRecurringDetails) {
            const startDate: MyDate = new MyDate(currEvent.getMyDate().getJsDate());
            const endDate: MyDate = new MyDate(MyDate.NULL);
            const selectedDays: boolean[] = Array(7).fill(false);
            selectedDays[currEvent.getMyDate().getDay()] = true;
            setCurrRecurringDetails(new RecurringDetails(startDate, endDate, selectedDays));
        }
        setCurrEvent(clonedEvent);
    };

    const handleDate = (e: React.ChangeEvent<HTMLInputElement>, label: string): void => {
        const date: string = e.target.value;
        const clonedRecurringDetails: RecurringDetails = currRecurringDetails!.clone();
        if (label === "Start") clonedRecurringDetails.setStartDate(new MyDate(date))
        if (label === "End") clonedRecurringDetails.setEndDate(new MyDate(date))
        setCurrRecurringDetails(clonedRecurringDetails);


        // if (startDate >= endDate) {
        //     pushToast(
        //         "Handle date",
        //         "The start date cannot be after the end date",
        //         C.TOAST_TYPE.INFO
        //     );
        //     return;
        // }

        // if (updatedEvent.endDate) {
        //     const dateDifference = endDate.getTime() - startDate.getTime();
        //     if (dateDifference > C.ONE_YEAR_IN_MS) {
        //         pushToast(
        //             "Handle date",
        //             "The event duration cannot be greater than one year.",
        //             C.TOAST_TYPE.INFO
        //         );
        //         return;
        //     }
        // }

    };


    const handleSelectedDays = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
        const clonedRecurringDetails = currRecurringDetails!.clone();
        const selectedDays = clonedRecurringDetails.getSelectedDays();
        selectedDays[index] = e.target.checked;
        clonedRecurringDetails.setSelectedDays(selectedDays);
        setCurrRecurringDetails(clonedRecurringDetails);
    };


    const handleDeleteEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        // e.preventDefault();
        // deleteEvent(currentEvent);
        // closeModal();
    };

    const handleCloseModal = () => {
        setIsColorMenu(false);
        setIsIconMenu(false);
        closeModal();
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // if (currentEvent.groupId) {
        //     if (!currentEvent.endDate) {
        //         pushToast(
        //             "Handle end time",
        //             "End time must be valid",
        //             C.TOAST_TYPE.INFO
        //         );
        //         return;
        //     }
        // }
        // if (F.isEndBeforeStart(currentEvent)) {
        //     pushToast(
        //         "Handle time",
        //         "The end time cannot be before the start time",
        //         C.TOAST_TYPE.INFO
        //     );
        //     return;
        // }
        if (!currRecurringDetails) setEvent(currEvent, null);
        else setEvent(currEvent, currRecurringDetails);
        closeModal();
    }


    return <S.ContainerModalDiv >
        <S.ModalForm onSubmit={handleSubmit}>
            <S.ModalCloseButton $color={'black'} $size={30} $svgSize={15} onClick={handleCloseModal}>
                {React.createElement(I.cross)}
            </S.ModalCloseButton>
            <S.Row1Div>
                <S.TitleInput value={currEvent.getTitle() ?? ""} onChange={handleTitle} />
                <S.IconMenuButton $size={50} $svgSize={25} onClick={toggleIconMenu}>
                    {React.createElement(ICONS[currEvent.getIcon()])}
                    {isIconMenu && (
                        <S.ContainerMenuDiv $block={isIconMenu ? 'block' : 'none'}>
                            <S.MenuItemDiv>
                                {Object.entries(ICONS).map(([iconName, IconComponent], index: number) => (
                                    <S.ItemButton key={index} $size={49} $svgSize={30} onClick={() => handleIcon(iconName as ICON)}>
                                        {React.createElement(IconComponent)}
                                    </S.ItemButton>
                                ))}
                            </S.MenuItemDiv>
                        </S.ContainerMenuDiv>
                    )}
                </S.IconMenuButton>
                <S.IconMenuButton $size={50} $svgSize={25} onClick={toggleColorMenu}>
                    <S.colorDivFirst $color={COLORS[currEvent.getColor()].primary} />
                    {isColorMenu && (
                        <S.ContainerMenuDiv $block={isColorMenu ? 'block' : 'none'}>
                            <S.MenuItemDiv>
                                {Object.entries(COLORS).map(([colorName, order], index: number) => (
                                    <S.ItemButton
                                        key={index}
                                        $size={49}
                                        $svgSize={25} onClick={() => handleColor(currEvent.getColor())} >
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
                    value={currEvent.getDescription() ?? ""}
                    onChange={handleDescription}
                />
            </S.Row2Div>

            <S.Row3Div>
                <TimeInput
                    text={'Start'}
                    time={currEvent.getStartTime()}
                    handleTime={handleTime}
                />
                <TimeInput
                    text={'End'}
                    time={currEvent.getEndTime()}
                    handleTime={handleTime}
                />

                <S.RecurringEventButton onClick={handleRecurringEvent}>
                    Recurring
                </S.RecurringEventButton>
            </S.Row3Div>

            {currEvent.getRecurringId() && (
                <S.Row4Div>
                    <DateInput
                        text={'Start'}
                        date={currRecurringDetails!.getStartDate().getStringifiedDate()}
                        handleDate={handleDate}
                    />
                    <DateInput
                        text={'End'}
                        date={currRecurringDetails!.getEndDate().getStringifiedDate()}
                        handleDate={handleDate}
                    />
                    <S.ContainerDaySelectorDiv>
                        <DaySelector
                            selectedDays={currRecurringDetails!.getSelectedDays()}
                            startDate={currRecurringDetails!.getStartDate().getStringifiedDate()}
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
