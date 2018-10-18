import { Component } from '@angular/core';
import { NavParams, ViewController, Platform, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { GroupsService } from '../../services/groups.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'page-group-modal',
  templateUrl: 'group-modal.html'
})
export class GroupModalPage {
    group = {
       name: '',
       description: ''
    };
    user: any;
    add_group_input: any;

    constructor(
        public params: NavParams,
        public viewCtrl: ViewController,
        public platform: Platform,
        public formBuilder: FormBuilder,
        public groupsService: GroupsService,
        private alertCtrl: AlertController,
        public usersService: UsersService,
        public toast: ToastController
    ) {
        this.add_group_input = formBuilder.group({
            name: ['', Validators.required],
            description: ['']
        });
    }

    newGroup() {
        this.user = this.usersService.getCurrentUser();

        let gname = this.add_group_input.value.name;
        let gdesc = this.add_group_input.value.description;

        if (gname === '') {
            return;
        }
        this.groupsService.addMainGroup({name: gname, description: gdesc}).then(res => {
            let new_group = {
                group_id: res.key,
                user_id: this.user.uid,
                status: 'accepted',
                adm: 'true'
            };

            this.groupsService.addGroup(new_group).then(result => {
                this.toast.create({
                    message: 'Le groupe a été créé',
                    duration: 5000,
                    position: 'bottom'
                }).present();
                this.viewCtrl.dismiss();
            }, err => {
                this.toast.create({
                    message: 'Erreur lors de la création du groupe',
                    duration: 5000,
                    position: 'bottom'
                }).present();
            });
        });
    };

    addNewGroupConfirm() {
        let alert = this.alertCtrl.create({
            title: 'Créer ce groupe?',
            message: this.group.name,
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
                        this.newGroup();
                    }
                }
            ]

        });

        alert.present();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
