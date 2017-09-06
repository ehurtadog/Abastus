import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {  Platform } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 platform:any;
 cordova:any;
 options: BarcodeScannerOptions;

  constructor(private barcode: BarcodeScanner, public navCtrl: NavController, platform: Platform) {
    this.platform = platform;
  }


  async onScan(form) {
    alert('Desde scan');

    const results = await this.barcode.scan();
    console.log(results);

    // this.platform.ready().then(() => {
    //   alert('Platform is ready');
    //   //this.networkState = navigator.connection.type;
    // });

    // cordova.plugins.barcodeScanner.scan(
    //   function (result) {
    //     if(!result.cancelled) {
    //       if(result.format == "QR_CODE") {
    //         console.log(result.text);
    //       }
    //     }
    //   }
    // )
  }

  onDeviceReady() {
    alert('Device is ready');
  }

}
