import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
    user: any;

    constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public groupsService: GroupsService,
    public usersService: UsersService,
    public formBuilder: FormBuilder,
    public afAuth: AngularFireAuth,
    ) {
        this.add_group_input = formBuilder.group({
            name: ['', Validators.required]
        });
    }

    refreshGroups() {
        this.groupsService.getMyGroups().then(res => {
            this.groups = res;
        });
    }

    groupsDetail(group) {
        this.navCtrl.push(GroupDetailPage, {
            group: group
        });
    }

    newGroup() {
        this.user = this.usersService.getCurrentUser();

        let new_group = {
            name: this.add_group_input.value.name,
            creator: this.user.uid,
            user_id: '',
            status: 'accepted',
            adm: 'true'

        };

        this.groupsService.addGroup(new_group).then(result => {
            console.log("successfully added new group");
            this.refreshGroups();
        }, err => {
            console.log("error: " + err);
        });
    }

    ionViewWillEnter() {
        this.refreshGroups();
    }

    ionViewDidLeave() {

    }
}
