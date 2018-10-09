import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersService } from '../../services/users.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  info_form: any;
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private usersService: UsersService,
      fb: FormBuilder
    ) {
        this.info_form = fb.group({
            displayName: [''],
        });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoPage');
  }

  editInfo() {

  }
}
