import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
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
    public group_members = [];
    public pending_members = [];
    user: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private usersService: UsersService,
        public groupsService: GroupsService,
        private alertCtrl: AlertController,
        private toast: ToastController
    ) {
        this.group = this.navParams.get('group');
    }

    ionViewWillEnter() {
        this.user = this.usersService.getCurrentUser();

        this.refreshMembers();
    }

    refreshMembers() {
        this.usersService.getGroupsMembers(this.group.group_id, 'accepted').then(res => {
            this.group_members = res;
        }).catch(err => {
            this.toast.create({
                message: 'Erreur lors de la récupération des membres',
                duration: 5000,
                position: 'bottom'
            }).present();
        });

        this.usersService.getGroupsMembers(this.group.group_id, 'pending').then(res => {
            this.pending_members = res;
        }).catch(err => {
            this.toast.create({
                message: 'Erreur lors de la récupération des membres',
                duration: 5000,
                position: 'bottom'
            }).present();
        });
    }

    searchUsers(query) {
        this.usersService.searchUsers(query).then(res => {
            this.found_users = res;
        }).catch(err => {
            this.toast.create({
                message: 'Erreur lors de la recherche d\'utilisateur',
                duration: 5000,
                position: 'bottom'
            }).present();
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
            this.toast.create({
                message: 'L\'utilisateur a été invité',
                duration: 5000,
                position: 'bottom'
            }).present();
            this.refreshMembers();
        }, err => {
            this.toast.create({
                message: 'Erreur lors de l\'invitation',
                duration: 5000,
                position: 'bottom'
            }).present();
        });
    }

    removeGroup() {
        this.groupsService.removeGroup(this.group).then(result => {
            this.toast.create({
                message: 'Vous avez quitté le groupe' + this.group.name,
                duration: 5000,
                position: 'bottom'
            }).present();
            this.navCtrl.pop();
        }, err => {
            this.toast.create({
                message: 'Erreur lors de la suppression du groupe',
                duration: 5000,
                position: 'bottom'
            }).present();
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
