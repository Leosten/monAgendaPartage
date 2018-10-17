import { Component } from '@angular/core';
import { NavParams, ViewController, Platform, AlertController } from 'ionic-angular';
import { EventsService } from '../../services/events.service';
import { FormBuilder, Validators } from '@angular/forms';
import { GroupsService } from '../../services/groups.service';
import * as moment from 'moment';

@Component({
  selector: 'page-event-modal',
  templateUrl: 'event-modal.html'
})
export class EventModalPage {
    event = {
        title: '',
        location: '',
        notes: '',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        allDay: false,
        group_id: ''
    };
    groups: any;
    selected_day: any;
    minDate = new Date().toISOString();
    type = 'create';

    constructor(
        public params: NavParams,
        public viewCtrl: ViewController,
        public platform: Platform,
        public formBuilder: FormBuilder,
        public groupsService: GroupsService,
        public eventsService: EventsService,
        private alertCtrl: AlertController
  ) {
        if (this.params.get('type') === 'modify') {
            this.type = 'modify';
            this.event = this.params.get('event');
            this.event.startTime = moment(this.event.startTime).format();
            this.event.endTime = moment(this.event.endTime).format();
        } else {
            let preselectedDate = moment(this.params.get('selectedDay')).format();
            this.event.startTime = preselectedDate;
            this.event.endTime = preselectedDate;
        }
        this.minDate = new Date().toISOString();
    }

    ionViewDidLoad() {
        this.groupsService.getMyGroups().then(res => {
            this.groups = res;
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    addNewEventConfirm() {
        let msg = 'Créer cet événement?';
        if (this.type === 'modify') {
            msg = 'Modifier cet événement?'
        }
        let alert = this.alertCtrl.create({
            title: msg,
            message: this.event.title,
            buttons: [
              {
                text: 'Annuler',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Confirmer',
                handler: () => {
                    if (this.type === 'modify') {
                        this.modifyEvent();
                    } else {
                        this.addNewEvent();
                    }
                }
              }
            ]
          });
          alert.present();
    }

    addNewEvent() {
        this.eventsService.addNewEvent(this.event).then(res => {
            console.log('event added');
        }, err => {
            console.log ('error: ' + err);
        });
        this.viewCtrl.dismiss();
    }

    modifyEvent() {
        this.eventsService.modifyEvent(this.event).then(res => {
            console.log('event modified');
            this.viewCtrl.dismiss();
        }, err => {
            console.log ('error: ' + err);
        });
    }

    removeEvent(event) {
        this.eventsService.removeEvent(this.event)
        .then(res => {
            this.viewCtrl.dismiss();
            console.log('event removed');
        }, err => {
            console.log ('error: ' + err);
        });;
    }

     removeEventConfirm() {
        let msg = 'Supprimer cet événement?';

        let alert = this.alertCtrl.create({
            title: msg,
            message: this.event.title,
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    handler: () => {
                      console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Confirmer',
                    handler: () => {
                        this.removeEvent(this.event);
                    }
                }
            ]
        });

        alert.present();
    }
}
