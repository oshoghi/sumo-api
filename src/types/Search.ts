export const SearchStates = {
   GATHERING: "GATHERING RESULTS",
   DONE: "DONE GATHERING RESULTS",
} as const;

export interface Field {
    name: string;
    fieldType: "string" | "long" | "int";
    keyField: boolean;
}

export interface Message {
    map: {
        _raw: string;
        _collector: string;
        _collectorid: string;
        _size: string;
        _messageid: string;
        _sourceid: string;
        _source: string;
    }
}

export interface SearchMessagesResponse {
    fields: Field[];
    messages: Message[];
}

export interface HistogramBucket {
    startTimesamp: number;
    length: number;
    count: number;
}

export interface SearchStartResponse {
    id: string;
    link: {
        rel: "self",
        href: string;
    }
}

export interface SearchStatusResponse {
    state: typeof SearchStates[keyof typeof SearchStates];
    histogramBuckets: HistogramBucket[];
    messageCount: number;
    recordCount: number;
    pendingWarnings: any[],
    pendingErrors: any[],
    usageDetails: {
        dataScannedInBytes: number;
    }
    [key:string]:unknown;
}