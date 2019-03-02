import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook'

@Injectable()
export class AuthService {
    private user: firebase.User;

    constructor(
        public afAuth: AngularFireAuth,
        public googlePlus: GooglePlus,
        public facebook: Facebook,
    ) {
        afAuth.authState.subscribe(user => {
            this.user = user;
        });
    }

    signInWithEmail(credentials): Promise<any> {
        return new Promise((resolve, reject) => {
            this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password).then(res => {
                resolve(res);
            }, err => {
                reject(err);
            });
        });
    }

    signInWithGoogle(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.googlePlus.login({
                'webClientId': '329653030004-qa5j6budfc28sqrdrepaeo9sffklq0d2.apps.googleusercontent.com',
                'offline': true
            }).then(res => {
                const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);

                firebase.auth().signInWithCredential(googleCredential).then(response => {
                    resolve(response)
                }, err => {
                    reject(err);
                });
            }, err => {
                reject(err);
            });
        });
    }

    signInWithFacebook(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.facebook.login(['email']).then(response => {
                const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);

                firebase.auth().signInWithCredential(facebookCredential).then( success => {
                    resolve(success);
                }).catch((error) => {
                    reject(error);
                });
            }).catch((error) => {
                reject(error)
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
