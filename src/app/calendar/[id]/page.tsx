
"use client";
import CalendarHub from "@/components/CalendarHub"

export default function Dashboard({ params }: { params: { id: string } }) {
    return <CalendarHub params={params} />;
}