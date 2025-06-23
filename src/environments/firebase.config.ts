import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAOfNb5AHvQ3Csq0Pt6pFedfSqYwZqsPFI",
  authDomain: "ionictest-b7f4a.firebaseapp.com",
  projectId: "ionictest-b7f4a",
  storageBucket: "ionictest-b7f4a.firebasestorage.app",
  messagingSenderId: "816703582639",
  appId: "1:816703582639:web:b03ea6544ec6a86f443f5a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };