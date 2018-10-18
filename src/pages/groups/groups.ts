import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { GroupsService } from '../../services/groups.service';
import { UsersService } from '../../services/users.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { GroupDetailPage } from '../group-detail/group-detail';
import { map } from 'rxjs/operators'
import { GroupModalPage } from './group-modal';

@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html'
})
export class GroupsPage {

    items: any;
    add_group: any;
    add_group_input;
    groups: any;
    pending_groups: any;
    user: any;

    constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public groupsService: GroupsService,
    public usersService: UsersService,
    public formBuilder: FormBuilder,
    public afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
    ) {

    }

    refreshGroups() {
        this.groupsService.getMyGroups().then(res => {
            this.groups = res;
        });

        this.groupsService.getPendingGroups().then(res => {
            this.pending_groups = res;
        });
    }

    groupsDetail(group) {
        this.navCtrl.push(GroupDetailPage, {
            group: group
        });
    }

    openNewGroupModal() {
        let newGroupModal = this.modalCtrl.create(GroupModalPage);
        newGroupModal.present();
    }

    confirmAcceptGroup(group) {
        let alert = this.alertCtrl.create({
            title: 'Rejoindre ce groupe?',
            message: group.name,

            buttons: [
              {
                text: 'Annuler',
                role: 'cancel',
                handler: () => {
                }
              },
              {
                text: 'Refuser',
                handler: () => {
                  this.refuseGroup(group);
                }
              },
              {
                text: 'Accepter',
                handler: () => {
                    this.acceptGroup(group);
                }
              }
            ]
          });
          alert.present();
    }

    acceptGroup(group) {
        this.groupsService.acceptGroupInvitation(group).then(res => {
            this.refreshGroups();
        });
    }

    refuseGroup(group) {
        this.groupsService.removeGroup(group).then(res => {
            this.refreshGroups();
        });
    }

    ionViewWillEnter() {
        this.refreshGroups();
    }

    ionViewDidLeave() {

    }
}
