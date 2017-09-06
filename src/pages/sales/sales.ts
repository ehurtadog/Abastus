import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { OAuth2Util, UserState } from '../../services/account-management.service';
import { GlobalStateService } from '../../services/global-state.service';
import { ClientDataService } from '../../services/client-service';
import { CustomAuthorizerClient } from '../../services/abastus-api.service';
import { AccountSigninPage } from '../account-signin/account-signin';

@Component({
  templateUrl: 'sales.html',
})

export class SalesPage {
  accountSigninPage = AccountSigninPage;

  allowButtonPresses = true;
  initialized = true;
  alertCtrl : AlertController = this.globals.getAlertController();
  searchButtonClicked: boolean = false;

  clientIconColor: string;
  subFormRequired = false;
  public seller = '';
  public clientFullName = ' ';
  public clientData = {
    clientId: '',
    clientFirstName: undefined,
    clientLastName: undefined,
    clientBalance: 0,
    clientFormattedBalance: '$0.00',
    clientStatus: 'sync',
  }
  public salesData = {
    itemId: '',
    unitId: 3,
    quantity: 0,
    price: 0.00
  }

  clientDetails(form) {
    this.searchButtonClicked = true;

    if (form && form.valid) {
      this.getClientDetails();
    }
  }

  getClientDetails() {
    if (!this.allowButtonPresses) {
      return;
    }

    this.allowButtonPresses = false;

    this.globals.displayLoader('Buscando cliente...');
    ClientDataService.getClientDetails(this.clientData.clientId, this.authClient)
    .then(() => {
      this.clientData.clientFirstName = ClientDataService.getClientFirstName();
      this.clientData.clientLastName = ClientDataService.getClientLastName();
      this.clientFullName = ClientDataService.getClientFullName();
      this.clientData.clientBalance = ClientDataService.getClientBalance();
      this.clientData.clientFormattedBalance = ClientDataService.getClientFormattedBalance();
      this.clientData.clientStatus = ClientDataService.getClientStatus();
      this.setClientIconColor(this.clientData.clientStatus);
      this.globals.dismissLoader();
    }).catch((err: Error): void => {
      this.clearClientData();
      this.globals.dismissLoader();
      this.globals.displayToast("Cliente no encontrado");
    });

    this.allowButtonPresses = true;
    this.searchButtonClicked = false;
  }

  clearClientData() {
    this.clientData.clientId = '';
    this.clientData.clientFirstName = '';
    this.clientData.clientLastName = '';
    this.clientData.clientBalance = 0;
    this.clientData.clientFormattedBalance = '$0.00',
    this.clientData.clientStatus = 'sync';
    this.clientFullName = '';
    this.setClientIconColor(this.clientData.clientStatus);
  }

  setClientIconColor(status: string) {
    switch(status) {
      case 'thumbs-up': {
        this.clientIconColor = 'secondary';
        break;
      }
      case 'thumbs-down': {
        this.clientIconColor = 'danger';
        break;
      }
      default: {
        this.clientIconColor = 'primary';
        break;
      }
    }
  }

  constructor(public app: App, public navCtrl: NavController, private globals: GlobalStateService, private authClient: CustomAuthorizerClient) {
    this.clientIconColor = 'primary';
    this.salesData.itemId = 'VG-01';
    this.salesData.unitId = 3;
    this.salesData.quantity = null;
    this.salesData.price = null;
    console.log('pase por constructor de sales');
  }

  ionViewDidEnter() {
    if (this.initialized) {
      if (OAuth2Util.getUserState().valueOf() as UserState.SignedIn) {
        this.seller = this.globals.getUserFullName();
        this.initialized = false;
      }
    }
  }

  loco() {
    this.initialized = true;
  }

  ionViewDidLeave() {
    //this.clearClientData();
  }
}
