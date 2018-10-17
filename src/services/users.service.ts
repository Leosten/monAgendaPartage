import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { map } from 'rxjs/operators';
import { GroupsService } from './groups.service';

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
        public facebook: Facebook,
        public groupsService: GroupsService
    ) {
        afAuth.authState.subscribe(user => {
            this.user = user;
        });
        this.dbPath = '/users';
        this.users = this.afDb.list(this.dbPath);
    }

    getCurrentUser() {
        return this.user;
    }

    searchUsers(query) : Promise<any> {
        return new Promise((resolve, reject) => {
            let users = [];
            const usersPromise = [];

            usersPromise.push(this.getUsersByField('email', query));
            usersPromise.push(this.getUsersByField('display_name', query));

            Promise
            .all(usersPromise)
            .then(usrs => {
                let users_res = [];
                for(let usr of usrs) {
                    for(let us of usr) {
                        users_res.push(us);
                    }
                }
                // Pour enlever les doublons
                let users_unique = [...new Set(users_res)];
                resolve(users_unique);
            })
            .catch(err => {
                reject(err);
            });

        });
    }

    getUsersByField(field, query) : Promise<any> {
        return new Promise((resolve, reject) => {
            let users = [];

            this.afDb.list(this.dbPath, ref => {
                return ref.orderByChild(field).equalTo(query);
            }).snapshotChanges().pipe(
                map(actions =>
                    actions.map(a => ({ key: a.key, ...a.payload.val() }))
                )
            ).subscribe(users_res => {
                resolve(users_res);
            });
        });
    }

    getGroupsMembers(group_id) : Promise<any> {
        return new Promise((resolve, reject) => {
            const usrs_promise = [];

            this.groupsService.getGroupsByField('group_id', group_id).then(res => {
                for(let grp of res) {
                    usrs_promise.push(this.getUsersByField('uid', grp.user_id));
                }
            });

            Promise.all(usrs_promise).then(usrs => {
                let users_res = [];
                for(let usr of usrs) {
                    for(let us of usr) {
                        users_res.push(us);
                    }
                }

                resolve(users_res);
            })
            .catch(err => {
                reject(err);
            });
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
