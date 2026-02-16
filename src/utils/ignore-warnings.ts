const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
    const message = typeof args[0] === 'string' ? args[0] : '';
    if (message.includes('SafeAreaView has been deprecated')) return;
    originalWarn(...args);
};
