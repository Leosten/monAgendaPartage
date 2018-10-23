import { Component } from '@angular/core';
import { NavParams, ViewController, Platform, AlertController, ToastController } from 'ionic-angular';
import { EventsService } from '../../services/events.service';
import { FormBuilder } from '@angular/forms';
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
        private alertCtrl: AlertController,
        private toast: ToastController
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
        if(this.event.group_id === "") {
            this.toast.create({
                message: 'Le groupe ne peut pas être vide',
                duration: 3000,
                position: 'bottom'
            }).present();
            return;
        }

        if(this.event.title === "") {
            this.toast.create({
                message: 'Le nom ne peut pas être vide',
                duration: 3000,
                position: 'bottom'
            }).present();
            return;
        }
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
            this.toast.create({
                message: 'L\'événement a été ajouté',
                duration: 5000,
                position: 'bottom'
            }).present();
        }, err => {
            this.toast.create({
                message: 'Erreur lors de l\'ajout de l\'événement',
                duration: 5000,
                position: 'bottom'
            }).present();
        });
        this.viewCtrl.dismiss();
    }

    modifyEvent() {
        this.eventsService.modifyEvent(this.event).then(res => {
            this.toast.create({
                message: 'Événement modifié avec succès',
                duration: 5000,
                position: 'bottom'
            }).present();
            this.viewCtrl.dismiss();
        }, err => {
            this.toast.create({
                message: 'Erreur de modification de l\'événement',
                duration: 5000,
                position: 'bottom'
            }).present();
        });
    }

    removeEvent(event) {
        this.eventsService.removeEvent(this.event)
        .then(res => {
            this.viewCtrl.dismiss();
            this.toast.create({
                message: 'Événement supprimé avec succès',
                duration: 5000,
                position: 'bottom'
            }).present();
        }, err => {
            this.toast.create({
                message: 'Erreur lors de la suppression de l\'événement',
                duration: 5000,
                position: 'bottom'
            }).present();
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
