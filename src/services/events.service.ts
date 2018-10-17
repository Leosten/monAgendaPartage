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
    groupevents: AngularFireList<any[]>;
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

        this.events = this.afDb.list('/events');
    }

    getMyEvents() : Promise<any> {
        return new Promise((resolve, reject) => {
            const eventsPromises = [];
            // Je recup mes groupes actuels
            this.groupsService.getMyGroups().then(res => {
                for (let grp of res) {
                    eventsPromises.push(this.getEventsByField('group_id', grp.key));
                }

                // puis les events depuis liés à ces groups
                Promise.all(eventsPromises)
                .then(evnts => {
                    let events_res = [];
                    if (evnts.length !== 0) {
                        for(let evnt of evnts) {
                            for(let ev of evnt) {
                                // Format date pour l'affichage calendar
                                ev.startTime = new Date(ev.startTime);
                                ev.endTime = new Date(ev.endTime);
                                events_res.push(ev);
                            }
                        }
                    }

                    resolve(events_res);
                });
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    getEventsByField(field, query) : Promise<any> {
        return new Promise((resolve, reject) => {
            let evnts = [];

            this.afDb.list('/events', ref => {
                return ref.orderByChild(field).equalTo(query);
            }).snapshotChanges().pipe(
                map(actions =>
                    actions.map(a => ({ key: a.key, ...a.payload.val() }))
                )
            ).subscribe(evnts_res => {
                evnts = evnts_res.map(evnt => evnt);
                resolve(evnts);
            });
        });
    }

    addNewEvent(evnt: any) {
        let data: any;

        this.events.push(evnt).then(new_event => {
            console.log("event created");
        }, err => {
            console.log ("error adding event");
        });
    }
}
