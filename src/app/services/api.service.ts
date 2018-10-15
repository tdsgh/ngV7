import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { buffer, filter } from 'rxjs/operators';
import * as _ from 'lodash';

import { Auth } from 'services/auth.service';

import { HttpWrap } from './http-wrap.service';
import { IApiResponse } from 'interfaces/api/response.model';
import {IApiCallQueueEntry, ApiCallEntry} from './apiCallTypes';

@Injectable()
export class Api {

    private _queueSubject: Subject<IApiCallQueueEntry>;
    private _sendCallSubject: Subject<any>;
    // private _busyRepeatSubject: Subject<IApiCallQueueEntry>;
    // private _waitRepeatSubject: Subject<IApiCallQueueEntry>;

    private _callSubscribe: Observable<IApiCallQueueEntry[]>;

    constructor(private httpWrap: HttpWrap,
        private authService: Auth) {

        this._queueSubject = new Subject<IApiCallQueueEntry>();
        this._sendCallSubject = new Subject<any>();
        
        this._callSubscribe = this._queueSubject.pipe(buffer(this._sendCallSubject.pipe(filter(t => this.authService.IsAuthenticated ? t : false))));
        this.authService.authSubject.subscribe(t => t && this._sendCallSubject.next("Auth"));

        // this._busyRepeatSubject = new Subject<IApiCallQueueEntry>();
        // this._busyRepeatSubject.pipe(delay(5000)).subscribe(p => this._queueSubject.next(p));

        // this._waitRepeatSubject = new Subject<IApiCallQueueEntry>();
        // this._waitRepeatSubject.pipe(delay(20000)).subscribe(p => this._queueSubject.next(p));

        this._callSubscribe.subscribe(arr => _.forEach(arr, this.processEntry.bind(this)));
        this._sendCallSubject.subscribe(key => {
            console.log(`Call ${key} ready to be sent`);
        });
        this._queueSubject.subscribe(entry => {
            if(this.authService.IsAuthenticated){
                this._sendCallSubject.next(entry.endpoint);
            } else{
                console.log(`Call ${entry.endpoint} postponed [IsAuthenticated: false]`);
            }
        });
    }

    async callApi(key: string, data?: object, options?: object): Promise<IApiResponse>{
        let entry = new ApiCallEntry(key, data);
        this._queueSubject.next(entry);
        //this._sendCallSubject.next(key);

        return entry.retPromise;
    }

    processEntry(entry: ApiCallEntry){
        this.httpWrap.callApi(entry.endpoint, entry.data).then(resp => {
            console.log(`Response for [key:${entry.endpoint}]: ${resp}`);

            // Api Errors, Busy etc. processing should be here

            entry.resolve(resp);
        });
    }
}


