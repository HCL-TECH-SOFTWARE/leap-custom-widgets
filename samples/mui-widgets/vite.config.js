import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => {
    console.log('command:', command);
    console.log('mode:', mode);

    if (mode === 'production') {
        return {
            // Ensures relative paths to .svg icons.
            // Unfortunately, this doesn't work in development mode, so icons are not displayed
            base: './',
        }
    }
    return {};
});