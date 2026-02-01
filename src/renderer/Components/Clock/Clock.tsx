import { useState, useEffect } from 'react';

function useTime(): Date {
    const [time, setTime] = useState(() => new Date());
    useEffect(() => {
        const interval = setInterval(() =>{
            setTime(new Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])
    return time;
}

export default function Clock() {
    const time: Date = useTime();
    return <span>{time.toLocaleString()}</span>
}