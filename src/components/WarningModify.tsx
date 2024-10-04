import React from "react";
import { Event } from "@/utils/classes";
import ConflictEvent from "@/components/ConflictEvent";
import * as S from "@/utils/style.calendar";
import * as C from "@/utils/constants";

const WarningModify: React.FC<{
    currentEvent: Event;
    cancelAction: () => void;
    modifyEvent: () => void;
    modifyEvents: () => void;
}> = ({ currentEvent, cancelAction, modifyEvent, modifyEvents }) => {
    return <React.Fragment>
        {/* <S.WarningMain $center={true}>
            <ConflictEvent event={currentEvent} label={"Current Event"} />
        </S.WarningMain>
        <S.WarningP>
            You’re changing the date of a recurring event.
            Do you want to modify only this occurrence {currentEvent.date.toDateString()}, or modify for all the recurring events?

        </S.WarningP>
        <S.WarningFooter>
            <S.WarningButton
                value={"Only This Event"}
                onClick={modifyEvent}
            />
            <S.WarningButton
                value={"All The Events"}
                onClick={modifyEvents}
            />
            <S.WarningButton
                value={"Cancel"} style={{ backgroundColor: 'lightgray' }}
                onClick={cancelAction}
            />
        </S.WarningFooter> */}
    </React.Fragment>

};

export default WarningModify