import React, { useState } from 'react';
import { Event } from '@/utils/classes';
import { ConflictStatus } from "@/components/ConflictStatus"
import WarningModify from "@/components/WarningModify"
import WarningDelete from "@/components/WarningDelete"
import { STATUS } from '@/utils/constants';
import { BigTextP, ContainerDiv, ModalContainerDiv, ModalWrapperDiv } from '@/utils/style.base';

export const StatusModal: React.FC<{
    status: STATUS,
    conflictDetails: [Event, Event[]];
    cancelEventRevisions: () => void;
    commitEventRevisions: () => void;
}> = ({ status, conflictDetails, cancelEventRevisions, commitEventRevisions }) => {
    return <WarningLayout label={status}>
        <div></div>
        {status === STATUS.EVENT_CONFLICT && <ConflictStatus
            conflictDetails={conflictDetails}
            cancelEventRevisions={cancelEventRevisions}
            commitEventRevisions={commitEventRevisions}
        />}
    </WarningLayout>
};


const WarningLayout: React.FC<{
    children: React.ReactNode; label: string
}> = ({ children, label }) => <ModalWrapperDiv $zIndex={3}>
    <ModalContainerDiv $padding="20px" $width="600px" $isBorder={true}>
        <ContainerDiv
            style={{ borderBottom: "1px solid lightgray" }}
            $direction="row" $padding="10px" $isBorderRad={false}
            $justifyContent="center"
        >
            <BigTextP >
                {label}
            </BigTextP>
        </ContainerDiv>
        {children}
    </ModalContainerDiv>
</ModalWrapperDiv>


