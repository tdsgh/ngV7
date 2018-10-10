import { Injectable } from '@angular/core';
import { apiCalls } from 'services/api.service';
import { catchError, tap, delay } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import * as _ from 'lodash';

import { HttpWrap } from '../httpWrap';
import { AppConfig } from 'services/app-config.service';

@Injectable()
export class Auth {

    private _authToken: boolean;// = false;

    public authSubject: Subject<string | any> = new Subject();

    public get IsAuthenticated() {
        return !!this._authToken;
    }

    public set IsAuthenticated(token: string | any){
        if(this._authToken !== token){
            this._authToken = token;
            if(token)
                this.authSubject.next(token);
            else{
                this.authSubject.next(false);
                this.authenticateApp();
            }
        }
    }

    constructor(private httpWrap: HttpWrap, private appConfig: AppConfig) {
        of(1).pipe(delay(1000)).subscribe(() => {
            console.log("WWWWWWW");
            this.IsAuthenticated = false;
        });
    }

    authenticateApp(){
        if(this.appConfig.cred){
            this.httpWrap.callApi(apiCalls.login, {username: this.appConfig.cred.name, password: this.appConfig.cred.pass}).then(resp => {
                this.IsAuthenticated = resp.success ? resp.result : false;
            });
        }else{
            throw "Auth.authenticateApp: not implemented for production mode."
        }
    }
}


