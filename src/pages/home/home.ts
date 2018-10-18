import { Component } from '@angular/core';
import { NavController, ModalController, ToastController } from 'ionic-angular';
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
        public eventsService: EventsService,
        public toast: ToastController
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
        }, err => {
            this.toast.create({
                message: 'Erreur lors de la récupération des événements',
                duration: 5000,
                position: 'bottom'
            }).present();
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
