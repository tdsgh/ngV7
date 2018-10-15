import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';

import { IAppConfig } from '../app-config.model';

import * as apiCallsMap from 'assets/configs/api.json';

@Injectable()
export class AppConfig {

    public static settings: IAppConfig;

    public currentUser: object;
    public currentUserSettings: object;
    public currentUserData: object; //current_user_data_v6

    public static cred: any;

    constructor(private http: HttpClient) {}

    static async load(http: HttpClient) {
        const jsonFile = `assets/configs/appConfig.json`;
        const resp = await http.get<IAppConfig>(jsonFile)
            .pipe(
                tap(sett => { console.log(`Load app config [${jsonFile}]`); }),
                catchError((err): Observable<any> => {
                    console.error(`Load config failed [${jsonFile}]: ${err}`);
                    return of(err);
                })
            ).toPromise();
        AppConfig.settings = resp;

        return resp;
    }

    static async loadCredDebug(http: HttpClient){
        if(environment.production) return false;
        const cred = await http.get<any>('assets/configs/cred.json')
            .pipe(
                tap(cr => { console.log(`DEBUG! Load credentials [name:${cr.name}]`);}),
                catchError((err): Observable<any> => {
                    console.error(`DEBUG! Load cred failed: ${err.message}`);
                    return of(err);
                })
            ).toPromise();
        this.cred = cred;
        return cred;
    }
}

export const apiCalls = apiCallsMap.default;