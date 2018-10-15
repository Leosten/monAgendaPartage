import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable()
export class UsersService {
    private user: firebase.User;
    users: AngularFireList<any[]>;
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
        this.dbPath = '/users';
        this.users = this.afDb.list(this.dbPath);
    }

    searchUserByUid(user_id) {
        return this.afDb.list(this.dbPath, ref => {
            return ref.orderByChild("uid").equalTo(user_id);
        });
    };

    searchUserByQuery(field, query) {
        return this.afDb.list(this.dbPath, ref => {
            return ref.orderByChild(field).equalTo(query);
        });
    }

    addUser(new_user) {
        return this.users.push(new_user);
    }

    deleteGroup(group: any) {
        return this.afDb.object(this.dbPath + group.$key).remove();
    }

    searchGroup(name) {
        this.afDb.list(this.dbPath, ref => {
            return ref.orderByChild("name").equalTo(name); });
    }
}
