import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { OAuth2Util, UserLoginService, LocalStorage } from './account-management.service';
import { Logger } from './logger.service';
import { Config } from '../config/config';

@Injectable()
export class GlobalStateService {

  private loader = null;

  public userId = '';
  public developerMode = Config['DEVELOPER_MODE'];

  constructor(public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
  }

  getUserId(): string {
    return OAuth2Util.getUserId();
  }

  getUsername(): string {
    return OAuth2Util.getUsername();
  }

  getUserFirstName(): string {
    if (OAuth2Util.getUserProfile() && OAuth2Util.getUserProfile()['userFirstName']) {
      return (OAuth2Util.getUserProfile()['userFirstName']);
    }
    return null;
  }

  getUserLastName(): string {
    if (OAuth2Util.getUserProfile() && OAuth2Util.getUserProfile()['userLastName']) {
      return OAuth2Util.getUserProfile()['userLastName'];
    }
    return null;
  }

  getUserFullName(): string {
    if (OAuth2Util.getUserProfile() && OAuth2Util.getUserProfile()['userFirstName'] && OAuth2Util.getUserProfile()['userLastName']) {
      return OAuth2Util.getUserProfile()['userFirstName'] + ' ' + OAuth2Util.getUserProfile()['userLastName'];
    }
    return null;
  }

  getAlertController() {
    return this.alertCtrl;
  }

  logout(navController) {
    Logger.banner("Cerrar Sesion");
    this.showLogoutAlert();
    UserLoginService.signOut();
    this.userId = '';

    if (navController) {
      navController.popToRoot({animate: false});
    }
  }

  showLogoutAlert(): void {
    let alert = this.alertCtrl.create({
      title: 'Sesion Cerrada',
      subTitle: 'La sesion ha sido cerrada',
      buttons: [{
        text: 'OK',
      }]
    });
    alert.present();
  }

  displayAlert(title, subtitle, functionToRunWhenOkButtonIsPressed=null) {
    let okFunction = () => {};

    if (functionToRunWhenOkButtonIsPressed != null) {
      okFunction = functionToRunWhenOkButtonIsPressed;
    }

    let alert = this.getAlertController().create({
      title: title,
      subTitle: subtitle,
      buttons: [{ text: 'OK', handler: okFunction }]
    });

    alert.present();
  }

  displayToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'middle'
    });

    toast.present();
  }

  displayLoader(message, durationInMilliseconds=3000) {
    this.loader = this.loadingCtrl.create({
      content: message,
      duration: durationInMilliseconds,
      dismissOnPageChange: true
    });

    this.loader.present();
  }

  dismissLoader() {
    if (this.loader != null) {
      this.loader.dismiss();
    }

    this.loader = null;
  }
}
