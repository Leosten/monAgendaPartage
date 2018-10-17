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

    ionViewDidLoad() {
        this.refreshEvents();
    }

    refreshEvents() {
        this.eventsService.getMyEvents().then(res => {
            this.eventSource = res;
        });
    }

    onEventSelected(event) {
        let start = moment(event.startTime).format('LLLL');
        let end = moment(event.endTime).format('LLLL');

        //TODO: modif event
        let alert = this.alertCtrl.create({
            title: '' + event.title,
            subTitle: 'De : ' + start + '<br>à : ' + end,
            buttons: ['OK']
        })
        alert.present();
    }

    onTimeSelected(ev) {
        this.selectedDay = ev.selectedTime;
    }
}
