import React from "react";
import LongEvent from "@/components/LongEvent";
import { Event } from "@/utils/classes";
import * as I from "@/utils/icons";
import * as S from "@/utils/style.calendar";
import * as C from "@/utils/constants";
import * as F from "@/utils/functions";
import { ContainerDiv, ClickableSvgDiv, MedTextP } from "@/utils/style.base";

const ConflictEvent: React.FC<{
    event: Event;
    label: string;
    areConflicts?: boolean;
    moveRight?: () => void;
    moveLeft?: () => void;
}> = ({ event, label, areConflicts, moveRight, moveLeft }) => {
    const { id, height, start, end, duration, color, icon, title, description, groupId, isFriendEvent } = event;
    const borderStyle: string = groupId ? "solid" : "dotted";

    // Style to override the existing style from EventDiv
    const warningStyle: React.CSSProperties = {
        position: "static",
        width: "150px",
        cursor: "default",
    }

    return <ContainerDiv $direction="column" $justifyContent="center" $alignItems="center" $gap="10px">
        <ContainerDiv $direction="row" $alignItems="center" $wrap="wrap"  >
            {areConflicts && <ClickableSvgDiv $svgSize="20px" $size="30px" $isBackgroundGrey={true} onClick={moveLeft}>
                {React.createElement(I.left)}
            </ClickableSvgDiv>}
            <MedTextP>{label}</MedTextP>
            {areConflicts && <ClickableSvgDiv $svgSize="20px" $size="30px" $isBackgroundGrey={true} onClick={moveRight} >
                {React.createElement(I.right)}
            </ClickableSvgDiv>}
        </ContainerDiv>
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
    </ContainerDiv>
};

export default ConflictEvent;