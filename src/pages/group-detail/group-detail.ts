import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersService } from '../../services/users.service';

/**
 * Generated class for the GroupDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
        private usersService: UsersService
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
}
