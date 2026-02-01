import { useState, useEffect } from 'react';

/**
 * Components and Hooks must be pure
 *  - Components with side effects should run separetely from rendering
 *  - Has no side effects in render
 *  - Does not mutate non-local values (outside scope))
 * From:
 *  https://react.dev/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent
 * Purity: 
 *  https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch03
 * See
 *  https://react.dev/learn/keeping-components-pure#side-effects-unintended-consequences
 *  https://react.dev/learn/keeping-components-pure#side-effects-unintended-consequences
 */
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