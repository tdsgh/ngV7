import { Injectable } from '@angular/core';
//import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Api, apiCalls } from 'services/api.service';
import { catchError, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { delay, bufferWhen } from 'rxjs/operators';
import * as _ from 'lodash';

import * as apiCallsMap from 'assets/configs/api.json';

import { AppConfig } from 'services/app-config.service';
import { IApiResponse } from 'interfaces/api/response.model';
import {IApiCallQueueEntry, ApiCallEntry} from './apiCallTypes';

@Injectable()
export class Auth {

    private _authToken: boolean = false;

    public authSubject: Subject<string | any> = new Subject();

    public get IsAuthenticated() {
        return !!this._authToken;
    }

    public set IsAuthenticated(token: string | any){
        if(this._authToken !== token){
            this._authToken = token;
            if(token)
                this.authSubject.next(token);
            else
                this.authSubject.next(false);
            this.authenticateApp();
        }
    }

    constructor(private api: Api, private appConfig: AppConfig) {
        //this._isAuth = false;
    }

    authenticateApp(){
        this.api.callApi(apiCalls.login).then(resp => {
            if(resp.success){
                this.IsAuthenticated = resp.result;
            }else{
                this.authSubject.next(false);
            }
        })
    }
}


