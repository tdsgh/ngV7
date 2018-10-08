import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { delay, bufferWhen } from 'rxjs/operators';
import * as _ from 'lodash';

import * as apiCallsMap from 'assets/configs/api.json';

import { AppConfig } from 'services/app-config.service';
import { IApiResponse } from 'interfaces/api/response.model';
import {IApiCallQueueEntry, ApiCallEntry} from './apiCallTypes';

@Injectable()
export class Api {

    private apiUrl: string;
    private headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    private _queue: Array<IApiCallQueueEntry> = [];

    private _queueSubject: Subject<IApiCallQueueEntry>;
    private _busyRepeatSubject: Subject<IApiCallQueueEntry>;
    private _waitRepeatSubject: Subject<IApiCallQueueEntry>;

    constructor(private http: HttpClient, private appConfig: AppConfig) {
        this.apiUrl = this.appConfig.settings.api.srvUrl;

        this._queueSubject = new Subject<IApiCallQueueEntry>();

        this._busyRepeatSubject = new Subject<IApiCallQueueEntry>();
        this._busyRepeatSubject.pipe(delay(5000)).subscribe(p => this._queueSubject.next(p));

        this._waitRepeatSubject = new Subject<IApiCallQueueEntry>();
        this._waitRepeatSubject.pipe(delay(20000)).subscribe(p => this._queueSubject.next(p));

    }

    async callApi(key: string, data?: object, options?: object): Promise<IApiResponse>{

        console.log(key);

        var apiEndPoint = `${this.apiUrl}/${key}`;
        var body = new HttpParams();
        _.forOwn(data, (val, key) => { body = body.set(key, val) });

        if(key === apiCallsMap.default.login){
            //direct request
            const resp = await this.http.post<IApiResponse>(apiEndPoint, body, { headers: this.headers })
                .pipe(tap(resp => { console.log(`Login Ok [${resp.result}]`); }), catchError((err): Observable<any> => {
                    console.error(`Login failed: ${err}`);
                    return err;
                })).toPromise();
            return resp.result;
        }else{
            //queue request and push
            let entry = new ApiCallEntry(apiEndPoint, data)
            this._queue.push(entry);
            this._queueSubject.next(entry);

            return entry.retPromise;
        }
    }
}

export const apiCalls = apiCallsMap.default;

