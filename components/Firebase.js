import * as firebase from 'firebase';
import "firebase/firestore";
import "firebase/auth"

var firebaseConfig = {
    apiKey: "AIzaSyAjCDzz6DmBA5jrn5lUIcLERKT6uohfc8w",
    authDomain: "chat-app-7283d.firebaseapp.com",
    projectId: "chat-app-7283d",
    storageBucket: "chat-app-7283d.appspot.com",
    messagingSenderId: "246724373305",
    appId: "1:246724373305:web:21131a0799ecacf89f16e8",
    measurementId: "G-2K62QGNL24"
  };

  let firebaseApp;

  if(firebase.apps.length === 0){
      firebaseApp = firebase.initializeApp(firebaseConfig);
  } else {
      firebaseApp = firebase.app();
  }

  const db = firebaseApp.firestore();
  const auth = firebaseApp.auth();

  export {db, auth, firebase};