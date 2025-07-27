/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        screens: {
            'xs': '475px',      // Extra small devices (large phones)
            'sm': '640px',      // Small devices (tablets)
            'md': '768px',      // Medium devices (small laptops)
            'lg': '1024px',     // Large devices (laptops/desktops)
            'xl': '1280px',     // Extra large devices (large desktops)
            '2xl': '1536px',    // 2X large devices (larger desktops)
            // Custom breakpoints for specific device targeting
            'mobile': { 'max': '640px' },
            'tablet': { 'min': '641px', 'max': '1023px' },
            'desktop': { 'min': '1024px' },
        },
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                secondary: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                }
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
            },
        },
    },
    plugins: [],
}
