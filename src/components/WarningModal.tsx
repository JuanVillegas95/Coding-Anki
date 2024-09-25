import React, { useState } from 'react';
import { Event, Warning } from '@/utils/classes';
import WarningConflict from "@/components/WarningConflict"
import WarningModify from "@/components/WarningModify"
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
    const { status, currentEvent, conflictEvents, recurringEvents } = warning;

    const deleteEvents = () => {
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

    const deleteEvent = () => {
        const conflictEvent: Event = conflictEvents![0];
        calendarHandler.deleteEvent(conflictEvent);
        if (conflictEvent.groupID) calendarHandler.deleteRecurringEventID(conflictEvent);

        calendarHandler.setEvent(currentEvent!);
        if (currentEvent!.groupID) calendarHandler.setReccurringEventIDs(currentEvent!);

        warningHandler.close();
    };

    const modifyEvents = () => {
        conflictEvents!.forEach((event) => calendarHandler.deleteEvent(event));
        recurringEvents!.forEach((event) => calendarHandler.setEvent(event));
        warningHandler.close();
    };

    const modifyEvent = () => {
        calendarHandler.deleteEvent(conflictEvents![0]);
        calendarHandler.setEvent(currentEvent!);
        warningHandler.close();
    };

    const cancelAction = () => warningHandler.close();

    return <WarningLayout label={warning.status}>
        {status === C.WARNING_STATUS.EVENT_CONFLICT && <WarningConflict
            currentEvent={currentEvent!}
            conflictEvents={conflictEvents!}
            deleteEvents={deleteEvents}
            deleteEvent={deleteEvent}
            cancelAction={cancelAction}
        />}
        {status == C.WARNING_STATUS.EVENT_MODIFY && <WarningModify
            currentEvent={currentEvent!}
            cancelAction={cancelAction}
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
