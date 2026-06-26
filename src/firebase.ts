import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { AdminSettings } from './types';

const firebaseConfig = {
  apiKey: "AIzaSyBKR-3QcLsHIp0qUcA7UJsPeJE8KeR0jtg",
  authDomain: "gen-lang-client-0743353563.firebaseapp.com",
  projectId: "gen-lang-client-0743353563",
  storageBucket: "gen-lang-client-0743353563.firebasestorage.app",
  messagingSenderId: "901357414458",
  appId: "1:901357414458:web:6bb523529a75299a9ced03"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-67742997-e604-4965-bd7c-2e8a9cef16d2");

// Default admin settings - initialized once if not existing
const DEFAULT_SETTINGS: Omit<AdminSettings, 'id'> = {
  centerName: 'Gia Sư Thành Đạt',
  centerPhone: '',
  centerEmail: '',
  centerAddress: 'Hà Nội',
  geminiApiKey: '',
  zaloNumber: '',
  facebookUrl: '',
  updatedAt: Date.now(),
};

export async function initSettingsIfEmpty(): Promise<void> {
  try {
    const snap = await getDocs(collection(db, 'settings'));
    if (snap.empty) {
      await setDoc(doc(db, 'settings', 'admin'), DEFAULT_SETTINGS);
    }
  } catch (err) {
    console.error('Error initializing settings:', err);
  }
}
