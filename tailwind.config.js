/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class', // Enable class-based dark mode
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
                },
                // New dark theme color palette
                dark: {
                    primary: '#0B0D0F',      // Main Background
                    secondary: '#121519',    // Secondary Background
                    elevated: '#1A1E23',     // Elevated Surface
                    surface: '#252B33',      // Subtle Surface
                },
                text: {
                    primary: '#E8EAED',      // Primary Text (95% opacity)
                    secondary: '#BDC1C6',    // Secondary Text (75% opacity)
                    muted: '#9AA0A6',        // Muted Text (60% opacity)
                    accent: '#8AB4F8',       // Accent Text
                    'neon-white': '#FFFFFF', // Neon White Text
                },
                accent: {
                    blue: '#1976D2',         // Primary Button
                    'blue-hover': '#1565C0', // Primary Button Hover
                    'secondary-btn': '#2D3748', // Secondary Button
                    'secondary-hover': '#4A5568', // Secondary Button Hover
                    success: '#388E3C',      // Success state
                    'success-light': '#81C784', // Success light variant
                    warning: '#F57C00',      // Warning state
                    'warning-light': '#FFB74D', // Warning light variant
                    error: '#D32F2F',        // Error state
                    'error-light': '#EF5350', // Error light variant
                    info: '#1976D2',         // Info state
                    'info-light': '#64B5F6', // Info light variant
                },
                link: {
                    default: '#64B5F6',      // Link Color
                    hover: '#90CAF9',        // Link Hover
                    active: '#2196F3',       // Active State
                    focus: '#42A5F5',        // Focus Ring
                },
                border: {
                    primary: '#2F3439',      // Primary Border
                    subtle: '#1F2327',       // Subtle Border
                    strong: '#404652',       // Strong Border
                },
                subject: {
                    science: '#4CAF50',      // Science
                    math: '#FF9800',         // Mathematics
                    literature: '#9C27B0',   // Literature
                    technology: '#2196F3',   // Technology
                    general: '#607D8B',      // General
                },
                glass: {
                    card: 'rgba(26, 30, 35, 0.8)',      // Glass Card
                    modal: 'rgba(11, 13, 15, 0.9)',     // Modal Background
                    nav: 'rgba(18, 21, 25, 0.95)',      // Navigation Glass
                    border: 'rgba(255, 255, 255, 0.1)', // Glass Effect Border
                }
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
            },
            transitionDuration: {
                '600': '600ms',
                '800': '800ms',
                '1000': '1000ms',
            },
            transitionTimingFunction: {
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
                'theme': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
            },
            textShadow: {
                'glow-sm': '0 0 10px rgba(255, 255, 255, 0.5)',
                'glow': '0 0 20px rgba(255, 255, 255, 0.7)',
                'glow-lg': '0 0 30px rgba(255, 255, 255, 0.8)',
                'glow-blue': '0 0 20px rgba(59, 130, 246, 0.8)',
                'glow-blue-lg': '0 0 30px rgba(59, 130, 246, 0.9)',
                'glow-accent': '0 0 25px rgba(25, 118, 210, 0.8)',
                'glow-neon': '0 0 15px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.8)',
                'glow-neon-blue': '0 0 15px rgba(100, 181, 246, 1), 0 0 30px rgba(100, 181, 246, 0.8)',
            },
            boxShadow: {
                'glow': '0 0 30px rgba(255, 255, 255, 0.3)',
                'glow-blue': '0 0 30px rgba(59, 130, 246, 0.4)',
                'glow-accent': '0 0 25px rgba(25, 118, 210, 0.4)',
            },
        },
    },
    plugins: [
        function ({ addUtilities }) {
            const newUtilities = {
                '.text-shadow-glow-sm': {
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                },
                '.text-shadow-glow': {
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.7)',
                },
                '.text-shadow-glow-lg': {
                    textShadow: '0 0 30px rgba(255, 255, 255, 0.8)',
                },
                '.text-shadow-glow-blue': {
                    textShadow: '0 0 20px rgba(59, 130, 246, 0.8)',
                },
                '.text-shadow-glow-blue-lg': {
                    textShadow: '0 0 30px rgba(59, 130, 246, 0.9)',
                },
                '.text-shadow-glow-accent': {
                    textShadow: '0 0 25px rgba(25, 118, 210, 0.8)',
                },
                '.text-shadow-glow-neon': {
                    textShadow: '0 0 15px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.8)',
                },
                '.text-shadow-glow-neon-blue': {
                    textShadow: '0 0 15px rgba(100, 181, 246, 1), 0 0 30px rgba(100, 181, 246, 0.8)',
                },
            }
            addUtilities(newUtilities)
        }
    ],
}
