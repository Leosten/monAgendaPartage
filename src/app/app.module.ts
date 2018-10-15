import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { GroupsPage } from '../pages/groups/groups';
import { GroupDetailPage } from '../pages/group-detail/group-detail';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { SettingsPage } from '../pages/settings/settings';
import { EventsPage } from '../pages/events/events';
import { InfoPage } from '../pages/info/info';
import { EventModalPage } from '../pages/events/event-modal';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Firebase } from '@ionic-native/firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseConfig } from '../config';

import { AuthService } from '../services/auth.service';
import { GroupsService } from '../services/groups.service';
import { UsersService } from '../services/users.service';
import { EventsService } from '../services/events.service';

import { GooglePlus } from '@ionic-native/google-plus'
import { Facebook } from '@ionic-native/facebook'
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    GroupsPage,
    GroupDetailPage,
    LoginPage,
    SignupPage,
    SettingsPage,
    EventsPage,
    EventModalPage,
    InfoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FirebaseConfig.fire),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    GroupsPage,
    GroupDetailPage,
    LoginPage,
    SignupPage,
    SettingsPage,
    EventsPage,
    EventModalPage,
    InfoPage
  ],
  providers: [
    Firebase,
    StatusBar,
    SplashScreen,
    AngularFireAuth,
    AuthService,
    GroupsService,
    UsersService,
    EventsService,
    AngularFireDatabase,
    GooglePlus,
    Facebook,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
