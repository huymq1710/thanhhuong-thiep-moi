import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Kiểm tra nếu có đủ config cần thiết
const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.projectId;

export const firebaseApp = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const realtimeDb = firebaseApp && firebaseConfig.databaseURL ? getDatabase(firebaseApp) : null;
