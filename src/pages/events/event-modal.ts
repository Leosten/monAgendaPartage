import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, AlertController } from 'ionic-angular';
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
        allDay: false
    };
    groups: any;
    selected_groups: any;
    selected_day: any;
    minDate = new Date().toISOString();

    constructor(
        public params: NavParams,
        public viewCtrl: ViewController,
        public platform: Platform,
        public formBuilder: FormBuilder,
        public groupsService: GroupsService,
        public eventsService: EventsService,
        private alertCtrl: AlertController
  ) {
        let preselectedDate = moment(this.params.get('selectedDay')).format();
        this.event.startTime = preselectedDate;
        this.event.endTime = preselectedDate;
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
        let alert = this.alertCtrl.create({
            title: 'Créer cet événement?',
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
                  this.addNewEvent();
                }
              }
            ]
          });
          alert.present();
    }

    addNewEvent() {
        console.log(this.selected_groups);
        this.eventsService.addNewEvent(this.selected_groups, this.event);
        this.viewCtrl.dismiss(this.event);
    }
}
