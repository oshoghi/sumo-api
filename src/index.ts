import { TimeRangeGenerator } from "./api/TimeRangeGenerator";
import { SumoApiOptions } from "./api/BaseApi";
import { DashboardApi } from "./api/DashboardApi";
import { SearchApi } from "./api/SearchApi";

export class SumoApi {
    dashboard:DashboardApi;
    search:SearchApi;

    constructor (options:SumoApiOptions) {
        this.dashboard = new DashboardApi(options);
        this.search = new SearchApi(options);
    }
}

export const Time = new TimeRangeGenerator();