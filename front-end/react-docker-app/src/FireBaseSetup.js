import app from 'firebase/app';
import 'firebase/firebase-firestore';
import 'firebase/auth';
import { Link, Redirect } from 'react-router-dom';

//require('firebase/auth');
const firebaseConfig = {
    apiKey: "AIzaSyCZZvTvNeWnROBw0qwRDjSTDu7eT3HPn5w",
    authDomain: "homedepotweb.firebaseapp.com",
    databaseURL: "https://homedepotweb.firebaseio.com",
    projectId: "homedepotweb",
    storageBucket: "homedepotweb.appspot.com",
    messagingSenderId: "356352630003",
    appId: "1:356352630003:web:fa3427779ae8ab6eb16b86",
    measurementId: "G-NZLWZL94D1"
};

class FireBaseSetup {
    constructor() {
        app.initializeApp(firebaseConfig);
        this.auth = app.auth();
    }
     login(email, password) {
        return   this.auth.signInWithEmailAndPassword(email,password)
    }
    logout() {
        this.auth.signOut();
    }

    async register(email, password) {
        this.auth.createUserWithEmailAndPassword(email, password);
        return this.auth.currentUser.updateProfile({displayName:email})
    }

    displayEmail() {
        if (!this.auth.currentUser) {
            return null; 
        }
        return this.auth.currentUser.email;
    }   
    getUserEmail() {
        return this.auth.currentUser && this.auth.currentUser.displayName;
    }
    isInitialized() {
        return new Promise(resolve => {
            this.auth.onAuthStateChanged(resolve)
        })
    }
};

export default new FireBaseSetup();