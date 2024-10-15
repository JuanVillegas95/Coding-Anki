import { MyTime } from "@/classes/MyTime";
import React, { useState, useEffect } from "react"
import { HourLineDiv } from "@/utils/style.calendar";
export const HourLine: React.FC = () => {
    const [currTime, setCurrTime] = useState<MyTime>(new MyTime(new Date()));

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrTime(new MyTime(new Date()));
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return <HourLineDiv $fromTop={currTime.getTimeInPixels()} />
}