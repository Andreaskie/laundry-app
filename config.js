import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBiDR9LFVqY04oyaWefZrvGRhSGOlZ5SrQ",
    authDomain: "laundry-app-80707.firebaseapp.com",
    projectId: "laundry-app-80707",
    storageBucket: "laundry-app-80707.appspot.com",
    messagingSenderId: "614362439551",
    appId: "1:614362439551:web:daea048c8695b5b3a8c44a",
    measurementId: "G-201WNTS1C7"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
