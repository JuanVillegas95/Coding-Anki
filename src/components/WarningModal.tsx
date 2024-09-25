import React, { useState } from 'react';
import { Event, Warning } from '@/utils/classes';
import WarningConflict from "@/components/WarningConflict"
import WarningModify from "@/components/WarningModify"
import WarningDelete from "@/components/WarningDelete"
import * as S from '@/utils/styles';
import * as F from '@/utils/functions';
import * as C from '@/utils/constants';
import * as I from '@/utils/icons';
import * as T from '@/utils/types';

const WarningModal: React.FC<{
    warning: Warning;
    warningHandler: T.WarningHandler;
    calendarHandler: T.CalendarHandler;
}> = ({ warningHandler, warning, calendarHandler, }) => {
    const { status, currentEvent, conflictEvents, recurringEvents, beforeDragEvent } = warning;

    const handleConflict = () => {
        conflictEvents!.forEach((conflictEvent) => {
            calendarHandler.deleteEvent(conflictEvent);
            if (conflictEvent.groupID) calendarHandler.deleteRecurringEventID(conflictEvent);
        });
        recurringEvents!.forEach((recurringEvent) => {
            calendarHandler.setEvent(recurringEvent);
            calendarHandler.setReccurringEventIDs(recurringEvent);
        });
        warningHandler.close();
    };

    const modifyEvents = (): void => {
        const groupEvents: Event[] = calendarHandler.getReccurringEventIDs(currentEvent!)
        const conflictEvents: Event[] = [];
        const modifiedEvents: Event[] = [];
        groupEvents.forEach((event) => {
            const modifiedEvent: Event = { ...currentEvent!, id: currentEvent!.id, date: currentEvent!.date }
            modifiedEvent.id = event.id;
            modifiedEvent.date = event.date;
            modifiedEvents.push(modifiedEvent)
            const newConflictEvents: Event[] = F.getConflictingEvents(modifiedEvent, calendarHandler.getEvents());
            if (newConflictEvents.length > 0) newConflictEvents.forEach((newConflictEvent: Event) => conflictEvents.push(newConflictEvent));
        });
        if (conflictEvents.length > 0) {
            warningHandler.set(new Warning(
                C.WARNING_STATUS.EVENT_CONFLICT,
                currentEvent,
                conflictEvents,
                modifiedEvents,
            ))
            return;
        }
        modifiedEvents.forEach((event) => calendarHandler.setEvent(event))
        warningHandler.close();
    };

    const modifyEvent = (): void => {
        const singleEvent: Event = { ...currentEvent!, groupID: currentEvent!.groupID };
        calendarHandler.deleteRecurringEventID(singleEvent);
        singleEvent.groupID = null;
        calendarHandler.setEvent(singleEvent!);
        warningHandler.close();
    };

    const cancelAction = () => warningHandler.close();

    const cancelActionModify = () => {
        warningHandler.close()
        calendarHandler.setEvent(beforeDragEvent!);
    };

    const deleteGroupEvents = () => {
        const groupEvents: Event[] = calendarHandler.getReccurringEventIDs(currentEvent!)
        groupEvents.forEach((event) => {
            calendarHandler.deleteEvent(event);
            if (event.groupID) calendarHandler.deleteRecurringEventID(event);
        })
        warningHandler.close();
    }

    const deleteEvent = () => {
        calendarHandler.deleteEvent(currentEvent!);
        if (currentEvent!.groupID) calendarHandler.deleteRecurringEventID(currentEvent!);
        warningHandler.close();
    }

    return <WarningLayout label={warning.status}>
        {status === C.WARNING_STATUS.EVENT_CONFLICT && <WarningConflict
            currentEvent={currentEvent!}
            conflictEvents={conflictEvents!}
            deleteEvents={handleConflict}
            cancelAction={cancelAction}
        />}
        {status == C.WARNING_STATUS.EVENT_MODIFY && <WarningModify
            currentEvent={currentEvent!}
            cancelAction={cancelActionModify}
            modifyEvent={modifyEvent}
            modifyEvents={modifyEvents}
        />}
        {status == C.WARNING_STATUS.EVENT_DELETE && <WarningDelete
            currentEvent={currentEvent!}
            cancelAction={cancelAction}
            deleteGroupEvents={deleteGroupEvents}
            deleteEvent={deleteEvent}
        />}
    </WarningLayout>



};

const WarningLayout: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => <S.WarningWrapperDiv>
    <S.WarningContainerDiv>
        <S.WarningHeader>
            <S.Warningh1>
                {label}
            </S.Warningh1>
        </S.WarningHeader>
        {children}
    </S.WarningContainerDiv>
</S.WarningWrapperDiv>



export default WarningModal;
