import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersService } from '../../services/users.service';
import { GroupsService } from '../../services/groups.service';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-group-detail',
  templateUrl: 'group-detail.html',
})
export class GroupDetailPage {
    public group: any;
    public search_user: string;
    public found_users: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private usersService: UsersService,
        public groupsService: GroupsService,
        private alertCtrl: AlertController
    ) {
        this.group = this.navParams.get('group');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad GroupDetailPage');
    }

    searchUsers(query) {
        this.usersService.searchUserByQuery("email", query).valueChanges().subscribe(res => {
            this.found_users = res;
        });
    }

    addUserToGroup() {

    }

    removeGroup() {
        this.groupsService.removeGroup(this.group).then(result => {
            console.log("successfully removed group");
            this.navCtrl.pop();
        }, err => {
            console.log("error: " + err);
        });
    }

    removeGroupConfirm() {
        let alert = this.alertCtrl.create({
            title: 'Supprimer ce groupe?',
            message: this.group.name,
            buttons: [
              {
                text: 'Annuler',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Confirmer',
                handler: () => {
                  this.removeGroup();
                }
              }
            ]
          });
          alert.present();
    }
}
