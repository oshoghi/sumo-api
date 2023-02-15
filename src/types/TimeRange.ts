export type RelativeTimeUnits = "m" | "h" | "d";
export type RelativeTimeAmount = `-${number}${RelativeTimeUnits}`;

export interface TimeRangeLiteral {
    type: "BeginBoundedTimeRange",
    from: {
        type: "LiteralTimeRangeBoundary",
        rangeName: "today" | "yesterday" | "week" | "month" | "previous_week" | "previous_month";
    }
    to?: null;
}

export interface TimeRangeRelative {
    type: "BeginBoundedTimeRange",
    from: {
        type: "RelativeTimeRangeBoundary";
        relativeTime: RelativeTimeAmount;
    },
}

export interface TimeRangeEpochComponent {
    type: "EpochTimeRangeBoundary",
    epochMillis: number,
}

export interface TimeRangeRange {
    type: "BeginBoundedTimeRange";
    from: TimeRangeEpochComponent;
    to: TimeRangeEpochComponent
}

export type TimeRange = TimeRangeRelative | TimeRangeRange | TimeRangeLiteral;