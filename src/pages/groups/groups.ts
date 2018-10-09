import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GroupsService } from '../../services/groups.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';

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
    public formBuilder: FormBuilder,
    public afAuth: AngularFireAuth,
    ) {
        this.add_group_input = formBuilder.group({
            name: ['', Validators.required]
        });
        this.afAuth.authState.subscribe(user => {
            this.user = user;
            this.groups = this.groupsService.getGroups(this.user.uid).valueChanges();
        });
    }

    groupsDetail(group) {
        console.log(group);
    // // That's right, we're pushing to ourselves!
    // this.navCtrl.push(GroupsPage, {
    //   item: item
    // });
    }

    newGroup() {
        let new_group = {
            name: this.add_group_input.value.name,
            creator: this.user.uid
        };

        this.groupsService.addGroup(new_group).then(result => {
            console.log("successfully added new group");
        }, err => {
            console.log("error: " + err);
        });
    }
}
