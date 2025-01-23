// services/firebaseConfig.js

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

//Removed firebase config, add API keys here.

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export Firebase services for use in your app
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export default firebase;
