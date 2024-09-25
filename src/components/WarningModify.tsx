import React from "react";
import { Event } from "@/utils/classes";
import ConflictEvent from "@/components/ConflictEvent";
import * as S from "@/utils/styles";

const WarningModify: React.FC<{
    currentEvent: Event;
    cancelAction: () => void;
}> = ({ currentEvent, cancelAction }) => {
    return <React.Fragment>
        <S.WarningMain>
            <ConflictEvent event={currentEvent} label={"Current Event"} />
        </S.WarningMain>
        <S.WarningP>
            You’re changing the date of a recurring event.
            Do you want to modify only this occurrence, or modify for all the recurring events?
        </S.WarningP>
        <S.WarningFooter>
            <S.WarningButton
                value={"Only This Event"}
            />
            <S.WarningButton
                value={"All The Events"}
            />
            <S.WarningButton
                value={"Cancel"} style={{ backgroundColor: 'lightgray' }}
                onClick={cancelAction}
            />
        </S.WarningFooter>
    </React.Fragment>

};

export default WarningModify