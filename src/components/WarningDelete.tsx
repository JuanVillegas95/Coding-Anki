import React from "react";
import { Event } from "@/utils/classes";
import ConflictEvent from "@/components/ConflictEvent";
import * as S from "@/utils/styles";
import * as C from "@/utils/constants";

const WarningDelete: React.FC<{
    currentEvent: Event;
    cancelAction: () => void;
    deleteGroupEvents: () => void;
    deleteEvent: () => void;
}> = ({ currentEvent, cancelAction, deleteGroupEvents, deleteEvent }) => {
    return <React.Fragment>
        <S.WarningMain $center={true}>
            <ConflictEvent event={currentEvent} label={"Current Event"} />
        </S.WarningMain>
        <S.WarningP>
            You’re deleting a recurring event.
            Do you want to delete only this occurrence {currentEvent.date.toDateString()}, or delete for all the recurring events?
        </S.WarningP>
        <S.WarningFooter>
            <S.WarningButton
                value={"Delete Only This Event"}
                onClick={deleteEvent}
            />
            <S.WarningButton
                value={"Delete All The Recurring Events"}
                onClick={deleteGroupEvents}
            />
            <S.WarningButton
                value={"Cancel"} style={{ backgroundColor: 'lightgray' }}
                onClick={cancelAction}
            />
        </S.WarningFooter>
    </React.Fragment>

};

export default WarningDelete