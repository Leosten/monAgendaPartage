import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, AlertController } from 'ionic-angular';
import { EventsService } from '../../services/events.service';
import { FormBuilder, Validators } from '@angular/forms';
import { GroupsService } from '../../services/groups.service';

@Component({
  selector: 'page-event-modal',
  templateUrl: 'event-modal.html'
})
export class EventModalPage {
    event: any;
    groups: any;
    selected_groups: any;

    constructor(
        public params: NavParams,
        public viewCtrl: ViewController,
        public platform: Platform,
        public formBuilder: FormBuilder,
        public groupsService: GroupsService,
        public eventsService: EventsService,
        private alertCtrl: AlertController
  ) {
        this.event = {
            name: '',
            description: '',
            date: null,
            start: null,
            end: null
        }
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
            message: this.event.name,
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
        this.eventsService.addNewEvent(this.selected_groups, this.event);
    }
}
