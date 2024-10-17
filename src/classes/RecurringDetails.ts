import { MyDate } from "@/classes/MyDate";
import { eventId } from "@/classes/Event";

export type recurringId = string | null;


export class RecurringDetails {
    private eventIds: Set<eventId>; 
    private startDate: MyDate;
    private endDate: MyDate;
    private selectedDays: boolean[];

    constructor(
        startDate: MyDate,
        endDate: MyDate,
        eventIds: Set<eventId> = new Set(),
        selectedDays: boolean[] = Array(7).fill(false) // Corrected syntax here
    ){
        this.eventIds = eventIds;
        this.startDate = startDate;
        this.endDate = endDate;
        this.selectedDays = selectedDays;
    }

    public getSummary(): string {
        const activeDays: string = this.selectedDays
            .map((isSelected, index) => isSelected ? MyDate.DAYS[index] : null)
            .filter(Boolean)
            .join(', ') || 'None';
    
        return `
        Recurring Details Summary:
        - Event IDs: ${Array.from(this.eventIds).join(', ') || 'No events'}
        - Start Date: ${this.startDate.getStringifiedDate()}
        - End Date: ${this.endDate.getStringifiedDate()}
        - Selected Days: ${activeDays}
        `;
    }
    

    public getEventIds(): Set<eventId> { return this.eventIds; };

    public setEventIds(eventIds: Set<eventId>): void { this.eventIds = eventIds; };

    public getStartDate(): MyDate { return this.startDate; };

    public setStartDate(startDate: MyDate): void { this.startDate = startDate; };

    public getEndDate(): MyDate { return this.endDate; };

    public setEndDate(endDate: MyDate): void { this.endDate = endDate; };

    public addEventId(eventId: eventId): void { this.eventIds.add(eventId); }

    public removeEventId(eventId: eventId): void { this.eventIds.delete(eventId); };

    public getSelectedDays(): boolean[] { return this.selectedDays; };

    public isEventIdsEmpty(): boolean { return this.eventIds.size === 0 };

    public setSelectedDays(selectedDays: boolean[]): void {
        if (!(selectedDays.length === 7)) throw new Error("selectedDays array must contain exactly 7 elements.");
        this.selectedDays = selectedDays;
    }

    public deleteEventId(eventId: eventId): void {
        if (this.eventIds.has(eventId)) this.eventIds.delete(eventId);
    }
}
