import dayjs from "dayjs";
import {useEffect, useState} from "react";


export default function useCountDown(expiredAt?: string | null){
    const [timeLeft, setTimeLeft] = useState<number | null>(() => {
        if (!expiredAt) return null;
        return dayjs(expiredAt).diff(dayjs(), "second");
    });

    useEffect(() => {
        if (!expiredAt) return; // không set interval khi null

        const interval = setInterval(() => {
            setTimeLeft(dayjs(expiredAt).diff(dayjs(), "second"));
        }, 1000);

        return () => clearInterval(interval);
    }, [expiredAt]);

    if (timeLeft === null) {
        return { timeLeft: null, formatted: null };
    }

    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    return {
        timeLeft,
        formatted: `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
    };
}