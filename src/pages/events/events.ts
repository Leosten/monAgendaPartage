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
                ev.startTime = moment(ev.startTime).format();
                ev.endTime = moment(ev.endTime).format();
                return ev;
            });
        });
    }

    openNewEventModal() {
        let newEventModal = this.modalCtrl.create(EventModalPage);
        newEventModal.present();
        newEventModal.onDidDismiss(data => {
             this.refreshEvents();
        });
    }
}
