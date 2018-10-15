import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { AppConfig } from 'services/app-config.service';

import { IApiResponse } from 'interfaces/api/response.model';

@Injectable()
export class HttpWrap {

    private apiUrl: string;
    private headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    private _token?: string = null;

    constructor(private http: HttpClient) {
        this.apiUrl = AppConfig.settings.api.srvUrl;
    }

    public set authToken(token: string | boolean){
        this._token = token ? token.toString() : null;
    }
    public get authToken(){
        return this._token;
    }

    async callApi(key: string, data?: object, options?: object): Promise<IApiResponse>{

        var apiEndPoint = `${this.apiUrl}/${key}`;
        var body = new HttpParams();
        _.forOwn(data || {}, (val, key) => { body = body.set(key, val) });
        if(this.authToken)
            body = body.set("_s", this.authToken.toString());

        const resp = await this.http.post<IApiResponse>(apiEndPoint, body, { headers: this.headers })
            .pipe(
                tap(resp => { console.log(`Start request [${key}]`); }),
                catchError((err): Observable<any> => {
                    console.error(`Call failed [${key}]: ${err}`);
                    return err;
                })).toPromise();
        return resp;

    }
}

