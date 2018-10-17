import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GroupsService } from '../../services/groups.service';
import { EventsService } from '../../services/events.service';
import { ModalController } from 'ionic-angular';
import { EventModalPage } from './event-modal';

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

    ionViewDidLoad() {
        this.eventsService.getMyEvents().then(res => {
             this.my_events = res.map(ev => {
                ev.startTime = ev.startTime.toISOString()
                ev.endTime = ev.endTime.toISOString()
                return ev;
            });
        });
    }

    openNewEventModal() {
        let profileModal = this.modalCtrl.create(EventModalPage);
        profileModal.present();
    }
}
