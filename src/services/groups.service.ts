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
        });
        this.dbPath = '/user-groups';
        this.groups = this.afDb.list(this.dbPath);
    }

    getGroups(user_id) {
        return this.afDb.list(this.dbPath, ref => {
            return ref.orderByChild("creator").equalTo(user_id);
        });
    };

    addGroup(group: any) {
        return this.groups.push(group);
    }

    removeGroup(group: any) {
        return this.afDb.object(this.dbPath + '/' + group.key).remove();
    }

    searchGroup(name) {
        this.afDb.list(this.dbPath, ref => {
            return ref.orderByChild("name").equalTo(name); });
    }

    addUserToGroup(group, user) {

    }
}