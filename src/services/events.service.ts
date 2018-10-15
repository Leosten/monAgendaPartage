import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable()
export class EventsService {
    private user: firebase.User;
    events: AngularFireList<any[]>;
    dbPath: any;
    user_id: any;

    constructor(
        public afAuth: AngularFireAuth,
        public afDb: AngularFireDatabase,
        public googlePlus: GooglePlus,
        public facebook: Facebook
    ) {
        afAuth.authState.subscribe(user => {
            this.user = user;
            // console.log(this.user);
        });
        // this.user_id = this.afAuth.auth.currentUser.uid;
        // console.log(this.user_id);
        this.dbPath = '/user-events';
        this.events = this.afDb.list(this.dbPath);
        // this.groups = this.afDb.list(this.dbPath);
    }

    getEvents(user_id) {
        return this.afDb.list(this.dbPath, ref => {
            return ref.orderByChild("user_uid").equalTo(user_id);
        });
    };
}
