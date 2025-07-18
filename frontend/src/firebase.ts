import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDUDnF2IE0l_en82H7u2AcaMaH2lSNpcpw",
  authDomain: "plan-b-ad459.firebaseapp.com",
  projectId: "plan-b-ad459",
  storageBucket: "plan-b-ad459.appspot.com",
  messagingSenderId: "554173840942",
  appId: "1:554173840942:web:123656f183f10d504669bf",
  measurementId: "G-WQ836Y7MJ8"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app); 