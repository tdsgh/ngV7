import { IApiResponse } from 'interfaces/api/response.model';

export interface IApiCallQueueEntry {
    id: number;
    endpoint: string;
    data: object;
    retPromise: Promise<IApiResponse>;
    resolve: (value?: IApiResponse | PromiseLike<IApiResponse>) => void;
    reject: (reason?: any) => void;
}

export class ApiCallEntry implements IApiCallQueueEntry {

    static callId: number = 1;

    id: number;
    endpoint: string;
    data: object;
    retPromise: Promise<IApiResponse>;
    resolve: (value?: IApiResponse | PromiseLike<IApiResponse>) => void;
    reject: (reason?: any) => void;

    constructor(endpoint: string, callParams?: object) {
        this.id = ApiCallEntry.callId ++;
        this.endpoint = endpoint;
        this.data = callParams;
        this.retPromise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
    
}