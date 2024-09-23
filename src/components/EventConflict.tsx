import React, { useState } from "react";
import { Event } from "@/utils/classes";
import WarningEvent from "@/components/WarningEvent";
import * as S from "@/utils/styles";

const EventConflict: React.FC<{
    currentEvent: Event;
    conflictEvents: Event[];
    cancelAction: () => void;
    deleteEvents: () => void;
    deleteEvent: () => void;
}> = ({ currentEvent, conflictEvents, cancelAction, deleteEvents, deleteEvent }) => {
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
    return (
        <S.WarningWrapperDiv>
            <S.WarningContainerDiv>
                <S.WarningHeader>
                    <S.Warningh1>
                        Event Conflict Detected
                    </S.Warningh1>
                </S.WarningHeader>
                <S.WarningMain>
                    <WarningEvent event={currentEvent} label={"Current Event"} />
                    <WarningEvent
                        event={conflictEvents[conflictEventIndex]}
                        label={"Conflict Event"}
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
                            onClick={deleteEvent}
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
            </S.WarningContainerDiv>
        </S.WarningWrapperDiv>
    );
};

export default EventConflict