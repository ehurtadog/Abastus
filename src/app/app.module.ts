import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Abastus } from './app.component';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HttpModule } from '@angular/http';

import { HomePage } from '../pages/home/home';
import { AccountSigninPage } from '../pages/account-signin/account-signin';
import { TabsPage } from '../pages/tabs/tabs';
import { WelcomePage } from '../pages/welcome/welcome';
import { SalesPage } from '../pages/sales/sales';

import { BrowserModule } from '@angular/platform-browser';
import { HttpService } from '../services/http-service';
import { CustomAuthorizerClient } from '../services/abastus-api.service';

@NgModule({
  declarations: [
    Abastus,
    HomePage,
    AccountSigninPage,
    TabsPage,
    WelcomePage,
    SalesPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(Abastus)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Abastus,
    HomePage,
    AccountSigninPage,
    TabsPage,
    WelcomePage,
    SalesPage,
  ],
  providers: [
    { provide: HttpService, useClass: HttpService },
    { provide: CustomAuthorizerClient, useClass: CustomAuthorizerClient },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BarcodeScanner
  ]
})
export class AppModule {}
