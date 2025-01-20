import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAa0lkIeOIaGTSakooxWY5ZyF2f8D3hlFA",
  authDomain: "ent-shatibi.firebaseapp.com",
  projectId: "ent-shatibi",
  storageBucket: "ent-shatibi.firebasestorage.app",
  messagingSenderId: "485660159823",
  appId: "1:485660159823:web:53e7411206f21b82e01f3a",
  measurementId: "G-V75R5V2NBH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export default app;
