import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable()
export class GroupsService {
    private user: firebase.User;
    groups: AngularFireList<any[]>;
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
        this.dbPath = '/user-groups';
        this.groups = this.afDb.list(this.dbPath);
        // this.groups = this.afDb.list(this.dbPath);
    }

    getGroups(user_id) {
        // return new Promise<any>((resolve, reject) => {
        return this.afDb.list(this.dbPath, ref => {
            return ref.orderByChild("creator").equalTo(user_id);
        });
        // })
        // .then(
        //   (res) => {
        //     resolve(res)
        //   },
        //   err => reject(err)
        // )
    };

    addGroup(group: any) {
        return this.groups.push(group);
    }

    deleteGroup(group: any) {
        return this.afDb.object(this.dbPath + group.$key).remove();
    }

    searchGroup(name) {
        this.afDb.list(this.dbPath, ref => {
            return ref.orderByChild("name").equalTo(name); });
    }
}
