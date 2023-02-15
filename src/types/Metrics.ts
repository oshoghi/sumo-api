import { TimeRange } from "./TimeRange";

export interface MetricsQuery {
    rowId: string;
    query: string;
    quantization?: number;
    rollup?: "Avg"
    timeshift?: number;
}

export interface MetricsQueryPayload {
    queries: MetricsQuery[];
    timeRange: TimeRange;
}

export interface MetricsQuerySeries {
    metricDefinition: {
        metric: string;
        dimensions: Record<string,string>;
    },
    points: {
        timestamps: number[];
        values: number[];
    }
}

export interface QueryResult {
    rowId: string;
    timeSeriesList: {
        timeSeries: MetricsQuerySeries[];
        unit?: number;
        timeShiftLabel?: number;
        resultContext: {
            quantizationGranularity: number;
            rollup: 'avg',
            actualQueryTimeRange: {
                start: string;
                end: string;
            }
        }
    }
}

export interface MetricsQueryResult {
    queryResult: QueryResult[];
    errors: {
        id: string;
        errors: string[];
    }
}

