import app from 'firebase/app';
import 'firebase/firebase-firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBbBp0x8XfdXJLKu3yGK6T--a977qGoZ5A",
    authDomain: "homedepotcs420.firebaseapp.com",
    databaseURL: "https://homedepotcs420.firebaseio.com",
    projectId: "homedepotcs420",
    storageBucket: "homedepotcs420.appspot.com",
    messagingSenderId: "817785633491",
    appId: "1:817785633491:web:79e3b37f2745a5d549f226"
};

class FireBaseSetup {
    constructor() {
        app.initializeApp(firebaseConfig);
        this.auth = app.auth();
    }
    async login(email, password) {
        const userLogin = await this.auth.signInWithEmailAndPassword(email, password).catch(err => { console.log(err.code);return err.message })
        
        return userLogin;
    }
    async logout() {
        return await this.auth.signOut();
    }

    async register(email, password) {
        const userRegister = await this.auth.createUserWithEmailAndPassword(email, password).catch(err => { return err.message })
        return userRegister;
    }

   

    displayEmail() {
        if (!this.auth.currentUser) {
            return null; 
        }
        return this.auth.currentUser.email;
    }   
    
    isInitialized() {
        return new Promise(resolve => {
            this.auth.onAuthStateChanged(resolve)
        })
    }
};

export default new FireBaseSetup();