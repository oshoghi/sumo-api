import { TimeRange, TimeRangeLiteral, TimeRangeRelative } from "../types/TimeRange";
import dayjs from "dayjs";

type LiteralName = TimeRangeLiteral["from"]["rangeName"];
type TimeComponent = TimeRange["from"];

const relativeUnitMap = {
    "d": "day",
    "m": "minute",
    "h": "hour",
}

const DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss";

export class TimeRangeGenerator {
    getRelativeRange = (from:string) => {
        const parts = from.match(/^-(\d*)([mdh])/);

        return {
            from: dayjs().subtract(parseInt(parts[1]), relativeUnitMap[parts[2]]).format(DATE_FORMAT),
            to: dayjs().format(DATE_FORMAT),
        };
    }

    getLiteralRange = (rangeName:LiteralName) => {
        switch (rangeName) {
            case "today":
                return {
                    from: dayjs().startOf("day").format(DATE_FORMAT),
                    to: dayjs().format(DATE_FORMAT),
                };
            case "yesterday":
                return {
                    from: dayjs().startOf("day").subtract(1, "day").format(DATE_FORMAT),
                    to: dayjs().startOf("day").format(DATE_FORMAT),
                };
        }
    }

    getTimeRange = (range:TimeRange) => {
        switch (range.from.type) {
            case "EpochTimeRangeBoundary":
                return {
                    from: dayjs(range.from.epochMillis).format(DATE_FORMAT),
                    to: dayjs(range.from.epochMillis).format(DATE_FORMAT),
                };
            case "LiteralTimeRangeBoundary":
                return this.getLiteralRange(range.from.rangeName);
            case "RelativeTimeRangeBoundary":
                return this.getRelativeRange((range.from as any).relativeTime);
        }

    }
}