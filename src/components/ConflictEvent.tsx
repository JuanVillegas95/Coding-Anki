import React from "react";
import LongEvent from "@/components/LongEvent";
import { Event } from "@/utils/classes";
import * as I from "@/utils/icons";
import * as S from "@/utils/styles";
import * as C from "@/utils/constants";
import * as F from "@/utils/functions";

const ConflictEvent: React.FC<{
    event: Event;
    label: string;
    areConflicts?: boolean;
    moveRight?: () => void;
    moveLeft?: () => void;
}> = ({ event, label, areConflicts, moveRight, moveLeft }) => {
    const { id, height, start, end, duration, color, icon, title, description, groupID, isFriendEvent } = event;
    const borderStyle: string = groupID ? "solid" : "dotted";

    // Style to override the existing style from EventDiv
    const warningStyle: React.CSSProperties = {
        position: "static",
        width: "150px",
        cursor: "default",
    }

    return (
        <S.WarrningEventWrapperDiv>
            <S.WarningEventsWarningDiv >
                {areConflicts && <S.WarningIconDiv $svgSize={15} $size={25} $color={"black"} onClick={moveLeft}>
                    {React.createElement(I.left)}
                </S.WarningIconDiv>}
                <S.WarrningEventh2>{label}</S.WarrningEventh2>
                {areConflicts && <S.WarningIconDiv $svgSize={15} $size={25} $color={"black"} onClick={moveRight} >
                    {React.createElement(I.right)}
                </S.WarningIconDiv>}
            </S.WarningEventsWarningDiv>
            <S.EventDiv
                key={id}
                $fromTop={0}
                $height={200}
                $backgroundColor={C.COLORS[color].secondary}
                $borderColor={C.COLORS[color].primary}
                $isDragged={false}
                style={warningStyle}
                $borderStyle={borderStyle}
                $isFriendEvent={false}
                $isLinked={false}
            >
                <S.EventTopDiv $color={C.COLORS[color].primary} />
                <S.EventBodyDiv>
                    <LongEvent
                        color={color}
                        startHours={F.formatTime(start.hours)}
                        startMinutes={F.formatTime(start.minutes)}
                        endHours={F.formatTime(end.hours)}
                        endMinutes={F.formatTime(end.minutes)}
                        icon={icon}
                        title={title}
                        description={description}
                        isLinked={false}
                    />
                </S.EventBodyDiv>
                <S.EventBottomDiv />
            </S.EventDiv>
        </S.WarrningEventWrapperDiv>
    );
};

export default ConflictEvent;