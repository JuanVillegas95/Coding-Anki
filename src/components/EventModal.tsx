"use client";
import React from "react";
import Modal from '@/components/Modal';
import { EventProps } from '@/utils/classes';
import * as S from "@/styles/EventModal.styles"
import * as CONST from "@/utils/constants"


const EventModal: React.FC<{
  isModalOpen: boolean;
  currentEvent: EventProps | null;
  deleteEvent: (event: EventProps) => void;
  updateCurrentEvent: () => void;
  handleModalClose: () => void;
  handleEventChange: (key: keyof EventProps, value: any) => void;
}> = ({ isModalOpen, currentEvent, deleteEvent, updateCurrentEvent, handleModalClose, handleEventChange }) => {

  if (!currentEvent) return null;
  const { title, description, color, startTime, endTime } = currentEvent;

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    updateCurrentEvent();
    handleModalClose();
  };

  return (
    <Modal show={isModalOpen} handleClose={handleModalClose}>
      <S.ModalContent>
        <S.EventSettings onSubmit={(e) => handleSubmit(e)}>
          <S.InputTitle
            value={title}
            onChange={(e) => handleEventChange("title", e.target.value)}
          />

          <S.InputDescription
            value={description}
            onChange={(e) => handleEventChange("description", e.target.value)}
          />

          <S.SelectColor
            value={color}
            onChange={(e) => handleEventChange("color", e.target.value)}
          >
            {CONST.COLORS.map((color: string, i: number) => 
              <option key={i} value={color}>{color}</option>
            )}
          </S.SelectColor>

          <S.InputTimeContainer>
            <S.TimeInput
              value={`${startTime.hours.toString().padStart(2, '0')}:${startTime.minutes.toString().padStart(2, '0')}`}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':').map(Number);
                handleEventChange("startTime", { hours, minutes });
              }}
            />

            <S.TimeInput
              value={`${endTime.hours.toString().padStart(2, '0')}:${endTime.minutes.toString().padStart(2, '0')}`}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':').map(Number);
                handleEventChange("endTime", { hours, minutes });
              }}
            />
          </S.InputTimeContainer>

          <S.ButtonsContainer>
            {CONST.DAYS.map((day, i) => (
              <S.DayLabel key={i}>
                <S.EventDayChecks />
                <S.DayText>{day.charAt(0)}</S.DayText>
              </S.DayLabel>
            ))}
          </S.ButtonsContainer>

          <S.SaveButton>Save</S.SaveButton>
          <S.DeleteButton onClick={() => deleteEvent(currentEvent)}>Delete</S.DeleteButton>
        </S.EventSettings>
      </S.ModalContent>
    </Modal>
  );
};

export default EventModal;
