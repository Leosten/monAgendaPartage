import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersService } from '../../services/users.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  info_form: any;
  user: any;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private usersService: UsersService,
      public afAuth: AngularFireAuth,
      fb: FormBuilder
    ) {
        this.info_form = fb.group({
            display_name: ['', Validators.compose([Validators.required])]
        });
        this.afAuth.authState.subscribe(user => {
            this.user = user;
        });
  }
    ionViewDidLoad() {

    }

    ionViewDidLeave() {

    }

    editInfo() {

    }
}
