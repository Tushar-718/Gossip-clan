// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJbqpB2Pl3cPYPdlJlxiH56CDJ4laL7kQ",
  authDomain: "gossip-clan.firebaseapp.com",
  projectId: "gossip-clan",
  storageBucket: "gossip-clan.appspot.com",
  messagingSenderId: "190524934956",
  appId: "1:190524934956:web:1679997c532c8ecf9b7a89"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);