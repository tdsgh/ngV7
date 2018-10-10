import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';

import { IAppConfig } from '../app-config.model';

@Injectable()
export class AppConfig {

    public settings: IAppConfig;
    public cred: any;

    constructor(private http: HttpClient) {}

    async load() {
        const jsonFile = `assets/configs/appConfig.json`;
        const resp = await this.http.get<IAppConfig>(jsonFile)
            .pipe(tap(sett => {
                        console.log(`Config loaded [${jsonFile}]`);
                    }),
                catchError((err): Observable<any> => {
                    console.error(`Load config failed [${jsonFile}]: ${err}`);
                    return err;
                })).toPromise();
        this.settings = resp;
        return 'Ok';
    }

    async loadCredDebug(){
        if(environment.production) return false;
        const cred = await this.http.get<any>('assets/configs/cred.json')
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