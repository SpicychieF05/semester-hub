// Firebase configuration - Demo Mode
// This configuration works without a real Firebase project for demo purposes

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Demo Firebase configuration - safe to commit to GitHub
const firebaseConfig = {
    apiKey: "demo-api-key-for-portfolio",
    authDomain: "semester-hub-demo.firebaseapp.com",
    projectId: "semester-hub-demo",
    storageBucket: "semester-hub-demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "demo-app-id-for-portfolio"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export auth and db for components to use
// Note: These will not work without a real Firebase project
// but allow the app to run and demonstrate the UI/UX
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

// For production deployment with real database:
// 1. Create Firebase project
// 2. Replace config with real values
// 3. Set up environment variables
// 4. Enable Authentication and Firestore
