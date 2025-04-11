// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDZFaF1dcoFSeVJFVJ3N8tKslVGcJ6zy94",
    authDomain: "eventorganizerapp-5c072.firebaseapp.com",
    projectId: "eventorganizerapp-5c072",
    storageBucket: "eventorganizerapp-5c072.firebasestorage.app",
    messagingSenderId: "367421196900",
    appId: "1:367421196900:web:988c132c2c6e50bb1f2d71"
  };

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});


export const db = getFirestore(app);
