import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GroupsService } from '../../services/groups.service';
import { EventsService } from '../../services/events.service';
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

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public modalCtrl: ModalController,
        public eventsService: EventsService
    ) {
    }

    ionViewWillEnter() {
        this.refreshEvents();
    }

    refreshEvents() {
        this.eventsService.getMyEvents().then(res => {
            // Format de date pour l'affichage
             this.my_events = res.map(ev => {
                 if (ev.allDay) {
                    ev.startTime = moment(ev.startTime).format('LL');

                 } else {
                    ev.startTime = moment(ev.startTime).format('LLLL');
                }
                ev.endTime = moment(ev.endTime).format('LLLL');
                return ev;
            });
        });
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
}
