import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { EventModalPage } from '../events/event-modal';
import { EventsService } from '../../services/events.service';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class HomePage {
    eventSource = [];
    viewTitle: string;
    selectedDay = new Date();

    calendar = {
        mode: 'month',
        currentDate: new Date()
    };

    constructor(
        public navCtrl: NavController,
        private modalCtrl: ModalController,
        private alertCtrl: AlertController,
        public eventsService: EventsService
    ) { }

    addEvent() {
        let modal = this.modalCtrl.create(EventModalPage, { selectedDay: this.selectedDay });
        modal.present();
        modal.onDidDismiss(data => {
             this.refreshEvents();
        });
    }

    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    ionViewWillEnter() {
        this.refreshEvents();
    }

    refreshEvents() {
        this.eventsService.getMyEvents().then(res => {
            this.eventSource = res;
        });
    }

    onEventSelected(evnt) {
        let modal = this.modalCtrl.create(EventModalPage, { type: 'modify', event: evnt });
        modal.present();
        modal.onDidDismiss(data => {
             this.refreshEvents();
        });
    }

    onTimeSelected(ev) {
        this.selectedDay = ev.selectedTime;
    }
}
