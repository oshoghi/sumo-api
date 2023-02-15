import { SumoApiBase, sleep, SumoApiError} from "./BaseApi";
import { SearchStatusResponse, SearchMessagesResponse, SearchStartResponse, SearchStates } from "../types/Search";

export interface SumoSearchApiStart {
    query: string;
    from: string;
    to: string;
    timeZone: "PST" | "IST" | string;
    byReceiptTime: boolean;
}

export class SearchApi extends SumoApiBase {
    start = async (params:SumoSearchApiStart) => {
        return this.jsonOrError<SearchStartResponse>("/api/v1/search/jobs", {
            method: "POST", 
            body: JSON.stringify(params)
        });
    }

    getStatus = async (id:string) => {
        return this.jsonOrError<SearchStatusResponse>("/api/v1/search/jobs/" + id);
    }

    waitUntilDone = async (id: string, {timeout=0, waitBetweenPollMs=500 }={}) => {
        const start = Date.now();

        while (true) {
            const json = await this.getStatus(id);

            if ("error" in json) {
                return json as SumoApiError;
            }

            if (json.state === SearchStates.DONE) {
                return json;
            }

            if (timeout && Date.now() >= timeout) {
                return {
                    error: "timeout"
                };
            }

            await sleep(waitBetweenPollMs);

            process.stdout.write(".");
        }

        console.log("\n");
    }

    getMessages = async (id:string, { offset=0, limit=1000 }={}) => {
        return this.jsonOrError<SearchMessagesResponse>(`/api/v1/search/jobs/${id}/messages?offset=${offset}&limit=${limit}`);
    }

    getAll = async (params:SumoSearchApiStart) => {
        const search = await this.start(params);

        if ("error" in search) {
            return search as SumoApiError;
        }

        const status = await this.waitUntilDone(search.id);

        if ("error" in status) {
            return status as SumoApiError;
        }

        console.log(`found ${status.messageCount} messages`);

       
        let fields:any;
        const messages = [];
        const POLL_SIZE=1000;

        for (let offset = 0; offset < status.messageCount; offset += POLL_SIZE) {
            const m = await this.getMessages(search.id, { offset, limit: POLL_SIZE });

            if ("error" in m) {
                return m as SumoApiError;
            }

            fields = m.fields;
            messages.push(m.messages);

            console.log("getting messages offset: " + offset);
        }

        return {
            messages,
            fields,
        } as SearchMessagesResponse;
    }
}