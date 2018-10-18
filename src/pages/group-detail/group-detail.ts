import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UsersService } from '../../services/users.service';
import { GroupsService } from '../../services/groups.service';

@IonicPage()
@Component({
  selector: 'page-group-detail',
  templateUrl: 'group-detail.html',
})
export class GroupDetailPage {
    public group: any;
    public search_user: string;
    public found_users: any;
    public group_members: any;
    public pending_members: any;
    user: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private usersService: UsersService,
        public groupsService: GroupsService,
        private alertCtrl: AlertController
    ) {
        this.group = this.navParams.get('group');
        this.group_members = [];
        this.pending_members = [];
    }

    ionViewDidLoad() {
        this.user = this.usersService.getCurrentUser();
        this.usersService.getGroupsMembers(this.group.group_id, 'accepted').then(res => {
            this.group_members = res;
        });

        this.usersService.getGroupsMembers(this.group.group_id, 'pending').then(res => {
            this.pending_members = res;
        });
    }

    searchUsers(query) {
        this.usersService.searchUsers(query).then(res => {
            this.found_users = res;
        });
    }

    addUserToGroup(user, adm) {
        let new_group = {
            name: this.group.name,
            user_id: user.uid,
            group_id: this.group.group_id,
            status: 'pending',
            adm: adm

        };

        this.groupsService.addGroup(new_group).then(result => {
            console.log("successfully added new group");
        }, err => {
            console.log("error: " + err);
        });
    }

    removeGroup() {
        this.groupsService.removeGroup(this.group).then(result => {
            console.log("successfully removed group");
            this.navCtrl.pop();
        }, err => {
            console.log("error: " + err);
        });
    }

    confirmAddUserToGroup(user) {
        let alert = this.alertCtrl.create({
            title: 'Ajouter ce membre au groupe?',
            message: user.email + ' | ' + user.display_name,
            inputs: [
                {
                    type:'checkbox',
                    label: 'Administrateur',
                    value: 'adm',
                    checked: false
                }
            ],
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
                handler: data => {
                    let adm = false;
                    if (data.length > 0) {
                        adm = true;
                    }

                    this.addUserToGroup(user, adm);
                }
              }
            ]
          });
          alert.present();
    }

    removeGroupConfirm() {
        let alert = this.alertCtrl.create({
            title: 'Quitter ce groupe?',
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
