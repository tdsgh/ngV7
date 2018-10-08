import { HttpParams } from '@angular/common/http';

import { IApiResponse } from 'interfaces/api/response.model';

import * as _ from 'lodash';

export interface IApiCallQueueEntry {
    id: number;
    endpoint: string;
    data: HttpParams;
    retPromise: Promise<IApiResponse>;

    // resolve (pResolve: (resp: IApiResponse)=> void, response: IApiResponse): void;
    // reject (pReject: (err: any)=> void, error: any): void;
}

export class ApiCallEntry implements IApiCallQueueEntry {

    static callId: number = 1;

    id: number;
    endpoint: string;
    data: HttpParams;
    retPromise: Promise<IApiResponse>;
    resolve: (value?: IApiResponse | PromiseLike<IApiResponse>) => void;
    reject: (reason?: any) => void;

    constructor(endpoint: string, callParams?: object) {
        this.id = ApiCallEntry.callId ++;
        this.endpoint = endpoint;
        this.data = new HttpParams();
        _.forOwn(callParams, (val, key) => { this.data = this.data.set(key, val) });
        this.retPromise = new Promise((resolve, reject) => {
            // this.resolve.bind(this, resolve);
            // this.reject.bind(this, reject);
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    // resolve (pResolve: (resp: IApiResponse)=> void, response: IApiResponse): void {
    //     pResolve(response);
    // }

    // reject (pReject: (err: any)=> void, error: any): void {
    //     pReject(error);
    // }
    
}