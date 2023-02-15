import { SumoApiBase } from "./BaseApi";
import { MetricsQueryPayload, MetricsQueryResult } from "../types/Metrics";

export class MetricsApi extends SumoApiBase {
    runQuery = (params:MetricsQueryPayload) => {
        return this.jsonOrError<MetricsQueryResult>("/api/v1/metricsQueries", {
            method: "POST",
            body: JSON.stringify(params)
        });
    }
}