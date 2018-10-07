import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus';

@Injectable()
export class AuthService {
    private user: firebase.User;

    constructor(
        public afAuth: AngularFireAuth,
        public googlePlus: GooglePlus,
    ) {
        afAuth.authState.subscribe(user => {
            this.user = user;
        });
    }

    signInWithEmail(credentials) {
        return this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
    }

    signInWithGoogle(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.googlePlus.login({
                'webClientId': '329653030004-cta6l793k4o2acvi8fp6ti015h8vcs19.apps.googleusercontent.com',
                'offline': true
            }).then(res => {
                const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);

                firebase.auth().signInWithCredential(googleCredential)
                .then(response => {
                    console.log("Firebase success: " + JSON.stringify(response));
                    resolve(response)
                });
            }, err => {
                console.error("Error: ", err)
                reject(err);
            });
        });
    }

    signUp(credentials) {
        return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
    }

    get authenticated(): boolean {
      return this.user !== null;
    }

    getEmail() {
      return this.user && this.user.email;
    }

    signOut(): Promise<void> {
      return this.afAuth.auth.signOut();
    }
}
