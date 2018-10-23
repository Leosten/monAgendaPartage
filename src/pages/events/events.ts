import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { EventsService } from '../../services/events.service';
import { GroupsService } from '../../services/groups.service';
import { ModalController } from 'ionic-angular';
import { EventModalPage } from './event-modal';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})

export class EventsPage {
    my_events: any;
    selected_group: any;
    groups: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public modalCtrl: ModalController,
        public eventsService: EventsService,
        public toast: ToastController,
        public groupsService: GroupsService
    ) {
    }

    ionViewWillEnter() {
        this.selected_group = 'Tous les groupes';
        this.groupsService.getMyGroups().then(res => {
            this.groups = res;
        }, err => {
            this.errorHandle('groupes');
        });
        this.refreshEvents();
    }

    refreshEvents() {
        if (this.selected_group === 'Tous les groupes') {
            this.eventsService.getMyEvents().then(res => {
                // Format de date pour l'affichage
                this.my_events = this.formatEventDates(res);
            }, err => {
                this.errorHandle('événements');
            });
        } else {
            this.eventsService.getEventsByGroup(this.selected_group).then(res => {
                this.my_events = this.formatEventDates(res);
            }, err => {
                this.errorHandle('événements');
            });
        }
    }

    formatEventDates(res) {
        res.map(ev => {
            if (ev.allDay) {
                ev.startTime = moment(ev.startTime).format('LL');

            } else {
                ev.startTime = moment(ev.startTime).format('LLLL');
            }
            ev.endTime = moment(ev.endTime).format('LLLL');
            return ev;
        });

        return res;
    }

    openNewEventModal() {
        let newEventModal = this.modalCtrl.create(EventModalPage);
        newEventModal.present();
        newEventModal.onDidDismiss(() => {
             this.refreshEvents();
        });
    }

    openModifyModal(evnt) {
        let modal = this.modalCtrl.create(EventModalPage, { type: 'modify', event: evnt });
        modal.present();

        modal.onDidDismiss(() => {
             this.refreshEvents();
        });
    }

    errorHandle(type) {
        this.toast.create({
            message: 'Erreur lors de la récupération des ' + type,
            duration: 5000,
            position: 'bottom'
        }).present();
    }
}
