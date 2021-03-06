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
import { GroupModalPage } from '../pages/groups/group-modal';

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

import { NgCalendarModule  } from 'ionic2-calendar';

import 'moment/locale/fr';
import moment from 'moment';

moment.locale('fr')

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
    GroupModalPage,
    InfoPage
  ],
  imports: [
    NgCalendarModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, {}, {
      links: [
        { component: HomePage, name: 'Home', segment: 'home' },
        { component: LoginPage, name: 'Login', segment: 'login' },
        { component: EventsPage, name: 'Events', segment: 'events' },
        { component: GroupsPage, name: 'Groups', segment: 'groups' },
        { component: InfoPage, name: 'Info', segment: 'info' },
        { component: SettingsPage, name: 'Settings', segment: 'settings' }
      ]
    }),
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
    GroupModalPage,
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
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
