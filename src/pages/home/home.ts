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
            if (data) {
                let eventData = data;

                // eventData.startTime = new Date(data.startTime);
                // eventData.endTime = new Date(data.endTime);

                let events = this.eventSource;
                events.push(eventData);
                this.eventSource = [];
                setTimeout(() => {
                    this.eventSource = events;
                });
            }
        });
    }

    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad EventsPage');
        this.refreshEvents();
    }

    refreshEvents() {
        this.eventsService.getMyEvents().then(res => {
            for(let evnt of res) {
                this.eventSource.push(evnt.event);
            }
            console.log(this.eventSource);
        });
    }
    onEventSelected(event) {
        let start = moment(event.startTime).format('LLLL');
        let end = moment(event.endTime).format('LLLL');

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
