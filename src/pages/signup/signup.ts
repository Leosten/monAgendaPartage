import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { InfoPage } from '../info/info';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';

@Component({
    selector: 'as-page-signup',
    templateUrl: './signup.html'
})
export class SignupPage {
    signupError: string;
    form: FormGroup;

    constructor(
        fb: FormBuilder,
        private navCtrl: NavController,
        private auth: AuthService,
        private usersService: UsersService
    ) {
        this.form = fb.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        });
    }

    signup() {
        let data = this.form.value;
        let credentials = {
            email: data.email,
            password: data.password
        };
        this.auth.signUp(credentials).then(
            (usr) => this.createNewUser(usr.user.uid),
            error => this.signupError = error.message);
    }

    // Lorsque je viens de m'inscrire, je cree un user
    createNewUser(user_uid) {
        let new_user = {
            uid: user_uid,
            email: this.form.value.email,
            display_name: ""
        }

        this.usersService.addUser(new_user).then(result => {
            this.toast.create({
                message: 'Inscription réussie!',
                duration: 5000,
                position: 'bottom'
            }).present();
            // On renvoit vers la page des infos avant tout
            this.navCtrl.setRoot(InfoPage);
        }, err => {
            this.toast.create({
                message: 'Erreur lors de l\'inscription',
                duration: 5000,
                position: 'bottom'
            }).present();
        });
    }
}
