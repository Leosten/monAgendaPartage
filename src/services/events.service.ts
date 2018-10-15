import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { GroupsService } from './groups.service';
import { map } from 'rxjs/operators'

@Injectable()
export class EventsService {
    private user: firebase.User;
    events: AngularFireList<any[]>;
    dbPath: any;
    user_id: any;

    constructor(
        public afAuth: AngularFireAuth,
        public afDb: AngularFireDatabase,
        public groupsService: GroupsService

    ) {
        afAuth.authState.subscribe(user => {
            this.user = user;
        });
        this.dbPath = '/user-events';
        this.events = this.afDb.list(this.dbPath);
    }

    getMyEvents(user_id) {
        let events = [];
        this.groupsService.getMyGroups(user_id).then(res => {
            for(let grp of res) {
                this.getEvents(grp.key).then(evnts => {
                    this.events.push(evnts);
                });
            }
        });

        return events;
        // return this.afDb.list(this.dbPath, ref => {
        //     return ref.orderByChild("user_uid").equalTo(user_id);
        // });
    };

    getEvents(group_id) : Promise<any> {
        return new Promise((resolve, reject) => {
            let events = [];

            this.afDb.list(this.dbPath, ref => {
                return ref.orderByChild("group_id").equalTo(group_id);
            }).snapshotChanges().pipe(
                map(actions =>
                    actions.map(a => ({ key: a.key, ...a.payload.val() }))
                )
            ).subscribe(events_res => {
                events = events_res.map(group => group);
                resolve(events);
            });
        });
    }

    addGroup(evnt: any) {
        return this.events.push(evnt);
    }
}
