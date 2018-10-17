import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { GroupsService } from '../../services/groups.service';
import { UsersService } from '../../services/users.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { GroupDetailPage } from '../group-detail/group-detail';
import { map } from 'rxjs/operators'

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
    private alertCtrl: AlertController
    ) {
        this.add_group_input = formBuilder.group({
            name: ['', Validators.required]
        });
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

    newGroup() {
        this.user = this.usersService.getCurrentUser();
        let gname = this.add_group_input.value.name;
        this.groupsService.addMainGroup({name: gname}).then(res => {
            let new_group = {
                name: gname,
                group_id: res.key,
                user_id: this.user.uid,
                status: 'accepted',
                adm: 'true'
            };

            this.groupsService.addGroup(new_group).then(result => {
                console.log("successfully added new group");
                this.refreshGroups();
            }, err => {
                console.log("error: " + err);
            });
        })
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
