const originalConsoleLog = window.console.log; // Preserve the original console.log

const errorHandling = (message, ...restProps) => {
    if (process.env.NODE_ENV === 'development') {
        originalConsoleLog('1', restProps); // Use the preserved originalConsoleLog
    } else {
        originalConsoleLog('2', restProps); // Use the preserved originalConsoleLog
    }
}
window.console.log = errorHandling;
