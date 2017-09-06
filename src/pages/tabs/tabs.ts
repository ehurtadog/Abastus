import { Component } from '@angular/core';
import { NavController, NavParams, Tab, Tabs } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { SalesPage } from '../sales/sales';

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {
  tab1Root: any = WelcomePage;
  tab2Root: any = SalesPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams, public navCtrl : NavController) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

  showRoot(tabs : Tabs, index : number) {
    let tab : Tab = tabs.getByIndex(index);
    let views = tab['_views'];

    if (views.length > 1) {
      let navController = views[views.length - 1].instance.navCtrl

      if (navController) {
        navController.popToRoot({animate: false});
      }
    }
  }
}
