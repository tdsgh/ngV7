import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppConfig } from 'services/app-config.service';
import { Api } from 'services/api.service';
import { Auth } from 'services/auth.service';
import { HttpWrap } from './httpWrap';

import { LoadingPageComponent }    from './loading-page.component';
import { StartPageComponent }    from './start/start-page.component';
import { PageNotFoundComponent }    from './not-found.component';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {timer} from 'rxjs';

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

export function initializeCred(appConfig: AppConfig) {
  return () => appConfig.loadCredDebug();
  
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
    HttpWrap,
    Auth,
    Api,
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AppConfig], multi: true },
    { provide: APP_INITIALIZER, useFactory: initializeCred, deps: [AppConfig], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
