// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDSLzVVEoWAICptDVJhlsBVTo-kCPp9ZME",
  authDomain: "oceangallery-d06ae.firebaseapp.com",
  projectId: "oceangallery-d06ae",
  storageBucket: "oceangallery-d06ae.appspot.com",
  messagingSenderId: "130362425534",
  appId: "1:130362425534:web:f659e68f53f9aa23379eef",
  measurementId: "G-45LLTVSP98"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch((error) => {
  console.error('Analytics non pris en charge :', error);
});

export { storage, analytics };
