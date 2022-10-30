import { PerformanceObserver, performance } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
    console.log(items.getEntries()[0].duration);
    performance.clearMarks();
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');
