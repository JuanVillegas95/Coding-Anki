import React, { useState } from 'react';
import { Event, Warning } from '@/utils/classes';
import EventConflict from "@/components/EventConflict"
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
        conflictEvents!.forEach((event) => calendarHandler.deleteEvent(event));
        recurringEvents!.forEach((event) => calendarHandler.setEvent(event));
        warningHandler.close();
    };

    const deleteEvent = () => {
        calendarHandler.deleteEvent(conflictEvents![0]);
        calendarHandler.setEvent(currentEvent!);
        warningHandler.close();
    };

    const cancelAction = () => warningHandler.close();

    switch (status) {
        case C.WARNING_STATUS.EVENT_CONFLICT: return <EventConflict
            currentEvent={currentEvent!}
            conflictEvents={conflictEvents!}
            deleteEvents={deleteEvents}
            deleteEvent={deleteEvent}
            cancelAction={cancelAction}
        />
        case C.WARNING_STATUS.NONE: return null;
    }

};

export default WarningModal;
