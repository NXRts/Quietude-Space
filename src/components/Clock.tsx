'use client';

import { useState, useEffect } from 'react';

export default function Clock() {
    const [time, setTime] = useState(new Date());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!mounted) {
        return <div className="text-zen-muted text-sm font-light tabular-nums">00:00:00</div>;
    }

    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');

    return (
        <div className="flex items-baseline gap-2">
            <div className="text-white text-lg font-medium tabular-nums">
                {hours}:{minutes}
                <span className="text-zen-muted text-sm ml-1 font-light">{seconds}</span>
            </div>
        </div>
    );
}
