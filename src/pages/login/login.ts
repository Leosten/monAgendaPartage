import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
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
        private toast: ToastController,
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
        console.log('entered login');
        this.auth.signInWithGoogle().then((user: firebase.User) => {
             console.log(user);
            this.searchExistingUser(user);
        }, error => {
            console.log(error);
            this.toast.create({
                message: 'Erreur de connexion Google',
                duration: 5000,
                position: 'bottom'
            }).present();
        });

    }

    loginWithFacebook() {
        this.auth.signInWithFacebook().then((user: firebase.User) => {
            this.searchExistingUser(user),
                error => {
                    this.toast.create({
                    message: 'Erreur de connexion Facebook',
                    duration: 5000,
                    position: 'bottom'
                }).present();
            }
        });
    }

    searchExistingUser(user) {
        this.usersService.searchUsers(user.uid).then(res => {
            if (res.length === 0) {
                let new_user = {
                    uid: user.uid,
                    email: user.email,
                    display_name: ''
                }
                this.usersService.addUser(new_user).then(result => {
                    this.navCtrl.setRoot(InfoPage);
                    this.toast.create({
                        message: 'Inscription réussie!',
                        duration: 5000,
                        position: 'bottom'
                    }).present();
                }, err => {
                    this.toast.create({
                        message: 'Erreur lors de l\'inscription',
                        duration: 5000,
                        position: 'bottom'
                    }).present();
                });
            } else {
                this.navCtrl.setRoot(HomePage);
            }
        });
    }

}
