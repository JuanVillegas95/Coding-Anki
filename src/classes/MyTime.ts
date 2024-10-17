export type hoursMinutes = { hours: number, minutes: number };
export type pixels = number;

export class MyTime {
  private hours!: number;
  private minutes!: number;

  public static readonly HOURS_HEIGHT_PIXELS: number = 70; 
  public static readonly HOURS_WIDTH_PIXELS: number= 60; 
  public static readonly ONE_YEAR_IN_MS: number = 365 * 24 * 60 * 60 * 1000;

  constructor(time: hoursMinutes | Date | pixels = 0) {     
    if (typeof time === "number") {
      const newTime: hoursMinutes = this.pixelsToTime(time);
      this.setHours(newTime.hours);
      this.setMinutes(newTime.minutes);
    } 
    else if (time instanceof Date) {
      this.setHours(time.getHours());
      this.setMinutes(time.getMinutes());
    } 
    else {
      this.setHours(time.hours);  
      this.setMinutes(time.minutes); 
    };
 };

  public getSummary(): string { return `- Hours: ${this.hours} Minutes: ${this.minutes}`; };
  
  public getHours(): number { return this.hours; };
  
  public getMinutes(): number { return this.minutes; ;}

  public getTime(): hoursMinutes { return { hours: this.hours, minutes: this.minutes}; };

  public getTimeInMinutes(): number { return this.hoursToMinutes(this.hours) + this.minutes; };

  public getTimeInPixels(): pixels { return this.hoursToPixels(this.hours + this.minutesToHours(this.minutes)); };

  public clone(): MyTime { return new MyTime({ hours: this.hours, minutes: this.minutes }); };

  public pixelsToHours(pixels: pixels): number { return pixels / MyTime.HOURS_HEIGHT_PIXELS; };

  public minutesToHours(minutes: number): number { return minutes / 60; };

  public hoursToMinutes(hours: number): number { return hours * 60; };

  public hoursToPixels(hours: number): number { return hours * MyTime.HOURS_HEIGHT_PIXELS; };

  public static formatTime(unit: number): string { return unit < 10 ? `0${unit}` : `${unit}`; };
  
  public setHours(hours: number): void {
    if (hours < 0) { this.hours = 0; return; }
    if (hours >= 24) {this.hours = 23; return; };
    this.hours = hours;  
  }

  public setMinutes(minutes: number): void {
      if (minutes < 0) { this.minutes = 0; return; }
      if (minutes >= 60) { this.minutes = 59; return; }
      this.minutes = minutes;  
  }

  private pixelsToTime(distanceFromTop: pixels): hoursMinutes {
    const totalHours: number = this.pixelsToHours(distanceFromTop);
    const totalMinutes: number = Math.round(this.hoursToMinutes(totalHours));  
    const hours: number = Math.floor(this.minutesToHours(totalMinutes));  
    const minutes: number = totalMinutes % 60;
    return { hours, minutes };
  }

  // Static method to generate an array of 24-hour formatted time intervals
  public static generate24HourIntervals(): string[] {
    const timeArray: string[] = [];
    for (let i = 0; i < 24; i++) {
      const formattedTime: string = MyTime.formatTime(i);
      timeArray.push(`${formattedTime}:00`);
      timeArray.push(`${formattedTime}:30`);
    }
    return timeArray;
  }
  // Static method to generate an array of 24-hour formatted times
  public static generate24Hours(): string[] {
    const hourArray: string[] = [];
    for (let i = 0; i < 24; i++) {
      hourArray.push(MyTime.formatTime(i));
    }
    return hourArray;
  }

  // Static method to generate an array of 60-minute formatted times
  public static generate60Minutes(): string[] {
    const minutesArray: string[] = [];
    for (let i = 0; i < 60; i++) {
      minutesArray.push(MyTime.formatTime(i));
    }
    return minutesArray;
  }
}

// export const calculateTimeOnDrag = (
//   e: React.MouseEvent<HTMLDivElement, MouseEvent>,
//   columnDivRef: React.RefObject<HTMLDivElement>,
//   event: Event
// ): [Time, Time] => {
//   // Destructuring to extract start and end times
//   let { hours: startHour, minutes: startMinutes } = event.start;
//   let { hours: endHour, minutes: endMinutes } = event.end;

//   // Calculate the distance from the top of the column to the mouse position
//   const columnTop = columnDivRef.current!.getBoundingClientRect().top;
//   const distanceFromTop = e.clientY - columnTop - event.height / 2;

//   // Convert distance to hours and minutes
//   const startHoursTotal = pixelsToHours(distanceFromTop);
//   const startMinutesTotal = Math.floor(hoursToMinutes(startHoursTotal));

//   const heightHoursTotal = pixelsToHours(event.height);
//   const heightMinutesTotal = Math.floor(hoursToMinutes(heightHoursTotal));

//   // Calculate total minutes for the end time
//   const endMinutesTotal = heightMinutesTotal + startMinutesTotal;

//   // Ensure the calculated times are within a valid range (0-23 hours)
//   const newStartHour = Math.floor(minutesToHours(startMinutesTotal));
//   const newEndHour = Math.floor(minutesToHours(endMinutesTotal));

//   if (newEndHour <= 23 && newStartHour >= 0) {
//     // Update end time values
//     endHour = newEndHour;
//     endMinutes = endMinutesTotal % 60;

//     // Update start time values
//     startHour = newStartHour;
//     startMinutes = startMinutesTotal % 60;
//   }

//   // Return the updated start and end times
//   return [new Time(startHour, startMinutes), new Time(endHour, endMinutes)];
// };
