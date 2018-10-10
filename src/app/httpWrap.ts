import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
//import { delay, bufferWhen } from 'rxjs/operators';
import * as _ from 'lodash';

import { AppConfig } from 'services/app-config.service';

import { IApiResponse } from 'interfaces/api/response.model';

@Injectable()
export class HttpWrap {

    private apiUrl: string;
    private headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    constructor(private http: HttpClient,
        private appConfig: AppConfig) {
        this.apiUrl = this.appConfig.settings.api.srvUrl;

    }

    async callApi(key: string, data?: object, options?: object): Promise<IApiResponse>{

        console.log(key);

        var apiEndPoint = `${this.apiUrl}/${key}`;
        var body = new HttpParams();
        _.forOwn(data, (val, key) => { body = body.set(key, val) });

        const resp = await this.http.post<IApiResponse>(apiEndPoint, body, { headers: this.headers })
            .pipe(tap(resp => { console.log(`Start request [${key}]`); }), catchError((err): Observable<any> => {
                console.error(`Login failed: ${err}`);
                return err;
            })).toPromise();
        return resp;

    }
}

