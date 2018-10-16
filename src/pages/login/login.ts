import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { SignupPage } from '../signup/signup';
import { InfoPage } from '../info/info';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
    loginForm: FormGroup;
    loginError: string;

    constructor(
        private navCtrl: NavController,
        private auth: AuthService,
        private usersService: UsersService,
        fb: FormBuilder
    ) {
        this.loginForm = fb.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        });
    }

    login() {
        let data = this.loginForm.value;

        if (!data.email) {
            return;
        }

        let credentials = {
            email: data.email,
            password: data.password
        };
        this.auth.signInWithEmail(credentials)
            .then(
                () => this.navCtrl.setRoot(HomePage),
                error => this.loginError = error.message
            );
    }

    goToSignUp(){
        this.navCtrl.push(SignupPage);
    }

    loginWithGoogle() {
        this.auth.signInWithGoogle().then((user: firebase.User) =>
            this.searchExistingUser(user.uid),
                error => console.log(error.message)
        );
    }

    loginWithFacebook() {
        this.auth.signInWithFacebook().then((user: firebase.User) =>
            this.searchExistingUser(user.uid),
                error => console.log(error.message)
        );
    }

    searchExistingUser(user_uid) {
        let user = this.usersService.searchUsers(user_uid).then(res => {
            if (res.length === 0) {
                let new_user = {
                    uid: user_uid
                }
                this.usersService.addUser(new_user).then(result => {
                    this.navCtrl.setRoot(InfoPage);
                    console.log("successfully added new user");
                }, err => {
                    console.log("error: " + err);
                });
            } else {
                this.navCtrl.setRoot(HomePage);
            }
        });
    }

}
