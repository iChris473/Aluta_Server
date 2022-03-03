
import { initializeApp, getApps, getApp } from "firebase/app";
import {getStorage} from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA-bV1pXQcKj3C_9Nby63eL-E1CxmlbrJM",
    authDomain: "unimeet-f07f9.firebaseapp.com",
    projectId: "unimeet-f07f9",
    storageBucket: "unimeet-f07f9.appspot.com",
    messagingSenderId: "370813903611",
    appId: "1:370813903611:web:ab887523dad5a3e0e5c65e"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig)
const storage = getStorage(app)


  export default storage