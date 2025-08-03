import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const useVantaGlobe = () => {
    const vantaRef = useRef(null);
    const vantaEffect = useRef(null);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        // Only initialize if we're in dark mode and have the necessary libraries
        if (isDarkMode && vantaRef.current) {
            // Wait for libraries to load
            const initVanta = () => {
                if (window.VANTA && window.THREE) {
                    // Destroy existing effect if it exists
                    if (vantaEffect.current) {
                        vantaEffect.current.destroy();
                    }

                    try {
                        // Initialize Vanta Globe effect
                        vantaEffect.current = window.VANTA.GLOBE({
                            el: vantaRef.current,
                            mouseControls: true,
                            touchControls: true,
                            gyroControls: false,
                            minHeight: 200.00,
                            minWidth: 200.00,
                            scale: 1.00,
                            scaleMobile: 1.00,
                            color: 0x4F6299,      // Using our academic accent blue
                            backgroundColor: 0x0B0D0F, // Using our dark primary background
                            size: 1.20,
                            spacing: 15.00,
                            forceAnimate: true
                        });
                    } catch (error) {
                        console.warn('Failed to initialize Vanta Globe:', error);
                    }
                } else {
                    // Libraries not loaded yet, try again after a short delay
                    setTimeout(initVanta, 100);
                }
            };

            initVanta();
        } else {
            // Clean up effect when switching to light mode
            if (vantaEffect.current) {
                vantaEffect.current.destroy();
                vantaEffect.current = null;
            }
        }

        // Cleanup function
        return () => {
            if (vantaEffect.current) {
                try {
                    vantaEffect.current.destroy();
                    vantaEffect.current = null;
                } catch (error) {
                    console.warn('Error destroying Vanta effect:', error);
                }
            }
        };
    }, [isDarkMode]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (vantaEffect.current) {
                try {
                    vantaEffect.current.destroy();
                } catch (error) {
                    console.warn('Error cleaning up Vanta effect:', error);
                }
            }
        };
    }, []);

    return vantaRef;
};

export default useVantaGlobe;
