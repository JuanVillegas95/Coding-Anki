export type stringifiedDate = string; // YYYY-MM-DD

export class MyDate {
  private date!: Date;

  public static readonly DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

  constructor(param?: Date | boolean | MyDate) {
    if(!param) this.date = new Date(new Date().setHours(0, 0, 0, 0));
    else if (typeof param === "boolean" && true) this.date = this.getMostRecentMonday(); 
    else if (param instanceof Date) this.date = new Date(param.setHours(0,0,0,0));
    else if (param instanceof MyDate) this.date = param.getMyDate();
  }
  
  public getMyDate(): Date { return this.date; };

  public getStringifiedDate(): string { return this.date.toISOString().split('T')[0]; };

  public clone(): MyDate { return new MyDate(this.date); };
  
  public addBy(count: number): void { this.date.setDate(this.date.getDate() + count); };

  public getDay(): number { return (this.date.getDay() === 0) ? 6 : this.date.getDay() - 1; };

  public getMostRecentMonday(): Date {
    const now: Date = new Date(new Date().setHours(0, 0, 0, 0));
    const daysSinceMonday: number = (now.getDay() === 0) ? 6 : now.getDay() - 1; 
    now.setDate(now.getDate() - daysSinceMonday); 
    return now;
  }

  public areDatesTheSame(date: Date): boolean {
    return (
      this.date.getFullYear() === date.getFullYear() &&
      this.date.getMonth() === date.getMonth() &&
      this.date.getDate() === date.getDate()
    );
  }

  public getFormattedMonth(): string {
    const currMonth: string = this.date.toLocaleString("en-US", { month: "short" }); 
    for (let date: MyDate = new MyDate(this.date); date.getDay() === 7; date.addBy(1)) {
      const newMonth: string = date.getMyDate().toLocaleString("en-US", { month: "short" });
      if (currMonth !== newMonth) return `${currMonth} - ${newMonth}`;
    }
    return this.date.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
  }

}


  // // Check if a date should be locked based on the index
  // public static shouldBeLocked(date: string, index: number): boolean {
  //   const utcDate = MyDate.parseDateStringToUTC(date);  
  //   let dayOfTheWeek: number = utcDate.getUTCDay();
  //   if (dayOfTheWeek < 0) dayOfTheWeek = 6;  // Adjust Sunday to 6
  //   return dayOfTheWeek === index;
  // }
