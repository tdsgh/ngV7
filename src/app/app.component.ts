import { Component, OnInit } from '@angular/core';

import { AppConfig, apiCalls } from './services/app-config.service';
import { Api } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private appConfigService: AppConfig, private api: Api){

  }

  title = 'app';

  ngOnInit()    {
    console.log(`AppComponent.OnInit: ${JSON.stringify(AppConfig.settings, null, 4)}`);

    this.api.callApi(apiCalls.userSettings);
    this.initApp();
  }

  initApp(){
    this.api.callApi(apiCalls.currentUserSettings)
      .then(sett => this.appConfigService.currentUserSettings = sett)
      .catch(err => {
        console.error(`Current User Settings failed [${err.message}]`);
        return Promise.reject(err.message);
      });

    this.api.callApi(apiCalls.currentUserData)
      .then(ud => this.appConfigService.currentUserData = ud)
      .catch(err => {
        console.error(`Current User Data failed [${err.message}]`);
        return Promise.reject(err.message);
      });
  }
}
