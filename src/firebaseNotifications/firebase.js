// Firebase Cloud Messaging Configuration File. 
// Read more at https://firebase.google.com/docs/cloud-messaging/js/client && https://firebase.google.com/docs/cloud-messaging/js/receive

// import { initializeApp } from 'firebase/app';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';
var initializeApp = require('firebase/app');
var { getMessaging, getToken, onMessage } = require('firebase/messaging');
var firebaseConfig = {
  apiKey: "AIzaSyDBfj7do_15tGKt2h79Pj0Disk2hjQPUJI",
  authDomain: "beonline-e166b.firebaseapp.com",
  projectId: "beonline-e166b",
  storageBucket: "beonline-e166b.appspot.com",
  messagingSenderId: "297964282584",
  appId: "1:297964282584:web:17d126d1ce7a17d77bedad",
  measurementId: "G-ZBXFPPZPT1"
};

initializeApp(firebaseConfig);

const messaging = getMessaging();

export const requestForToken = () => {
  return getToken(messaging, { vapidKey: `REPLACE_WITH_YOUR_VAPID_KEY` })
    .then((currentToken) => {
      if (currentToken) {
        console.log('current token for client: ', currentToken);
        // Perform any other neccessary action with the token
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
};

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker `messaging.onBackgroundMessage` handler.
export const onMessageListener = () =>
  new Promise((resolve) => {    
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

  
