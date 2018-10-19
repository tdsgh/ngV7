import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppConfig } from 'services/app-config.service';
import { Api } from 'services/api.service';
import { Auth } from 'services/auth.service';
import { HttpWrap } from './services/http-wrap.service';

import { LoadingPageComponent }    from './loading-page.component';
import { StartPageComponent }    from './start/start-page.component';
import { PageNotFoundComponent }    from './not-found.component';

import { AppComponent } from './app.component';
import { AppMenu } from './app-menu.component';

import { AppRoutingModule } from './app-routing.module';

export function initializeApp(http: HttpClient) {
  return () => AppConfig.load(http);
}

export function initializeCred(http: HttpClient) {
  return () => AppConfig.loadCredDebug(http);
  
}

@NgModule({
  declarations: [
    AppComponent,
    AppMenu,

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
    HttpClient,
    HttpWrap,
    Auth,
    Api,
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [HttpClient], multi: true },
    { provide: APP_INITIALIZER, useFactory: initializeCred, deps: [HttpClient], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
