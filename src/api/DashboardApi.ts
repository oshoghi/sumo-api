import { SumoApiBase, SumoApiError } from "./BaseApi";
import { Dashboard, QueryTypes } from "../types/Dashboard";
import { SearchApi } from "./SearchApi";
import format from "re-format";
import { TimeRangeGenerator } from "./TimeRangeGenerator";
import { SearchMessagesResponse } from "../types/Search";
import { MetricsApi } from "./MetricsApi";

interface SumoQueryTime {
    from: string;
    to: string;
    timeZone: string;
}

interface SumoDashboardGetResultsOptions {
    timeRange?: SumoQueryTime;
    variableOverrides?: Record<string,string>;
}

interface SumoDashboardResult {
    [key:string]: {
        [queryKey:string]: SearchMessagesResponse
    }
}

export class DashboardApi extends SumoApiBase {
    get = (id:string) => this.jsonOrError<Dashboard>("/api/v2/dashboards/" + id);

    getResultsAsJson = async (id:string, options:SumoDashboardGetResultsOptions) => {
        const { timeRange, variableOverrides } = options;
        const dashboard = await this.get(id);

        if ("error" in dashboard) {
            return dashboard as SumoApiError;
        }

        const searchObj = new SearchApi(this.initOptions);
        const metricsObj = new MetricsApi(this.initOptions);
        const tr = new TimeRangeGenerator();
        const dashboardTimeRange = tr.getTimeRange(dashboard.timeRange);
        const results = {};

        for (let panel of dashboard.panels) {
            if (panel.queries) {
                results[panel.id] = {};

                for (let query of panel?.queries) {
                    const q = format.doubleCurly(query.queryString, variableOverrides).replace(/{{[^}]*}}/g, "*") as string;
                    const panelTimeRange = panel.timeRange && tr.getTimeRange(panel.timeRange);
                    const params = {
                        "query": q,
                        "timeZone": timeRange?.timeZone || "PST",
                        "byReceiptTime": true,
                        ...(panelTimeRange || dashboardTimeRange),
                    };

                    console.log(params);
                    console.log(query.queryType);

                    switch (query.queryType) {
                        case QueryTypes.LOGS:
                            const search = await searchObj.runQuery(params);

                            if ("error" in search) {
                                return search;
                            }

                            results[panel.id][query.queryKey] = search;

                            break;
                        case QueryTypes.METRICS:
                            const metricsSearch = await metricsObj.runQuery({
                                timeRange: panel.timeRange || dashboard.timeRange,
                                queries: [{
                                    query: q,
                                    rowId: query.queryKey,
                                }]
                            });

                            if ("error" in metricsSearch) {
                                return metricsSearch;
                            }

                            results[panel.id][query.queryKey] = metricsSearch;

                            break;
                    }

                }
            }
        }

        return results as SumoDashboardResult;
    }
}
