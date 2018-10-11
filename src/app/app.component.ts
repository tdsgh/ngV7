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
  }
}
