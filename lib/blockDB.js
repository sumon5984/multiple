const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyBcmtqdJjaKF6N7cfCxkTCz0WVuYI0WCw8",
  authDomain: "block-list-b55e4.firebaseapp.com",
  databaseURL: "https://block-list-b55e4-default-rtdb.firebaseio.com",
  projectId: "block-list-b55e4",
  storageBucket: "block-list-b55e4.appspot.com", 
  messagingSenderId: "993963640752",
  appId: "1:993963640752:web:76ef452ef52c2b8bd87875",
  measurementId: "G-JN86L6EZ0Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

module.exports = { db };