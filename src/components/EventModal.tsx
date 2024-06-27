"use client";
import React from "react";
import styled from "styled-components";
import Modal from './Modal';
import { EventProps, DAYS } from './WeeklyCalendar';

// Constants 
const COLORS: Array<string> = ["gray", "orange", "pink", "purple", "brown", "blue"];

// Styled Components
const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 100%;
  overflow: auto;
`;

const TimeInput = styled.input.attrs({
  type: 'time',
  step: 60,
})`
  appearance: none;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  padding: 8px;
  width: 100%; 
  box-sizing: border-box; 
`;

const EventDayChecks = styled.input.attrs({
  type: 'checkbox',
})`
`;

const EventSettings = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  color: #fff; /* Assuming white text for visibility */

  & > * {
    margin: 5px 0;
  }
`;

const InputTitle = styled.input.attrs({ placeholder: 'Title' })`
  padding: 10px;
  font-size: 1.2rem;
  width: 100%;
  box-sizing: border-box;
`;

const SelectColor = styled.select`
  padding: 10px;
  font-size: 1.2rem;
  border: 2px solid #d3d3d3;
  background-color: white;
  color: #333;
  width: 100%;
  box-sizing: border-box;
`;

const InputDescription = styled.input.attrs({ placeholder: 'Description' })`
  padding: 10px;
  font-size: 1.2rem;
  width: 100%;
  box-sizing: border-box;
`;

const InputTimeContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const DayLabel = styled.label`
  display: flex;
  align-items: center;
  color: black;
  padding: 10px;
  border-radius: 40%;
`;

const DayText = styled.span`
  margin-left: 5px;
`;

const SaveButton = styled.button.attrs({ type: 'submit' })`
  padding: 10px;
  background-color: #4CAF50; /* Green background */
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  text-align: center;
  flex: 1;
`;

const DeleteButton = styled.button`
  padding: 10px;
  background-color: #f44336; 
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  text-align: center;
  flex: 1;
`;

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
      <ModalContent>
        <EventSettings onSubmit={(e) => handleSubmit(e)}>
          <InputTitle
            value={title}
            onChange={(e) => handleEventChange("title", e.target.value)}
          />

          <InputDescription
            value={description}
            onChange={(e) => handleEventChange("description", e.target.value)}
          />

          <SelectColor
            value={color}
            onChange={(e) => handleEventChange("color", e.target.value)}
          >
            {COLORS.map((color: string, i: number) => 
              <option key={i} value={color}>{color}</option>
            )}
          </SelectColor>

          <InputTimeContainer>
            <TimeInput
              value={`${startTime.hours.toString().padStart(2, '0')}:${startTime.minutes.toString().padStart(2, '0')}`}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':').map(Number);
                handleEventChange("startTime", { hours, minutes });
              }}
            />

            <TimeInput
              value={`${endTime.hours.toString().padStart(2, '0')}:${endTime.minutes.toString().padStart(2, '0')}`}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':').map(Number);
                handleEventChange("endTime", { hours, minutes });
              }}
            />
          </InputTimeContainer>

          <ButtonsContainer>
            {DAYS.map((day, i) => (
              <DayLabel key={i}>
                <EventDayChecks />
                <DayText>{day.charAt(0)}</DayText>
              </DayLabel>
            ))}
          </ButtonsContainer>

          <SaveButton>Save</SaveButton>
          <DeleteButton onClick={() => deleteEvent(currentEvent)}>Delete</DeleteButton>
        </EventSettings>
      </ModalContent>
    </Modal>
  );
};

export default EventModal;
