import React, { useState } from "react";
import { Event } from "@/utils/classes";
import ConflictEvent from "@/components/ConflictEvent";
import * as S from "@/utils/style.calendar";
import { ButtonInput, ContainerDiv, MedTextP } from "@/utils/style.base";

export const ConflictStatus: React.FC<{
    conflictDetails: [Event, Event[]];
    cancelStatus: () => void;
    commitEventRevisions: () => void;
}> = ({ conflictDetails, cancelStatus, commitEventRevisions }) => {
    const [conflictEventIndex, setConflictEventIndex] = useState<number>(0);
    const [eventToSet, conflictingEvents]: [Event, Event[]] = conflictDetails;

    const conflictCount: number = conflictingEvents.length;
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
        <ContainerDiv $direction="row" $wrap="nowrap" $justifyContent="space-between" $padding="15px 30px">
            <ConflictEvent event={eventToSet} label={"Current Event"} />
            <ConflictEvent
                event={conflictingEvents[conflictEventIndex]}
                label={areConflicts ? "Conflict Events" : "Conflict Event"}
                areConflicts={areConflicts}
                moveLeft={moveLeft}
                moveRight={moveRight}
            />
        </ContainerDiv>
        <MedTextP>
            {`There ${areConflicts ? "are" : "is"} ${areConflicts ? conflictCount + " conflicting events" : "a conflicting event"} already scheduled at the time and date where you want to modify or create a new event.`}
        </MedTextP>
        <ContainerDiv $direction="column" $justifyContent="center" $alignItems="center" $gap="20px" $padding="20px 0 0 0">
            <ButtonInput
                $text={areConflicts ? `Delete All ${conflictCount} Conflicting Events` : "Delete Conflicting Event"}
                $width="400px"
                $padding="20px"
                onClick={commitEventRevisions}
            />
            <ButtonInput
                $text="Cancel"
                $width="400px"
                $padding="20px"
                onClick={cancelStatus}
            />
        </ContainerDiv>
    </React.Fragment>

};
