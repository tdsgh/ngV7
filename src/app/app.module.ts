import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppConfig } from './services/app-config.service';
import { Api } from './services/api.service';

import { LoadingPageComponent }    from './loading-page.component';
import { StartPageComponent }    from './start/start-page.component';
import { PageNotFoundComponent }    from './not-found.component';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {timer} from 'rxjs';

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

export function initializeAppSrv(srvConfig: string) {
  return () => timer(1000).toPromise().then(v => {
    console.log('WWW');
    return 'Srv config';
  });
}

@NgModule({
  declarations: [
    AppComponent,

    LoadingPageComponent,
    StartPageComponent,
    PageNotFoundComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    Api,
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AppConfig], multi: true },
    { provide: APP_INITIALIZER, useFactory: initializeAppSrv, deps: [], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
