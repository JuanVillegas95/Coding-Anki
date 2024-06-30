"use client";
import React, { Dispatch, SetStateAction } from "react";
import Modal from '@/components/Modal';
import { Event } from '@/utils/classes';
import * as S from "@/styles/EventModal.styles"
import * as CONST from "@/utils/constants"


const EventModal: React.FC<{
  isModalOpen: boolean;
  handleModalClose: () => void;
}> = ({ isModalOpen, handleModalClose }) => {


  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    handleModalClose();
  };


  
  return (
    <Modal show={isModalOpen} handleClose={handleModalClose}>
      <S.ModalContent>
        <S.EventSettings onSubmit={(e) => handleSubmit(e)}>
          <S.InputTitle
          />

          <S.InputDescription
          />

          <S.SelectColor
          >
            {CONST.COLORS.map((color: string, i: number) => 
              <option key={i} value={color}>{color}</option>
            )}
          </S.SelectColor>

          <S.InputTimeContainer>
            <S.TimeInput
            />

            <S.TimeInput
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
          <S.DeleteButton>Delete</S.DeleteButton>
        </S.EventSettings>
      </S.ModalContent>
    </Modal>
  );
};

export default EventModal;
