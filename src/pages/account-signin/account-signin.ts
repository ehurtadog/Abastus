import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { AlertController } from 'ionic-angular';
import { GlobalStateService } from '../../services/global-state.service';
import { UserLoginService, IUserLogin, UserState, OAuth2Util } from '../../services/account-management.service';
import { CustomAuthorizerClient } from '../../services/abastus-api.service';
import { Logger } from '../../services/logger.service';
import { Config } from '../../config/config';
import { User } from '../../services/abastus-sdk/model/User';
import { UserListResponse } from '../../services/abastus-sdk/model/UserListResponse';
import { UserTokens } from '../../services/abastus-sdk/model/UserTokens';

@Component ({
  templateUrl: 'account-signin.html',
})

export class AccountSigninPage {
  allowButtonPresses = true; //para prevenir clicks multiples
  tabsPage = TabsPage;
  alertCtrl : AlertController = this.globals.getAlertController();
  userTokens: UserTokens;
  users2: UserListResponse = [];
  data: any = [];

  public userData: IUserLogin = {
    username: "",
    password: ""
  }

  signInButtonClicked: boolean = false;
  forgotPasswordButtonClicked: boolean = false;

  onSignIn(form) {
    this.signInButtonClicked = true;
    this.forgotPasswordButtonClicked = false;

    if (form && form.valid) {
      this.login();
    }
  }

  onForgotPassword(form) {
    if (!this.allowButtonPresses) {
      return;
    }

    this.signInButtonClicked = false;
    this.forgotPasswordButtonClicked = true;
    this.allowButtonPresses = false;

    if (form && this.userData.username != null) {
      this.globals.displayToast('Opcion no abilitada!');
      this.allowButtonPresses = true;
    }
  }

  login(): void {
    if (!this.allowButtonPresses) {
      return;
    }

    this.allowButtonPresses = false;
    this.globals.displayLoader('Signing in...');

    UserLoginService.signIn(this.userData, this.authClient, this.globals)
      .then(() => {
        // Login was successful
        this.globals.dismissLoader();
        this.showLoginSuccessAlert(this.userData.username, () => {
          this.globals.userId = this.globals.getUserId();
          this.navCtrl.popToRoot({animate: false});
        });
      })
      .catch((error: Error): void => {
        console.error('error desde login(): ', error);
        this.globals.dismissLoader();
        //this.allowButtonPresses = true;
        //this.globals.displayToast('Usuario/contrasena incorrectos!');
        this.displayAlertError(error);
      });

    this.allowButtonPresses = true; //cambiar de lugar cuando se implemente
  }

  displayAlertError(err: Error) {
    let errorMessage: string = '';

    switch (OAuth2Util.getUserState()) {
      case UserState.InvalidCredentials:
        console.log('Sign-in failed: ' + err);
        errorMessage = 'El usuario o password ingresados son incorrectos. Por favor intentelo nuevamente.';
        this.showLoginFailureAlert(this.userData.username, errorMessage);
        break;
      default:
        console.log('Sign-in failed: ' + err);
        errorMessage = `Fall&oacute; el inicio de sesi&oacute;n: ${err}`;
        this.showLoginFailureAlert(this.userData.username, errorMessage);
        break;
    }
  }

  showLoginSuccessAlert(username: String, callbackHandler: () => void): void {
    let subtitle = `Ha iniciado sesion.`;

    let alert = this.alertCtrl.create({
      title: 'Exitoso!',
      subTitle: subtitle,
      message: `Usuario: <b>${username}</b><br/>Nombre: <b>${this.globals.getUserFullName()}</b>`,
      buttons: [{
        text: 'OK',
        handler: data => {
          callbackHandler();
        }
      }]
    });
    alert.present();
  }

  showLoginFailureAlert(username: String, message: String): void {
    let alert = this.alertCtrl.create({
      title: 'No se pudo iniciar sesi&oacute;n',
      subTitle: `${message}`,
      buttons: [{ text: 'OK'}]
    });
    alert.present();
  }

  constructor(public navCtrl: NavController, private globals: GlobalStateService, private authClient: CustomAuthorizerClient) {
    if (Config.DEVELOPER_MODE) {
      this.userData.username = 'Administrator';
      this.userData.password = 'Pa55word';
    }
  }

  ionViewDidEnter() {
    Logger.banner("Sign-In");
    this.allowButtonPresses = true;
  }
}
