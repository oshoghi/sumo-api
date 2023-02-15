import { TimeRangeGenerator } from "./api/TimeRangeGenerator";
import { SumoApiOptions } from "./api/BaseApi";
import { DashboardApi } from "./api/DashboardApi";
import { SearchApi } from "./api/SearchApi";
import { MetricsApi } from "./api/MetricsApi";

export class SumoApi {
    dashboard:DashboardApi;
    search:SearchApi;
    metrics:MetricsApi;

    constructor (options:SumoApiOptions) {
        this.dashboard = new DashboardApi(options);
        this.search = new SearchApi(options);
        this.metrics = new MetricsApi(options);
    }
}

export const Time = new TimeRangeGenerator();