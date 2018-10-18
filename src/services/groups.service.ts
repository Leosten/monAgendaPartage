import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@Injectable()
export class GroupsService {
    private user: firebase.User;
    groups: AngularFireList<any[]>;
    main_groups: AngularFireList<any[]>;
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
        this.main_groups = this.afDb.list('/groups');
        this.groups = this.afDb.list(this.dbPath);
    }

    getMyGroups() : Promise<any> {
        return new Promise((resolve, reject) => {
            this.getGroupsByField('user_id', this.user.uid).then(grps => {
                let groups_res = [];
                if (grps.length !== 0) {
                    for(let grp of grps) {
                        if (grp.status === 'accepted') {
                            groups_res.push(grp);
                        }
                    }
                }
                resolve(groups_res);
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    getPendingGroups() : Promise<any> {
        return new Promise((resolve, reject) => {
            this.getGroupsByField('user_id', this.user.uid).then(grps => {
                let groups_res = [];
                if (grps.length !== 0) {
                    for(let grp of grps) {
                        if (grp.status === 'pending') {
                            groups_res.push(grp);
                        }
                    }
                }
                resolve(groups_res);
            }, err => {
                reject(err);
            });
        });
    }

    getGroupsByField(field, query) : Promise<any> {
        return new Promise((resolve, reject) => {
            let groups = [];

            this.afDb.list(this.dbPath, ref => {
                return ref.orderByChild(field).equalTo(query);
            }).snapshotChanges().pipe(
                map(actions =>
                    actions.map(a => ({ key: a.key, ...a.payload.val() }))
                )
            ).subscribe(groups_res => {
                groups = groups_res.map(group => group);

                // On recupere les datas des main group pour remplir les user-groups
                groups.map(elem => {
                    this.getMainGroupByUid(elem.group_id).valueChanges().subscribe(res => {
                        let rest = res.map(group => group);
                        elem.name = rest[1];
                        elem.description = rest[0];
                    });
                    return elem;
                });
                resolve(groups);
            });
        });
    }

    getMainGroupByUid(guid) {
        return this.afDb.list('/groups/' + guid);
    }

    addMainGroup(main_group) {
        return this.main_groups.push(main_group);
    }

    addGroup(group: any) {
        return this.groups.push(group);
    }

    acceptGroupInvitation(group) {
        group.status = 'accepted';
        return this.afDb.object(this.dbPath + '/' + group.key).update(
            group);
    }

    removeGroup(group: any) {
        return this.afDb.object(this.dbPath + '/' + group.key).remove();
    }

    searchGroup(name) {
        this.afDb.list(this.dbPath, ref => {
            return ref.orderByChild("name").equalTo(name); });
    }
}
