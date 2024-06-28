// Weekly Calendar
import { v4 as uuidv4 } from 'uuid';

class EventProps {
  id: string;
  date: Date;
  startTime: { hours: number; minutes: number };
  endTime: { hours: number; minutes: number };
  title: string;
  description: string;
  height: number;
  color: string;

  constructor(
    date: Date,
    startTime: { hours: number; minutes: number },
    endTime: { hours: number; minutes: number } = {hours: 0, minutes: 0 },
    title: string = "",
    description: string = "",
    height: number = 0,
    color: string = "gray"
  ) {
    this.id = uuidv4();
    this.date = date;
    this.startTime = { hours: startTime.hours, minutes: startTime.minutes };
    this.endTime = { hours: endTime.hours, minutes:endTime.minutes };
    this.title = title;
    this.description = description;
    this.height = height;
    this.color = color;
  }
}

export { EventProps };