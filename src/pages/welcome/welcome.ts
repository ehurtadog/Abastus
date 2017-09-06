import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GlobalStateService } from '../../services/global-state.service';
import { OAuth2Util } from '../../services/account-management.service';
import { Config } from '../../config/config';
import { UserLoginService, IUserLogin } from '../../services/account-management.service';
import { Logger } from '../../services/logger.service';
import { TabsPage } from '../tabs/tabs';
import { AccountSigninPage } from '../account-signin/account-signin';

@Component({
  selector: 'welcome',
  templateUrl: 'welcome.html',
})

export class WelcomePage {
  tabsPage = TabsPage;
  accountSigninPage = AccountSigninPage;
  initialized = false;
  _OAuth2Util = null;

  constructor(public navCtrl: NavController, public globals: GlobalStateService) {
    this._OAuth2Util = new OAuth2Util();
  }

  // this methos will be called each time the Ionic View is loaded
  ionViewDidEnter() {
    Logger.banner("Bienvenido a Abastus!");

    if (this.initialized) {
      console.log('%cConfiguration: ', Logger.LeadInStyle, Config);
      // Auto-login
      if (Config['DEVELOPER_MODE']) {
        Logger.heading("User sign-in");

        let userData: IUserLogin = {
          username: "Administrator",
          password: "Pa55word"
        };
        // UserLoginService.signIn(userData).then(() => {
        //   // set the property, so that Angular2's two-way variable binding works
        //   this.globals.userId = this.globals.getUserId();
        // })
      }
    }
    this.initialized = true;
  }
}
