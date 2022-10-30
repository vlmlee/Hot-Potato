import { useState } from 'react';

function usePerfHook() {
    const [log, setLog] = useState([]);

    const obs = new PerformanceObserver(items => {
        console.log(items.getEntries()[0].duration);
        setLog(prev => {
            return [
                ...prev,
                {
                    name: items.getEntries()[0].name,
                    duration: items.getEntries()[0].duration
                }
            ];
        });
        window.performance.clearMarks();
    });
    obs.observe({ type: 'measure' });
    window.performance.measure('Start to Now');

    return log;
}

export default usePerfHook;
