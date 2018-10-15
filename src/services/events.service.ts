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
        this.dbPath = '/group-events';
        this.events = this.afDb.list(this.dbPath);
    }

    getMyEvents() : Promise<any> {
        return new Promise((resolve, reject) => {
            const eventsPromises = [];

            this.groupsService.getMyGroups().then(res => {
                for (let grp of res) {
                    eventsPromises.push(this.getEvents(grp.key));
                }

                Promise.all(eventsPromises)
                .then(evnts => {
                    let events_res = [];
                    for(let ev of evnts) {
                        for(let v of ev) {
                            events_res.push(v);
                        }
                    }
                    resolve(events_res);
                })
                .catch(err => {
                    reject(err);
                });
            });
        });
    }

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
                resolve(events_res);
            });
        });
    }

    addNewEvent(grps: Array<String>, evnt: any) {
        let data: any;
        const promises = [];

        for(let grp of grps) {
            data = {
                group_id: grp,
                event: evnt
            };
            promises.push(this.events.push(data));
        }

        Promise.all(promises).then(evnts => {
            console.log("all events added");
        }).catch(err => {
            // handle error
        });
    }
}
