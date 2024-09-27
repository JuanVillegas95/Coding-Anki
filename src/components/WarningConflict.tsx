import React, { useState } from "react";
import { Event } from "@/utils/classes";
import ConflictEvent from "@/components/ConflictEvent";
import * as S from "@/app/styles/dashboard";

const WarningConflict: React.FC<{
    currentEvent: Event;
    conflictEvents: Event[];
    cancelAction: () => void;
    deleteEvents: () => void;
}> = ({ currentEvent, conflictEvents, cancelAction, deleteEvents }) => {
    const [conflictEventIndex, setConflictEventIndex] = useState<number>(0)
    const conflictCount: number = conflictEvents.length;
    const areConflicts: boolean = conflictCount > 1;

    const moveRight = (): void => {
        setConflictEventIndex((prev) => {
            if (prev === conflictCount - 1) return 0;
            else return prev + 1;
        })
    }

    const moveLeft = (): void => {
        setConflictEventIndex((prev) => {
            if (prev === 0) return conflictCount - 1;
            else return prev - 1;
        })
    }
    return <React.Fragment>
        <S.WarningMain $center={false}>
            <ConflictEvent event={currentEvent} label={"Current Event"} />
            <ConflictEvent
                event={conflictEvents[conflictEventIndex]}
                label={areConflicts ? "Conflict Events" : "Conflict Event"}
                areConflicts={areConflicts}
                moveLeft={moveLeft}
                moveRight={moveRight}
            />
        </S.WarningMain>
        {!areConflicts
            ? <S.WarningP>
                There is a conflicting event already scheduled at the time and date where you want to modify or create a new event.
            </S.WarningP>
            : <S.WarningP>
                There are {conflictCount} conflicting events already scheduled at the time and date where you want to modify or create a new event.
            </S.WarningP>}
        <S.WarningFooter>
            {!areConflicts
                ? <S.WarningButton
                    value={"Delete Conflicting Event"}
                    onClick={deleteEvents}
                />
                : <S.WarningButton
                    value={`Delete All ${conflictCount} Conflicting Events`}
                    onClick={deleteEvents}
                />}
            <S.WarningButton
                value={"Cancel"} style={{ backgroundColor: 'lightgray' }}
                onClick={cancelAction}
            />
        </S.WarningFooter>
    </React.Fragment>

};

export default WarningConflict