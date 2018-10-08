import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { IAppConfig } from '../app-config.model';

@Injectable()
export class AppConfig {

    public settings: IAppConfig;

    constructor(private http: HttpClient) {}

    async load() {
        const jsonFile = `assets/configs/appConfig.json`;
        const resp = await this.http.get<IAppConfig>(jsonFile)
            .pipe(tap(sett => {
                console.log(`Config loaded [${jsonFile}]`);
            }), catchError((err): Observable<any> => {
                console.error(`Load config failed [${jsonFile}]: ${err}`);
                return err;
            })).toPromise();
        this.settings = resp;
        return 'Ok';
    }
}