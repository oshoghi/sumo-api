import fetch, { RequestInit } from "node-fetch";
import https from "https";

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

export interface SumoApiOptions {
    baseURL:string;
    accessId:string;
    accessKey:string;
    verifyHttps?:boolean;
}

export interface SumoApiError {
    error: string;
    status: number;
}

export class SumoApiBase {
    protected initOptions:SumoApiOptions;

    constructor (options:SumoApiOptions) {
        this.initOptions = { ...options };
    }

    protected request = (path, options?:RequestInit) => fetch(this.initOptions.baseURL + path, {
        agent: this.initOptions.verifyHttps === false ? httpsAgent : null,
        ...options,
        headers: {
            Authorization: "Basic " + new Buffer(this.initOptions.accessId + ":" + this.initOptions.accessKey).toString("base64"),
            "Content-Type": "application/json",
            "Accept": "application/json",
            ...options?.headers,
        }
    });

    protected jsonOrError = async <T>(path, options?:RequestInit) => {
        const resp = await this.request(path, options);

        if (resp.status < 200 || resp.status >= 300) {
            return {
                error: await resp.text(),
                status: resp.status,
            } as SumoApiError;
        }

        return resp.json() as Promise<T>;
    }
}

export const sleep = (t:number) => new Promise(r => {
    setTimeout(() => r(true), t);
});