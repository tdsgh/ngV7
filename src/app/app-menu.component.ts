import { Component, OnInit } from '@angular/core';

import { AppConfig, apiCalls } from './services/app-config.service';
//import { Api } from './services/api.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.css']
})
export class AppMenu implements OnInit {

  constructor(private appConfigService: AppConfig){

  }


  ngOnInit()    {
    console.log(`AppMenu.OnInit: [${AppConfig.settings.appConfig.viewTabs.toString()}]`);


  }

  initMenu(){

  }
}
 