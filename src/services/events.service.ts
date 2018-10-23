import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
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
        this.dbPath = '/events'
        this.events = this.afDb.list(this.dbPath);
    }

    getMyEvents() : Promise<any> {
        return new Promise((resolve, reject) => {
            const eventsPromises = [];
            // Je recup mes groupes actuels
            this.groupsService.getMyGroups().then(res => {
                for (let grp of res) {
                    eventsPromises.push(this.getEventsByField('group_id', grp));
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

    getEventsByField(field, entity) : Promise<any> {
        return new Promise((resolve, reject) => {
            let evnts = [];

            this.afDb.list(this.dbPath, ref => {
                return ref.orderByChild(field).equalTo(entity.group_id);
            }).snapshotChanges().pipe(
                map(actions =>
                    actions.map(a => ({ key: a.key, ...a.payload.val() }))
                )
            ).subscribe(evnts_res => {
                evnts = evnts_res.map(evnt => {
                    evnt['group_name'] = entity.name;
                    return evnt;
                });

                resolve(evnts);
            });
        });
    }

    getEventsByGroup(group_id) : Promise<any> {
        return new Promise((resolve, reject) => {
            let evnts = [];

            this.afDb.list(this.dbPath, ref => {
                return ref.orderByChild('group_id').equalTo(group_id);
            }).snapshotChanges().pipe(
                map(actions =>
                    actions.map(a => ({ key: a.key, ...a.payload.val() }))
                )
            ).subscribe(evnts_res => {
                evnts = evnts_res.map(evnt => {
                    evnt['startTime'] = new Date(evnt['startTime']);
                    evnt['endTime'] = new Date(evnt['endTime']);
                    return evnt;
                });

                resolve(evnts);
            });
        });
    }

    addNewEvent(evnt: any) {
        return this.events.push(evnt);
    }

    modifyEvent(event) {
        return this.afDb.object(this.dbPath + '/' + event.key).update(
            event);
    }

    removeEvent(event) {
        return this.afDb.object(this.dbPath + '/' + event.key).remove();
    }
}
