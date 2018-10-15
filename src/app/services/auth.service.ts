import { Injectable } from '@angular/core';
//import { apiCalls } from 'services/api.service';
import { catchError, tap, delay } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import * as _ from 'lodash';

import { HttpWrap } from './http-wrap.service';
import { AppConfig, apiCalls } from 'services/app-config.service';

@Injectable()
export class Auth {

    private _authToken: string | boolean;// = false;

    public authSubject: Subject<string | any> = new Subject();

    public get IsAuthenticated() {
        return !!this._authToken;
    }

    public set IsAuthenticated(token: string | boolean){
        if(this._authToken !== token){
            this._authToken = token;
            this.httpWrap.authToken = token;
            if(token){
                console.log(`Auth.IsAuthenticated: ${token}`);
                this.authSubject.next(token);
            } else{
                this.authSubject.next(false);
                this.authenticateApp();
            }
        }
    }

    constructor(private httpWrap: HttpWrap, private appConfig: AppConfig) {
        of(1).pipe(delay(200)).subscribe(() => {
            console.log("Starting Auth service");
            this.IsAuthenticated = false;
        });
    }

    authenticateApp(){
        if(AppConfig.cred){
            this.httpWrap.callApi(apiCalls.login, {username: AppConfig.cred.name, password: AppConfig.cred.pass}).then(resp => {
                this.IsAuthenticated = resp.success ? resp.result : false;
            });
        }else{
            throw "Auth.authenticateApp: not implemented for production mode."
        }
    }
}


