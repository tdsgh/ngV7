import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { delay, bufferWhen, filter } from 'rxjs/operators';
import * as _ from 'lodash';

import * as apiCallsMap from 'assets/configs/api.json';

import { Auth } from 'services/auth.service';

import { HttpWrap } from '../httpWrap';
import { IApiResponse } from 'interfaces/api/response.model';
import {IApiCallQueueEntry, ApiCallEntry} from './apiCallTypes';

@Injectable()
export class Api {

    private _queueSubject: Subject<IApiCallQueueEntry>;
    private _sendCallSubject: Subject<any>;
    private _busyRepeatSubject: Subject<IApiCallQueueEntry>;
    private _waitRepeatSubject: Subject<IApiCallQueueEntry>;

    private _callSubscribe: Observable<IApiCallQueueEntry[]>;

    constructor(private httpWrap: HttpWrap,
        private authService: Auth) {

        this._sendCallSubject = new Subject<any>();
        this._queueSubject = new Subject<IApiCallQueueEntry>();
        this._callSubscribe = this._queueSubject.pipe(bufferWhen(() => {
            return this.authService.IsAuthenticated ? this._sendCallSubject : this.authService.authSubject.pipe(filter(t => !!t));
        }));

        this._busyRepeatSubject = new Subject<IApiCallQueueEntry>();
        this._busyRepeatSubject.pipe(delay(5000)).subscribe(p => this._queueSubject.next(p));

        this._waitRepeatSubject = new Subject<IApiCallQueueEntry>();
        this._waitRepeatSubject.pipe(delay(20000)).subscribe(p => this._queueSubject.next(p));

        this._callSubscribe.subscribe(arr => _.forEach(arr, this.processEntry.bind(this)));
    }

    async callApi(key: string, data?: object, options?: object): Promise<IApiResponse>{

        let entry = new ApiCallEntry(key, data)
            this._queueSubject.next(entry);
            this._sendCallSubject.next(key);

            return entry.retPromise;
    }

    processEntry(entry: ApiCallEntry){
        this.httpWrap.callApi(entry.endpoint, entry.data).then(resp => {
            console.log(`Response for [key:${entry.endpoint}]: ${resp}`);
            entry.resolve(resp);
        })
    }
}

export const apiCalls = apiCallsMap.default;

